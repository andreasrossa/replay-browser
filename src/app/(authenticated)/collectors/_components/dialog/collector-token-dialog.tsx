"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type CollectorDTO } from "@/server/db/schema";
import { type DialogProps } from "@radix-ui/react-dialog";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CollectorTokenDialog({
  collector,
  token,
  tokenExpiresAt,
  dialogProps,
}: {
  collector: CollectorDTO;
  token: string;
  tokenExpiresAt: Date;
  dialogProps: DialogProps;
}) {
  const [, copy] = useCopyToClipboard();
  const [showToken, setShowToken] = useState(false);

  const handleCopy = async () => {
    await copy(token);
    toast.success("Token copied to clipboard");
  };

  return (
    <Dialog {...dialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Token for {collector.displayName}</DialogTitle>
          <DialogDescription>
            You will not be able to see this token again. Please save it in a
            secure location.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            value={token}
            type={showToken ? "text" : "password"}
            readOnly
            className={cn(
              "h-9 text-muted-foreground",
              !showToken && "tracking-widest",
            )}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowToken(!showToken)}
          >
            {showToken ? <EyeIcon /> : <EyeOffIcon />}
          </Button>
        </div>
        <p className="text-sm italic text-muted-foreground">
          This token will expire on {tokenExpiresAt.toLocaleString("de-DE")}.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button onClick={handleCopy}>Copy</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
