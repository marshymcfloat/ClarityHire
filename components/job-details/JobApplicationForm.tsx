"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import {
  ConfiguredQuestion,
  ConfiguredResumeType,
} from "./ApplyJobDataContainer";
import QuestionRenderer from "./QuestionRenderer";
import { QuestionTypeEnum } from "@prisma/client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { CheckCircle, PaperclipIcon } from "lucide-react";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
  .refine(
    (file) => ACCEPTED_RESUME_TYPES.includes(file.type),
    "Only .pdf, .doc, and .docx formats are supported."
  );

const resumeDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  createdAt: z.date(),
});

const newResumeSchema = z.object({
  type: z.literal("new"),
  file: fileSchema,
});

const existingResumeSchema = z.object({
  type: z.literal("old"),
  details: resumeDetailsSchema,
});

const resumeUnionSchema = z.discriminatedUnion("type", [
  newResumeSchema,
  existingResumeSchema,
]);

const createQuestionSchema = (question: ConfiguredQuestion) => {
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

const JobApplicationForm = ({
  questions,
  resumes,
}: {
  questions: ConfiguredQuestion[];
  resumes: ConfiguredResumeType[];
}) => {
  const formSchema = useMemo(() => {
    const answersSchema = z.object({
      answers: z.array(
        z.object({
          questionId: z.string(),
          answer: z.any(),
        })
      ),
    });

    return z
      .object({
        resume: resumeUnionSchema.refine((val) => val !== undefined, {
          message: "Please select or upload a resume.",
        }),
        answers: z.array(
          z.object({
            questionId: z.string(),
            answer: z.any(),
          })
        ),
      })
      .superRefine((data, ctx) => {
        if (!data.resume) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select or upload a resume.",
            path: ["resume"],
          });
        }

        data.answers.forEach((answer, index) => {
          const question = questions[index];
          if (!question) return;

          const questionSchema = createQuestionSchema(question);
          const result = questionSchema.safeParse(answer.answer);

          if (!result.success) {
            result.error.issues.forEach((issue) => {
              ctx.addIssue({
                ...issue,
                path: ["answers", index, "answer"],
              });
            });
          }
        });
      });
  }, [questions]);

  const [availableResumes, setAvailableResumes] =
    useState<(File | ConfiguredResumeType)[]>(resumes);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: undefined,
      answers: questions.map((q) => ({
        questionId: q.question.id,
        answer: q.question.type === "CHECKBOX" ? [] : "",
      })),
    },
    mode: "onBlur",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form Submitted Successfully. Raw values:", values);
    const formData = new FormData();
    formData.append("answers", JSON.stringify(values.answers));
    if (values.resume.type === "new") {
      formData.append("resumeType", "new");
      formData.append("resumeFile", values.resume.file);
    } else {
      formData.append("resumeType", "old");
      formData.append("resumeId", values.resume.details.id);
    }
    alert("Check the console to see the prepared FormData object!");
  }

  const handleSelectResume = (resume: File | ConfiguredResumeType) => {
    if (resume instanceof File) {
      form.setValue(
        "resume",
        { type: "new", file: resume },
        { shouldValidate: true }
      );
    } else {
      form.setValue(
        "resume",
        { type: "old", details: resume },
        { shouldValidate: true }
      );
    }
    setSelectedResumeId("id" in resume ? resume.id : resume.name);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];

      try {
        fileSchema.parse(newFile);
        setAvailableResumes((prev) => [...prev, newFile]);
        handleSelectResume(newFile);
      } catch (error) {
        if (error instanceof z.ZodError) {
          alert(error.issues[0].message);
        }
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-4 max-w-2xl mx-auto overflow-y-auto"
      >
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Select Resume</h2>
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="resume"
              render={({ fieldState }) => (
                <FormItem>
                  {availableResumes.map((resume) => {
                    const isFromDb = "id" in resume;
                    const resumeId = isFromDb ? resume.id : resume.name;
                    const isSelected = selectedResumeId === resumeId;

                    return (
                      <Item
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all",
                          isSelected && "border-primary ring-2 ring-primary"
                        )}
                        key={resumeId}
                        onClick={() => handleSelectResume(resume)}
                      >
                        <ItemContent>
                          <ItemTitle className="text-base">
                            {resume.name}
                          </ItemTitle>
                          <ItemDescription className="text-xs">
                            {isFromDb ? (
                              <>
                                Uploaded:{" "}
                                <span className="font-medium text-foreground">
                                  {new Date(
                                    resume.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </>
                            ) : (
                              <span className="font-medium text-blue-500">
                                New file
                              </span>
                            )}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          {isSelected ? (
                            <CheckCircle className="size-5 text-primary" />
                          ) : (
                            <div className="size-5" />
                          )}
                        </ItemActions>
                      </Item>
                    );
                  })}

                  <div
                    className="hover:bg-muted duration-150 transition-all cursor-pointer border-2 border-dashed rounded-lg p-4"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <PaperclipIcon className="size-5" />
                        </EmptyMedia>
                        <EmptyTitle>Upload New Resume</EmptyTitle>
                      </EmptyHeader>
                    </Empty>
                  </div>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />

                  {fieldState.error && (
                    <p className="text-sm font-medium text-destructive mt-2">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Application Questions</h2>
          {questions.map((question, index) => (
            <div
              key={question.question.id}
              className="space-y-4 p-4 border rounded-lg bg-card"
            >
              <QuestionRenderer
                control={form.control}
                question={question}
                index={index}
              />
            </div>
          ))}
        </div>

        <Button type="submit" className="w-full" size="lg">
          Submit Application
        </Button>
      </form>
    </Form>
  );
};

export default JobApplicationForm;
