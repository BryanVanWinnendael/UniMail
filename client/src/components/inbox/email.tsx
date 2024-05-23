import { Buffer } from "buffer";
import { ChevronLeft, Maximize2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import EmailFrame from "./email-frame";

const Email = ({ encoded_body, handleBackToInbox, sender_email }: { encoded_body: string, handleBackToInbox: () => void, sender_email: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const decode = (str: string): string => Buffer.from(str, 'base64').toString('utf-8');
  const decoded_body = decode(encoded_body);

  const toggleFullScreen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col h-full gap-2 w-full">
      <div className="w-full grid grid-cols-[0.8fr_0.2fr] gap-2 border border-slate-00 bg-neutral-50 rounded-md p-2">
        <div className="flex gap-2 w-full truncate">
          <Button variant="default" className="cursor-pointer rounded-md h-10 w-10 p-2 flex items-center justify-center" onClick={handleBackToInbox}>
            <ChevronLeft className="w-4 h-4 text-white duration-200" />
          </Button>
          <p className="bg-white p-2 rounded-lg border border-slate-200 truncate w-fit">
            <b>From:</b> {sender_email}
          </p>
        </div>
        <div className="flex justify-end">
          <Button variant="default" onClick={toggleFullScreen}>
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <EmailFrame body={decoded_body} />

      <Dialog open={isOpen} onOpenChange={toggleFullScreen}>
        <DialogContent className="w-screen h-screen max-w-screen">
          <EmailFrame body={decoded_body} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Email;
