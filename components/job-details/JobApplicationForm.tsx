"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../ui/button";
import { Form } from "../ui/form";
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
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { File, PaperclipIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { useRef, useState } from "react";

const createQuestionSchema = (question: ConfiguredQuestion) => {
  const { type } = question.question;
  const isRequired = question.isRequired;

  let schema;

  switch (type) {
    case QuestionTypeEnum.TEXT:
      schema = z.string();
      if (isRequired) {
        schema = schema.min(1, "This field is required.");
      }
      break;
    case QuestionTypeEnum.NUMBER:
      schema = z.number();
      if (!isRequired) {
        schema = schema.optional().or(z.literal(""));
      }
      break;
    case QuestionTypeEnum.CHECKBOX:
      schema = z.array(z.string());
      if (isRequired) {
        schema = schema.min(1, "Please select at least one option.");
      }
      break;
    case QuestionTypeEnum.MULTIPLE_CHOICE:
    case QuestionTypeEnum.TRUE_OR_FALSE:
      schema = z.string();
      if (isRequired) {
        schema = schema.min(1, "Please select an option.");
      }
      break;
    default:
      schema = z.any();
  }

  return z.object({
    questionId: z.string(),
    answer: schema,
  });
};

const JobApplicationForm = ({
  questions,
  resumes,
}: {
  questions: ConfiguredQuestion[];
  resumes: ConfiguredResumeType[];
}) => {
  const [userResumes, setuserResumes] =
    useState<(File | ConfiguredResumeType)[]>(resumes);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formSchema = z.object({
    answers: z.array(
      z.lazy(() => {
        return z.custom((data: any) => {
          const question = questions.find(
            (q) => q.question.id === data.questionId
          );
          if (!question) return false;
          return createQuestionSchema(question).safeParse(data).success;
        });
      })
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: questions.map((q) => ({
        questionId: q.question.id,
        answer: q.question.type === "CHECKBOX" ? [] : "",
      })),
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form Submitted Successfully:", values);
  }

  const dateNow = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-4 overflow-y-auto"
      >
        <div className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-4 text-card-foreground">
          {userResumes.map((resume, index) => {
            // Check if the item is a ConfiguredResumeType from the DB
            const isFromDb = "createdAt" in resume;

            return (
              <Item
                variant={"outline"}
                className="bg-secondary"
                // Use a more robust key. The 'id' exists on DB resumes.
                // For new files, we can use the name and size for uniqueness.
                key={isFromDb ? resume.id : `${resume.name}-${resume.size}`}
              >
                <ItemContent>
                  {/* The 'name' property exists on both types */}
                  <ItemTitle>{resume.name}</ItemTitle>
                  <ItemDescription className="text-xs">
                    {isFromDb ? (
                      <>
                        Uploaded At:{" "}
                        <span className="font-medium text-foreground">
                          {new Date(resume.createdAt).toLocaleDateString()}
                        </span>
                      </>
                    ) : (
                      // Display different info for a newly added file
                      <span className="font-medium text-blue-500">
                        New file (not uploaded)
                      </span>
                    )}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="outline" size="sm" className="">
                    Select
                  </Button>
                </ItemActions>
              </Item>
            );
          })}

          <Empty
            className="hover:bg-muted duration-150 transition-all cursor-pointer"
            onClick={() => {
              if (fileInputRef && fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
          >
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PaperclipIcon className="size-5" />
              </EmptyMedia>
              <EmptyTitle>Add New Resume</EmptyTitle>
              <EmptyDescription>
                Click to browse or drag and drop your file.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>

          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const newFile = e.target.files[0];

                const newResumeEntry: ConfiguredResumeType = {
                  id: crypto.randomUUID(), // Use a proper unique ID for the key
                  name: newFile.name,
                  createdAt: new Date(), // Use the current date
                  url: URL.createObjectURL(newFile), // Create a temporary local URL for preview
                };

                setuserResumes((prev) => [...prev, newResumeEntry]);
              }
            }}
            className="hidden"
            ref={fileInputRef}
          />
        </div>
        {questions.map((question, index) => (
          <QuestionRenderer
            key={question.question.id}
            control={form.control}
            question={question}
            index={index}
          />
        ))}
        <Button type="submit" className="w-full ">
          Submit Application
        </Button>
      </form>
    </Form>
  );
};

export default JobApplicationForm;
