import { Buffer } from "buffer";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import EmailFrame from "./email-frame";

interface EmailProps {
  encoded_body: string
  fullScreenEmail: boolean
  setFullScreenEmail: (full: boolean) => void
}

const Email = ({ encoded_body, fullScreenEmail, setFullScreenEmail }: EmailProps) => {
  const decode = (str: string): string => Buffer.from(str, 'base64').toString('utf-8');
  const decoded_body = decode(encoded_body);

  const toggleFullScreen = () => {
    setFullScreenEmail(!fullScreenEmail);
  }

  return (
    <div className="flex flex-col h-full gap-2 w-full">
      <EmailFrame body={decoded_body} />

      <Dialog open={fullScreenEmail} onOpenChange={toggleFullScreen}>
        <DialogContent className="w-screen h-screen max-w-screen">
          <EmailFrame body={decoded_body} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Email;
