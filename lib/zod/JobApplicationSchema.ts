// /lib/validation/applicationSchema.ts

import { z } from "zod";
import { QuestionTypeEnum } from "@prisma/client";

// STEP 1: Define the type for a question, matching your Prisma query result.
// This ensures type safety when creating the schema.
export type ConfiguredQuestion = {
  question: {
    id: string;
    question: string;
    type: QuestionTypeEnum;
    options: string[];
  };
  isRequired: boolean;
};

// STEP 2: Reuse the exact same function from your frontend.
// This keeps your validation logic DRY (Don't Repeat Yourself).
export const createQuestionSchema = (question: ConfiguredQuestion) => {
  const { type } = question.question;
  const isRequired = question.isRequired;
  let schema;

  switch (type) {
    case QuestionTypeEnum.TEXT:
      schema = z.string();
      if (isRequired) schema = schema.min(1, "This field is required.");
      else schema = schema.optional().or(z.literal(""));
      break;
    case QuestionTypeEnum.NUMBER:
      schema = z.preprocess(
        (val) => {
          if (val === "" || val === null || val === undefined) return undefined;
          const num = Number(val);
          return isNaN(num) ? undefined : num;
        },
        isRequired
          ? z.number({ message: "Please enter a valid number." })
          : z.number().optional()
      );
      break;
    case QuestionTypeEnum.CHECKBOX:
      schema = z.array(z.string());
      if (isRequired)
        schema = schema.min(1, "Please select at least one option.");
      break;
    case QuestionTypeEnum.MULTIPLE_CHOICE:
    case QuestionTypeEnum.TRUE_OR_FALSE:
      schema = z.string();
      if (isRequired) schema = schema.min(1, "Please select an option.");
      else schema = schema.optional().or(z.literal(""));
      break;
    default:
      schema = z.any();
  }
  return schema;
};

// --- SERVER-SPECIFIC SCHEMA LOGIC ---

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// Schema for a file received in a Server Action.
// It checks properties rather than `instanceof`.
const BackendFileSchema = z
  .any()
  .refine((file): file is File => file && file.size, "Resume file is required.")
  .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (file) => ACCEPTED_RESUME_TYPES.includes(file.type),
    "Only .pdf, .doc, and .docx formats are supported."
  );

// Schema for when a user uploads a new resume.
const NewResumeSchema = z.object({
  resumeType: z.literal("new"),
  resumeFile: BackendFileSchema,
});

// Schema for when a user selects an existing resume.
const ExistingResumeSchema = z.object({
  resumeType: z.literal("old"),
  resumeId: z.string().min(1, "Resume ID is required."),
});

// Schema for parsing the 'answers' JSON string from FormData.
const AnswersSchema = z
  .string({ message: "Answers are missing." })
  .transform((str, ctx) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({
        code: "custom",
        message: "Invalid JSON format for answers.",
      });
      return z.NEVER;
    }
  })
  .pipe(
    z.array(
      z.object({
        questionId: z.string(),
        answer: z.any(), // The specific answer is validated in superRefine.
      })
    )
  );

/**
 * Creates the final Zod schema for validating a job application from FormData.
 * @param questions The configured questions for this specific job, fetched from the database.
 * This is the "source of truth" for dynamic answer validation.
 */
export const createBackendApplicationSchema = (
  questions: ConfiguredQuestion[]
) => {
  return z
    .object({
      jobId: z.string().min(1, "Job ID is required."), // Important for security and context
      answers: AnswersSchema,
    })
    .and(
      z.discriminatedUnion("resumeType", [
        NewResumeSchema,
        ExistingResumeSchema,
      ])
    )
    .superRefine((data, ctx) => {
      // Create a map for efficient question lookup
      const questionMap = new Map(questions.map((q) => [q.question.id, q]));

      // Validate each submitted answer against its corresponding question schema
      data.answers.forEach((submittedAnswer, index) => {
        const question = questionMap.get(submittedAnswer.questionId);

        if (!question) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid question ID submitted: ${submittedAnswer.questionId}`,
            path: ["answers", index, "questionId"],
          });
          return;
        }

        const questionSchema = createQuestionSchema(question);
        const result = questionSchema.safeParse(submittedAnswer.answer);

        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.addIssue({
              ...issue,
              path: ["answers", index, "answer"], // Correctly map error to the specific answer
            });
          });
        }
      });
    });
};
