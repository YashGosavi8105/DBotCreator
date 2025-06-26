
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Settings } from "lucide-react";

interface ApiSettingsProps {
  claudeApiKey: string;
  deploymentApiKey: string;
  onClaudeApiKeyChange: (key: string) => void;
  onDeploymentApiKeyChange: (key: string) => void;
}

export const ApiSettings = ({
  claudeApiKey,
  deploymentApiKey,
  onClaudeApiKeyChange,
  onDeploymentApiKeyChange
}: ApiSettingsProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-secondary">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-discord-darker border-secondary">
        <SheetHeader>
          <SheetTitle className="text-discord-white">API Settings</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Configure your API keys for Claude AI and bot deployment.
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 py-6">
          <div className="space-y-3">
            <Label htmlFor="claude-api-key" className="text-discord-white">Claude API Key</Label>
            <Input
              id="claude-api-key"
              type="password"
              value={claudeApiKey}
              onChange={(e) => onClaudeApiKeyChange(e.target.value)}
              placeholder="sk-ant-..."
              className="bg-discord-darkest border-secondary text-discord-white"
            />
            <p className="text-xs text-muted-foreground">Used for the AI chat functionality. Get your key from the Anthropic website.</p>
          </div>
          
          <Separator className="bg-secondary" />
          
          <div className="space-y-3">
            <Label htmlFor="deployment-api-key" className="text-discord-white">Deployment API Key</Label>
            <Input
              id="deployment-api-key"
              type="password"
              value={deploymentApiKey}
              onChange={(e) => onDeploymentApiKeyChange(e.target.value)}
              placeholder="Enter deployment API key"
              className="bg-discord-darkest border-secondary text-discord-white"
            />
            <p className="text-xs text-muted-foreground">Optional for generating downloadable bot files.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
