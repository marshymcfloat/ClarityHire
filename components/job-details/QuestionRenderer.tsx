"use client";

import { Control } from "react-hook-form";
import { ConfiguredQuestion } from "./ApplyJobDataContainer";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { QuestionTypeEnum } from "@prisma/client";

type QuestionRendererProps = {
  control: Control<any>;
  question: ConfiguredQuestion;
  index: number;
};

const QuestionRenderer = ({
  control,
  question,
  index,
}: QuestionRendererProps) => {
  const questionData = question.question;
  const fieldName = `answers.${index}.answer` as const;
  const isRequired = question.isRequired;

  const renderRequiredIndicator = () => {
    if (!isRequired) return null;
    return <span className="text-destructive ml-1">*</span>;
  };

  switch (questionData.type) {
    case QuestionTypeEnum.TEXT:
      return (
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg capitalize">
                {questionData.question}
                {renderRequiredIndicator()}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Your answer"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case QuestionTypeEnum.NUMBER:
      return (
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg capitalize">
                {questionData.question}
                {renderRequiredIndicator()}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Your answer"
                  {...field}
                  value={field.value || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      field.onChange(undefined);
                    } else {
                      field.onChange(value);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case QuestionTypeEnum.TRUE_OR_FALSE:
    case QuestionTypeEnum.MULTIPLE_CHOICE:
      return (
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg capitalize">
                {questionData.question}
                {renderRequiredIndicator()}
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  className="flex flex-col space-y-1"
                >
                  {(questionData.type === "TRUE_OR_FALSE"
                    ? ["True", "False"]
                    : questionData.options
                  ).map((option) => (
                    <FormItem
                      key={option}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={option} />
                      </FormControl>
                      <FormLabel className="font-normal">{option}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case QuestionTypeEnum.CHECKBOX:
      return (
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-lg capitalize">
                  {questionData.question}
                  {renderRequiredIndicator()}
                </FormLabel>
              </div>
              <div className="flex flex-wrap gap-4">
                {questionData.options.map((option) => (
                  <div className="px-4 py-2 bg-muted rounded-full" key={option}>
                    <FormField
                      control={control}
                      name={fieldName}
                      render={({ field: checkboxField }) => {
                        const fieldValue = Array.isArray(checkboxField.value)
                          ? checkboxField.value
                          : [];
                        return (
                          <FormItem
                            key={option}
                            className="flex flex-row items-start space-y-0 gap-x-2"
                          >
                            <FormControl>
                              <Checkbox
                                checked={fieldValue.includes(option)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? checkboxField.onChange([
                                        ...fieldValue,
                                        option,
                                      ])
                                    : checkboxField.onChange(
                                        fieldValue.filter(
                                          (value: string) => value !== option
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {option}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    default:
      return null;
  }
};

export default QuestionRenderer;
