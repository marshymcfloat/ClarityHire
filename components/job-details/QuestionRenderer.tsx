// components/QuestionRenderer.tsx (New File)
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

type QuestionRendererProps = {
  control: Control<any>; // Pass the control object from RHF
  question: ConfiguredQuestion;
  index: number;
};

const QuestionRenderer = ({
  control,
  question,
  index,
}: QuestionRendererProps) => {
  const questionData = question.question;

  // This is the "name" of our field in the RHF state.
  // It corresponds to `answers[index].answer`
  const fieldName = `answers.${index}.answer` as const;

  switch (questionData.type) {
    case "TEXT":
      return (
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg capitalize">
                {questionData.question}
              </FormLabel>
              <FormControl>
                <Input placeholder="Your answer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "NUMBER":
      return (
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg capitalize">
                {questionData.question}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Your answer"
                  {...field}
                  onChange={(event) => field.onChange(+event.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "TRUE_OR_FALSE":
    case "MULTIPLE_CHOICE":
      return (
        <FormField
          control={control}
          name={fieldName}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-lg capitalize">
                {questionData.question}
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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

    case "CHECKBOX":
      return (
        <FormField
          control={control}
          name={fieldName}
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-lg capitalize">
                  {questionData.question}
                </FormLabel>
              </div>
              <div className="flex flex-wrap gap-4">
                {questionData.options.map((option) => (
                  <div className="px-4 py-2 bg-muted rounded-full" key={option}>
                    <FormField
                      control={control}
                      name={fieldName}
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option}
                            className="flex flex-row items-start  space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, option])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== option
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
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
