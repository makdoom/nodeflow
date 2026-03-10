"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { generateGoogleFormScript } from "./utils";

type PropsType = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: PropsType) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  // Create webhook URL
  const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookURL = `${baseURL}/api/webhook/google-form?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookURL);
      toast.success("Webhook URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy webhook URL");
    }
  };

  const handleGoogleAppScript = async () => {
    try {
      const script = await generateGoogleFormScript(webhookURL);
      await navigator.clipboard.writeText(script);
      toast.success("Script copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy script");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Google Form Trigger Configuration</DialogTitle>
          <DialogDescription>
            Use this webhook URL in your Google Form's App Script to trigger
            this workflow when the form is submitted
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhok-url"
                readOnly
                className="font-mono text-sm"
                value={webhookURL}
              />
              <Button
                size="icon"
                type="button"
                variant="outline"
                onClick={copyToClipboard}
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Setup Instructions:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Google Form</li>
              <li>Click the three dots menu → Script Editor </li>
              <li>Copy and paste the script below</li>
              <li>Replace the WEBHOOK URL with your webhook URL above</li>
              <li>Save and click "Trigger" → Add Trigger </li>
              <li>Choose: From form → on form submit → Save</li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-3">
            <h4 className="font-medium text-sm">Google App Script:</h4>
            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleAppScript}
            >
              <CopyIcon className="size-4 mr-2" />
              <span>Copy Google App Script</span>
            </Button>
            <p className="text-sm text-muted-foreground">
              This script includes your webhook URL and handles form submission
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
