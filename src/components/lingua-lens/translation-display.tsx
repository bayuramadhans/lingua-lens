"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, FileText, ImageIcon, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "./loading-spinner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TranslationDisplayProps {
  imageDataUri?: string | null;
  originalText: string | null;
  translatedText: string | null;
  detectedLanguageName?: string | null;
  targetLanguageLabel?: string | null;
  isOcrLoading: boolean;
  isTranslationLoading: boolean;
}

export function TranslationDisplay({
  imageDataUri,
  originalText,
  translatedText,
  detectedLanguageName,
  targetLanguageLabel,
  isOcrLoading,
  isTranslationLoading,
}: TranslationDisplayProps) {
  const { toast } = useToast();

  const handleCopy = (text: string | null, type: string) => {
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          toast({
            title: "Copied to Clipboard",
            description: `${type} text has been copied.`,
          });
        })
        .catch(err => {
          toast({
            variant: "destructive",
            title: "Copy Failed",
            description: `Could not copy ${type} text: ${err.message}`,
          });
        });
    }
  };

  const renderImageCard = () => {
    if (isOcrLoading && !imageDataUri) {
      return (
        <Card className="shadow-lg min-h-[300px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <ImageIcon className="mr-2 h-5 w-5 text-primary" />
              Uploaded Image
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            <LoadingSpinner size={48} />
            <p className="mt-4 text-muted-foreground">Loading image...</p>
          </CardContent>
        </Card>
      );
    }

    if (!imageDataUri) {
       return (
        <Card className="shadow-lg min-h-[200px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <ImageIcon className="mr-2 h-5 w-5 text-primary" />
              Uploaded Image
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            <p className="text-muted-foreground">No image uploaded yet.</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
             <ImageIcon className="mr-2 h-5 w-5 text-primary" />
            Uploaded Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video w-full max-w-md mx-auto rounded-md overflow-hidden border">
            <Image
              src={imageDataUri}
              alt="Uploaded image for OCR"
              layout="fill"
              objectFit="contain"
              data-ai-hint="uploaded content"
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTextContentCard = (
    title: string,
    text: string | null,
    isLoading: boolean,
    isInitialPlaceholder: boolean = false,
    languageLabel?: string | null
  ) => {
    const placeholderMessage = isLoading
      ? "Processing..."
      : isInitialPlaceholder 
        ? (title === "Original Text" ? "Upload an image to see the extracted text here." : "Upload an image and select a target language to see the translation.")
        : (title === "Original Text" ? "No text extracted." : "No translation available.");
    
    const IconComponent = title === "Original Text" ? FileText : Languages;

    return (
      <Card className="flex-1 shadow-lg min-h-[250px] flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center text-xl">
                <IconComponent className="mr-2 h-5 w-5 text-primary" /> 
                {title}
              </CardTitle>
              {languageLabel && <CardDescription>{languageLabel}</CardDescription>}
            </div>
            {text && !isLoading && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(text, title)}
                aria-label={`Copy ${title.toLowerCase()}`}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex">
          {isLoading ? (
            <div className="m-auto text-center">
              <LoadingSpinner size={48} />
              <p className="mt-4 text-muted-foreground">{placeholderMessage}</p>
            </div>
          ) : text || (text === "" && title === "Original Text" && !isInitialPlaceholder) ? ( // Allow empty string for "No text extracted"
             text === "" && title === "Original Text" && !isInitialPlaceholder ? (
                <div className="m-auto text-center text-muted-foreground">
                  <p>No text could be extracted from the image.</p>
                </div>
             ) : (
                <ScrollArea className="h-full w-full whitespace-pre-wrap p-1 rounded-md border">
                  <pre className="text-sm p-3 font-body">{text}</pre>
                </ScrollArea>
             )
          ) : (
            <div className="m-auto text-center text-muted-foreground">
              <p>{placeholderMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 flex flex-col gap-6">
      {renderImageCard()}
      {renderTextContentCard(
        "Original Text",
        originalText,
        isOcrLoading,
        !originalText && !isOcrLoading && !imageDataUri, // isInitialPlaceholder for original text
        detectedLanguageName ? `Detected: ${detectedLanguageName}` : (originalText === "" ? "Language detection skipped" : undefined)
      )}
      {renderTextContentCard(
        "Translated Text",
        translatedText,
        isTranslationLoading,
        !translatedText && !isTranslationLoading && !originalText && !imageDataUri, // isInitialPlaceholder for translated text
        targetLanguageLabel ? `To: ${targetLanguageLabel}` : undefined
      )}
    </div>
  );
}
