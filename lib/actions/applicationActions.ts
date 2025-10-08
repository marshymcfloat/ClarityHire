"use server";

import prisma from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { revalidatePath } from "next/cache";
import { createBackendApplicationSchema } from "../zod/JobApplicationSchema";

async function getQuestionsForJob(jobId: string) {
  return await prisma.questionOnJob.findMany({
    where: { jobId },
    select: {
      isRequired: true,
      question: {
        select: { id: true, question: true, options: true, type: true },
      },
    },
    orderBy: { order: "asc" },
  });
}

export async function submitApplication(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized: You must be logged in." };
  }
  const userId = session.user.id;

  const jobId = formData.get("jobId") as string;
  const questions = await getQuestionsForJob(jobId);
  if (!questions) {
    return { success: false, error: "Job not found or has no questions." };
  }
  const ApplicationSchema = createBackendApplicationSchema(questions);
  const dataToParse = {
    jobId: jobId,
    answers: formData.get("answers"),
    resumeType: formData.get("resumeType"),
    resumeFile: formData.get("resumeFile"),
    resumeId: formData.get("resumeId"),
  };
  const result = ApplicationSchema.safeParse(dataToParse);

  if (!result.success) {
    return {
      success: false,
      error: "Validation failed.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { answers, ...resumeData } = result.data;

  try {
    // 3. --- BUSINESS LOGIC: Check for existing application ---
    const existingApplication = await prisma.application.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });
    if (existingApplication) {
      return {
        success: false,
        error: "You have already applied for this job.",
      };
    }

    let resumeIdForApplication: string;

    // 4. --- RESUME HANDLING ---
    if (resumeData.resumeType === "new") {
      // --- Upload file to cloud storage (e.g., S3, Vercel Blob) ---
      // This part is specific to your cloud provider.
      // const file = resumeData.resumeFile;
      // const { url } = await uploadToCloud(file.name, file); // FAKE FUNCTION
      const FAKE_UPLOAD_URL =
        "https://your-cloud-storage.com/path/to/resume.pdf";

      const newResume = await prisma.resume.create({
        data: {
          name: resumeData.resumeFile.name,
          url: FAKE_UPLOAD_URL, // Use the URL from your cloud storage
          userId: userId,
        },
      });
      resumeIdForApplication = newResume.id;
    } else {
      // Security Check: Verify the existing resume belongs to the current user
      const existingResume = await prisma.resume.findFirst({
        where: { id: resumeData.resumeId, userId: userId },
      });
      if (!existingResume) {
        return { success: false, error: "Invalid resume selected." };
      }
      resumeIdForApplication = existingResume.id;
    }

    // 5. --- DATABASE TRANSACTION: Create application and answers atomically ---
    await prisma.$transaction(async (tx) => {
      // Create the main Application record
      const newApplication = await tx.application.create({
        data: {
          jobId: jobId,
          userId: userId,
          resumeId: resumeIdForApplication,
          status: "SUBMITTED",
        },
      });

      const transformedAnswers = answers.map((ans) => ({
        applicationId: newApplication.id,
        questionId: ans.questionId,
        answer: Array.isArray(ans.answer) ? ans.answer : [String(ans.answer)], // Wrap single values in an array
      }));

      // Create all answer records in one go
      await tx.applicationAnswer.createMany({
        data: transformedAnswers,
      });
    });

    revalidatePath(`/jobs/${jobId}`); // Or any other relevant path
    return { success: true, message: "Application submitted successfully!" };
  } catch (error) {
    console.error("Application submission error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
