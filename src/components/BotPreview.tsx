
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BotFeature {
  name: string;
  description: string;
}

interface BotPreviewProps {
  name: string;
  description: string;
  features: BotFeature[];
  onConfirm: () => void;
  onEdit: () => void;
}

export const BotPreview = ({
  name,
  description,
  features,
  onConfirm,
  onEdit
}: BotPreviewProps) => {
  return (
    <Card className="w-full border-secondary bg-card">
      <CardHeader>
        <CardTitle className="text-discord-blurple">{name || "Your Discord Bot"}</CardTitle>
        <CardDescription className="text-gray-400">{description || "A custom Discord bot"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-semibold text-sm text-gray-400">FEATURES</h3>
          <div className="space-y-2">
            {features.length > 0 ? (
              features.map((feature, index) => (
                <div key={index} className="space-y-1">
                  <h4 className="font-medium text-discord-white">{feature.name}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                  {index < features.length - 1 && (
                    <Separator className="my-2 bg-secondary" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No features specified yet.</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onEdit} className="border-secondary hover:bg-secondary">
          Edit Bot
        </Button>
        <Button onClick={onConfirm} className="bg-discord-blurple hover:bg-discord-blurple/80">
          Generate Bot
        </Button>
      </CardFooter>
    </Card>
  );
};
