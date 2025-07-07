"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TARGET_LANGUAGES, LanguageOption } from "@/lib/languages";
import { Languages, Info } from "lucide-react";
import { LoadingSpinner } from "./loading-spinner";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LanguageSelectorProps {
  targetLanguage: string;
  onTargetLanguageChange: (languageCode: string) => void;
  detectedLanguageName?: string | null;
  isLoading: boolean;
  disabled?: boolean;
}

export function LanguageSelector({
  targetLanguage,
  onTargetLanguageChange,
  detectedLanguageName,
  isLoading,
  disabled = false,
}: LanguageSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="target-language" className="flex items-center text-base">
          <Languages className="mr-2 h-5 w-5 text-primary" />
          Target Language
        </Label>
        {detectedLanguageName && (
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="cursor-default flex items-center">
                  <Info className="mr-1.5 h-3 w-3" /> Detected: {detectedLanguageName}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Language automatically detected from the image.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={targetLanguage}
          onValueChange={onTargetLanguageChange}
          disabled={disabled || isLoading}
          name="target-language"
          aria-label="Select target language for translation"
        >
          <SelectTrigger id="target-language" className="w-full text-base py-5">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            {TARGET_LANGUAGES.map((lang: LanguageOption) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isLoading && <LoadingSpinner size={24} />}
      </div>
    </div>
  );
}
