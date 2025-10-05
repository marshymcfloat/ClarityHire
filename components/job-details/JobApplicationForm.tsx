"use client";

import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ConfiguredQuestion } from "./ApplyJobDataContainer";

const JobApplicationForm = ({
  questions,
}: {
  questions: ConfiguredQuestion[];
}) => {
  console.log(questions);

  function RenderQuestion(question: ConfiguredQuestion, index: number) {
    switch (question.question.type) {
      case "TEXT":
        return (
          <div className="mb-6" key={index}>
            <Label
              htmlFor={`text-${index}`}
              className="block text-lg font-medium text-gray-800 mb-2 capitalize"
            >
              {question.question.question}
            </Label>
            <Input
              type="text"
              id={`text-${index}`}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        );

      case "NUMBER":
        return (
          <div className="mb-6" key={index}>
            <Label
              htmlFor={`number-${index}`}
              className="block text-lg font-medium text-gray-800 mb-2 capitalize"
            >
              {question.question.question}
            </Label>
            <Input
              type="number"
              id={`number-${index}`}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        );

      case "CHECKBOX":
        return (
          <div className="mb-6" key={index}>
            <Label className="block text-lg font-medium text-gray-800 mb-3 capitalize">
              {question.question.question}
            </Label>
            {/* Changed from grid to flex flex-wrap */}
            <div className="flex flex-wrap gap-3 p-1">
              {" "}
              {/* Added gap for spacing between items */}
              {question.question.options.map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  {" "}
                  {/* Added full rounded and border */}
                  <Checkbox
                    id={`checkbox-${option}-${index}`}
                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <Label
                    htmlFor={`checkbox-${option}-${index}`}
                    className="text-base text-gray-700 cursor-pointer select-none"
                  >
                    {option}
                  </Label>{" "}
                  {/* Added select-none */}
                </div>
              ))}
            </div>
          </div>
        );

      case "MULTIPLE_CHOICE":
        return (
          <div className="mb-6" key={index}>
            <Label className="block text-lg font-medium text-gray-800 mb-3">
              {question.question.question}
            </Label>
            <RadioGroup className="flex flex-wrap gap-3 p-1">
              {" "}
              {question.question.options.map((option, optionIndex) => (
                <div
                  key={option}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  {" "}
                  <RadioGroupItem
                    value={option}
                    id={`radio-${option}-${index}`}
                    className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <Label
                    htmlFor={`radio-${option}-${index}`}
                    className="text-base text-gray-700 cursor-pointer select-none"
                  >
                    {option}
                  </Label>{" "}
                  {/* Added select-none */}
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "TRUE_OR_FALSE":
        return (
          <div className="mb-6" key={index}>
            <Label className="block text-lg font-medium text-gray-800 mb-3">
              {question.question.question}
            </Label>
            <RadioGroup className="flex flex-wrap gap-3 p-1">
              {" "}
              {/* Adjusted spacing and added flex-wrap */}
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors border border-gray-200">
                <RadioGroupItem
                  value="true"
                  id={`true-${index}`}
                  className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <Label
                  htmlFor={`true-${index}`}
                  className="text-base text-gray-700 cursor-pointer select-none"
                >
                  True
                </Label>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors border border-gray-200">
                <RadioGroupItem
                  value="false"
                  id={`false-${index}`}
                  className="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <Label
                  htmlFor={`false-${index}`}
                  className="text-base text-gray-700 cursor-pointer select-none"
                >
                  False
                </Label>
              </div>
            </RadioGroup>
          </div>
        );
    }
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      {questions.map((question, index) => RenderQuestion(question, index))}
    </div>
  );
};

export default JobApplicationForm;
