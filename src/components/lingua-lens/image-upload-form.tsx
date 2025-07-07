"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, Link as LinkIcon, ImageUp } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "./loading-spinner";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const formSchema = z.object({
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  imageFile: z
    .custom<FileList>()
    .refine((files) => files === undefined || files.length === 0 || (files.length === 1 && files[0].size <= MAX_FILE_SIZE), {
      message: `Max file size is ${MAX_FILE_SIZE / (1024*1024)}MB.`,
    })
    .refine((files) => files === undefined || files.length === 0 || (files.length === 1 && ALLOWED_IMAGE_TYPES.includes(files[0].type)), {
      message: "Only .jpg, .jpeg, .png, .webp and .gif formats are supported.",
    })
    .optional(),
});

type ImageUploadFormValues = z.infer<typeof formSchema>;

interface ImageUploadFormProps {
  onImageSubmit: (dataUri: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ImageUploadForm({ onImageSubmit, isLoading, disabled = false }: ImageUploadFormProps) {
  const [activeTab, setActiveTab] = useState<"file" | "url">("file");
  const { toast } = useToast();

  const form = useForm<ImageUploadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
      imageFile: undefined,
    },
  });

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  async function onSubmit(values: ImageUploadFormValues) {
    if (disabled) return;
    
    if (activeTab === "file" && values.imageFile && values.imageFile.length > 0) {
      const file = values.imageFile[0];
      try {
        const dataUri = await fileToDataUri(file);
        onImageSubmit(dataUri);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to read image file.",
        });
      }
    } else if (activeTab === "url" && values.imageUrl) {
      onImageSubmit(values.imageUrl);
    } else {
       toast({
          variant: "destructive",
          title: "No Image Provided",
          description: "Please upload a file or enter an image URL.",
        });
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      form.setValue("imageFile", files, { shouldValidate: true });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="file" onValueChange={(value) => setActiveTab(value as "file" | "url")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="file"
              aria-label="Upload a file"
              className="text-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              disabled={disabled}
            >
              <UploadCloud className="mr-2 h-4 w-4" /> Upload File
            </TabsTrigger>
            <TabsTrigger
              value="url"
              aria-label="Enter image URL"
              className="text-accent data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              disabled={disabled}
            >
              <LinkIcon className="mr-2 h-4 w-4" /> Image URL
            </TabsTrigger>
          </TabsList>
          <TabsContent value="file" className="mt-4">
            <FormField
              control={form.control}
              name="imageFile"
              render={() => (
                <FormItem>
                  <FormLabel htmlFor="imageFile-input">Choose an image file</FormLabel>
                  <FormControl>
                    <Input
                      id="imageFile-input"
                      type="file"
                      accept={ALLOWED_IMAGE_TYPES.join(',')}
                      onChange={handleFileChange}
                      disabled={isLoading || disabled}
                      className="cursor-pointer file:text-primary file:font-semibold"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="url" className="mt-4">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.png or data:image/..." {...field} disabled={isLoading || disabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <Button type="submit" disabled={isLoading || disabled} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? (
            <LoadingSpinner size={20} className="mr-2 text-accent-foreground" />
          ) : (
            <ImageUp className="mr-2 h-5 w-5" />
          )}
          {disabled ? 'Limit Reached' : 'Extract Text'}
        </Button>
      </form>
    </Form>
  );
}
