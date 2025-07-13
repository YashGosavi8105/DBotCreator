
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';

type Status = 'idle' | 'preparing' | 'generating' | 'complete' | 'error';

interface DeploymentStatusProps {
  status: Status;
  botName: string;
  onDone?: () => void;
  errorMessage?: string;
  downloadUrl?: string | null;
  setupInstructions?: string | null;
}

export const DeploymentStatus = ({ 
  status, 
  botName,
  onDone,
  errorMessage = "An error occurred during generation.",
  downloadUrl,
  setupInstructions
}: DeploymentStatusProps) => {
  const getStatusContent = () => {
    switch (status) {
      case 'idle':
        return {
          title: "Ready to Generate",
          badge: <Badge className="bg-discord-blurple">Ready</Badge>,
          message: `${botName} is ready to be generated.`,
          showLoader: false
        };
      case 'preparing':
        return {
          title: "Preparing Bot Files",
          badge: <Badge className="bg-discord-yellow text-black">Preparing</Badge>,
          message: `Setting up ${botName} for generation...`,
          showLoader: true
        };
      case 'generating':
        return {
          title: "Generating Bot",
          badge: <Badge className="bg-discord-blurple">Generating</Badge>,
          message: `Generating code for ${botName}...`,
          showLoader: true
        };
      case 'complete':
        return {
          title: "Bot Generated",
          badge: <Badge className="bg-discord-green">Complete</Badge>,
          message: `${botName} has been successfully generated!`,
          showLoader: false,
          showDownload: true,
          showInstructions: true
        };
      case 'error':
        return {
          title: "Generation Failed",
          badge: <Badge className="bg-discord-red">Error</Badge>,
          message: errorMessage,
          showLoader: false,
          showButton: true
        };
      default:
        return {
          title: "Unknown Status",
          badge: <Badge>Unknown</Badge>,
          message: "Unknown generation status",
          showLoader: false
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <Card className="w-full border-secondary bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-discord-white">{statusContent.title}</CardTitle>
        {statusContent.badge}
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-400">{statusContent.message}</p>
        
        {statusContent.showLoader && (
          <div className="flex justify-center my-8">
            <div className="w-12 h-12 border-4 border-discord-blurple border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {statusContent.showDownload && downloadUrl && (
          <Button 
            className="w-full bg-discord-green hover:bg-discord-green/80 mb-4"
            onClick={() => {
              // Create a temporary anchor element to trigger download
              const a = document.createElement('a');
              a.href = downloadUrl;
              a.download = `${botName.toLowerCase()}-bot.js`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              // Clean up the URL object to avoid memory leaks
              setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
            }}
          >
            Download Bot Files
          </Button>
        )}
        
        {statusContent.showInstructions && setupInstructions && (
          <div className="mt-6 p-4 bg-discord-darkest rounded-md overflow-auto max-h-80 text-sm prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>
              {setupInstructions}
            </ReactMarkdown>
          </div>
        )}
        
        {(statusContent.showButton || status === 'complete') && onDone && (
          <Button 
            onClick={onDone} 
            className="w-full bg-discord-blurple hover:bg-discord-blurple/80 mt-4"
          >
            {status === 'complete' ? 'Create Another Bot' : 'Try Again'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
