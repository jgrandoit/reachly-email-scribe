
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

export interface FrameworkSettings {
  framework: string;
  tone: string;
  customHook: string;
}

interface FrameworkSelectorProps {
  settings: FrameworkSettings;
  onSettingsChange: (settings: FrameworkSettings) => void;
}

const frameworks = [
  { 
    value: "aida", 
    label: "AIDA",
    description: "Attention, Interest, Desire, Action - Great for building engagement"
  },
  { 
    value: "pas", 
    label: "PAS",
    description: "Problem, Agitate, Solution - Perfect for problem-focused outreach"
  },
  { 
    value: "four_sentence", 
    label: "4-Sentence",
    description: "Pro copywriters' favorite - Concise and direct"
  }
];

const tones = [
  { 
    value: "professional", 
    label: "Professional",
    description: "Formal, business-focused tone. Best for B2B and enterprise clients."
  },
  { 
    value: "friendly", 
    label: "Friendly",
    description: "Warm and approachable tone. Great for building rapport and trust."
  },
  { 
    value: "bold", 
    label: "Bold",
    description: "Direct and confident tone. Perfect for cutting through the noise."
  }
];

export const FrameworkSelector = ({ settings, onSettingsChange }: FrameworkSelectorProps) => {
  const handleChange = (field: keyof FrameworkSettings, value: string) => {
    onSettingsChange({
      ...settings,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="framework">Email Framework</Label>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Choose the structure that best fits your outreach strategy</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Select value={settings.framework} onValueChange={(value) => handleChange('framework', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choose email framework" />
          </SelectTrigger>
          <SelectContent>
            {frameworks.map((framework) => (
              <SelectItem key={framework.value} value={framework.value}>
                <Tooltip>
                  <TooltipTrigger className="w-full text-left">
                    {framework.label}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{framework.description}</p>
                  </TooltipContent>
                </Tooltip>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="tone">Email Tone</Label>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Choose the tone that best fits your audience and industry</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Select value={settings.tone} onValueChange={(value) => handleChange('tone', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Choose email tone" />
          </SelectTrigger>
          <SelectContent>
            {tones.map((tone) => (
              <SelectItem key={tone.value} value={tone.value}>
                <Tooltip>
                  <TooltipTrigger className="w-full text-left">
                    {tone.label}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tone.description}</p>
                  </TooltipContent>
                </Tooltip>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="customHook">Personal Hook (Optional)</Label>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a personal touch about your prospect or their company to make emails feel hand-written</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          id="customHook"
          placeholder="e.g., I noticed your recent LinkedIn post about scaling your team..."
          value={settings.customHook}
          onChange={(e) => handleChange('customHook', e.target.value)}
        />
      </div>
    </div>
  );
};
