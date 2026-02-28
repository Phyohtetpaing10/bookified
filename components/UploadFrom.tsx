"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Image as ImageIcon, X } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LoadingOverlay from "./LoadingOverlay";

const MAX_PDF_SIZE = 50 * 1024 * 1024;

const formSchema = z.object({
  pdf: z
    .file()
    .mime(["application/pdf"], "Only PDF files are allowed")
    .max(MAX_PDF_SIZE, "PDF file must be 50MB or smaller"),
  cover: z.instanceof(File).optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  voice: z.string().min(1, "Please select a voice"),
});

export default function UploadFrom() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pdf: undefined,
      cover: undefined,
      title: "",
      author: "",
      voice: "rachel",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Form data submitted:", values);
    }, 2000);
  };

  const maleVoices = [
    {
      id: "dave",
      name: "Dave",
      desc: "Young male, British-Essex, casual & conversational",
    },
    {
      id: "daniel",
      name: "Daniel",
      desc: "Middle-aged male, British, authoritative but warm",
    },
    { id: "chris", name: "Chris", desc: "Male, casual & easy-going" },
  ];

  const femaleVoices = [
    {
      id: "rachel",
      name: "Rachel",
      desc: "Young female, American, calm & clear",
    },
    {
      id: "sarah",
      name: "Sarah",
      desc: "Young female, American, soft & approachable",
    },
  ];

  return (
    <div className="new-book-wrapper">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* PDF file upload */}
          <FormField
            control={form.control}
            name="pdf"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel className="form-label">Book PDF File</FormLabel>
                <FormControl>
                  <div>
                    <input
                      {...fieldProps}
                      id="pdf-upload"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onChange(file);
                      }}
                    />
                    {value ? (
                      <div className="upload-dropzone upload-dropzone-uploaded border-2 border-dashed border-[#8B7355]/30">
                        <span className="upload-dropzone-text">
                          {value.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange(undefined);
                            const input = document.getElementById(
                              "pdf-upload",
                            ) as HTMLInputElement;
                            if (input) input.value = "";
                          }}
                          className="upload-dropzone-remove mt-3"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="upload-dropzone border-2 border-dashed border-[#8B7355]/30"
                        onClick={() =>
                          document.getElementById("pdf-upload")?.click()
                        }
                      >
                        <Upload className="upload-dropzone-icon" />
                        <p className="upload-dropzone-text">
                          Click to upload PDF
                        </p>
                        <p className="upload-dropzone-hint">
                          PDF file (max 50MB)
                        </p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover image upload */}
          <FormField
            control={form.control}
            name="cover"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel className="form-label">
                  Cover Image (Optional)
                </FormLabel>
                <FormControl>
                  <div>
                    <input
                      {...fieldProps}
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onChange(file);
                      }}
                    />
                    {value ? (
                      <div className="upload-dropzone upload-dropzone-uploaded border-2 border-dashed border-[#8B7355]/30">
                        <span className="upload-dropzone-text">
                          {value.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange(undefined);
                            const input = document.getElementById(
                              "cover-upload",
                            ) as HTMLInputElement;
                            if (input) input.value = "";
                          }}
                          className="upload-dropzone-remove mt-3"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <div
                        className="upload-dropzone border-2 border-dashed border-[#8B7355]/30"
                        onClick={() =>
                          document.getElementById("cover-upload")?.click()
                        }
                      >
                        <ImageIcon className="upload-dropzone-icon" />
                        <p className="upload-dropzone-text">
                          Click to upload cover image
                        </p>
                        <p className="upload-dropzone-hint">
                          Leave empty to auto-generate from PDF
                        </p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title input */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: Rich Dad Poor Dad"
                    className="form-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Author input */}
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Author Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: Robert Kiyosaki"
                    className="form-input"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Voice selector */}
          <FormField
            control={form.control}
            name="voice"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="form-label">
                  Choose Assistant Voice
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col gap-6"
                  >
                    {/* Male Voices Group */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-[#3d485e]">
                        Male Voices
                      </p>
                      <div className="voice-selector-options flex-col md:flex-row">
                        {maleVoices.map((voice) => (
                          <label
                            key={voice.id}
                            className={`voice-selector-option items-start ${
                              field.value === voice.id
                                ? "voice-selector-option-selected"
                                : "voice-selector-option-default"
                            }`}
                          >
                            <RadioGroupItem
                              value={voice.id}
                              id={voice.id}
                              className="mt-1"
                            />
                            <div className="flex flex-col gap-1 w-full text-left">
                              <span className="font-bold text-[#212a3b] leading-tight">
                                {voice.name}
                              </span>
                              <span className="text-xs text-[#3d485e]">
                                {voice.desc}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Female Voices Group */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-[#3d485e]">
                        Female Voices
                      </p>
                      <div className="voice-selector-options flex-col md:flex-row">
                        {femaleVoices.map((voice) => (
                          <label
                            key={voice.id}
                            className={`voice-selector-option items-start ${
                              field.value === voice.id
                                ? "voice-selector-option-selected"
                                : "voice-selector-option-default"
                            }`}
                          >
                            <RadioGroupItem
                              value={voice.id}
                              id={voice.id}
                              className="mt-1"
                            />
                            <div className="flex flex-col gap-1 w-full text-left">
                              <span className="font-bold text-[#212a3b] leading-tight">
                                {voice.name}
                              </span>
                              <span className="text-xs text-[#3d485e]">
                                {voice.desc}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <button type="submit" className="form-btn">
            Begin Synthesis
          </button>
        </form>
      </Form>
      {isSubmitting && <LoadingOverlay />}
    </div>
  );
}
