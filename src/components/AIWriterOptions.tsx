
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface AIWriterOptionsProps {
  tone: string;
  setTone: (tone: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  wordCount: number;
  setWordCount: (wordCount: number) => void;
  outputFormat: string;
  setOutputFormat: (format: string) => void;
}

const AIWriterOptions: React.FC<AIWriterOptionsProps> = ({
  tone,
  setTone,
  language,
  setLanguage,
  wordCount,
  setWordCount,
  outputFormat,
  setOutputFormat,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tone">Tone</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger id="tone">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="conversational">Conversational</SelectItem>
            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
            <SelectItem value="informative">Informative</SelectItem>
            <SelectItem value="authoritative">Authoritative</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="it">Italian</SelectItem>
            <SelectItem value="pt">Portuguese</SelectItem>
            <SelectItem value="ru">Russian</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
            <SelectItem value="ar">Arabic</SelectItem>
            <SelectItem value="hi">Hindi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="word-count">Article Length: {wordCount} words</Label>
        </div>
        <Slider
          id="word-count"
          min={300}
          max={3000}
          step={100}
          value={[wordCount]}
          onValueChange={(value) => setWordCount(value[0])}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Short (300)</span>
          <span>Medium (1000)</span>
          <span>Long (3000)</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="output-format">Output Format</Label>
        <Select value={outputFormat} onValueChange={setOutputFormat}>
          <SelectTrigger id="output-format">
            <SelectValue placeholder="Select output format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="html">HTML (recommended for WordPress)</SelectItem>
            <SelectItem value="markdown">Markdown</SelectItem>
            <SelectItem value="plain">Plain Text</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AIWriterOptions;
