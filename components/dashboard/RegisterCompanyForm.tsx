"use client";

import {
  createCompanySchema,
  CreateCompanyValue,
} from "@/zod schemas/dashboard schemas/companySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Camera, CloudUpload } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useEffect, useState } from "react";
import Image from "next/image";

type PreviewURLsType = {
  image: string | null;
  coverImage: string | null;
};

const RegisterCompanyForm = () => {
  const [previews, setPreviews] = useState<PreviewURLsType>({
    image: null,
    coverImage: null,
  });

  const form = useForm<CreateCompanyValue>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      coverImage: undefined,
      image: undefined,
    },
  });

  const imageFile = form.watch("image");
  const coverImageFile = form.watch("coverImage");

  useEffect(() => {
    if (imageFile && imageFile instanceof File) {
      const url = URL.createObjectURL(imageFile);
      setPreviews((prev) => ({ ...prev, image: url }));

      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  useEffect(() => {
    if (coverImageFile && coverImageFile instanceof File) {
      const url = URL.createObjectURL(coverImageFile);
      setPreviews((prev) => ({ ...prev, coverImage: url }));

      return () => URL.revokeObjectURL(url);
    }
  }, [coverImageFile]);

  const onSubmit = (values: CreateCompanyValue) => {
    console.log(values);
  };

  const textFields = ["name", "location"] as const;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="relative">
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field: { value, onChange, ...rest } }) => (
              <FormItem>
                <div className="group relative h-[200px] w-full overflow-hidden rounded-md bg-slate-200">
                  {previews.coverImage && (
                    <Image
                      src={previews.coverImage}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                  )}
                  <FormLabel
                    htmlFor="coverImage-input"
                    className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center bg-black/50 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  >
                    <CloudUpload size={40} />
                    <span className="mt-2 font-medium">Upload Cover Image</span>
                  </FormLabel>
                </div>
                <FormControl>
                  <Input
                    id="coverImage-input"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    {...rest}
                    onChange={(e) => onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[30%]">
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem>
                  <div className="group relative size-40 overflow-hidden rounded-full border-4 border-white bg-slate-400">
                    {previews.image && (
                      <Image
                        src={previews.image}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                    )}
                    <FormLabel
                      htmlFor="profileImage-input"
                      className="absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center bg-black/50 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      <Camera size={32} />
                      <span className="mt-1 text-sm font-medium">Upload</span>
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      id="profileImage-input"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      {...rest}
                      onChange={(e) => onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage className="absolute" />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="pt-24 space-y-6">
          <div className="flex  gap-12">
            {textFields.map((input) => (
              <FormField
                key={input}
                control={form.control}
                name={input}
                render={({ field }) => (
                  <FormItem className=" flex-1">
                    <FormLabel className="capitalize">{input}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize">Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="w-full flex justify-end">
          <Button type="submit">Register</Button>
        </div>
      </form>
    </Form>
  );
};

export default RegisterCompanyForm;
