import { useEffect, useRef } from "react";

const EmailFrame = ({ body }: { body: string }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = body;
    }
  }, [body]);

  return (
    <iframe className="rounded-md" ref={iframeRef} style={{ width: '100%', height: '100%', border: 'none' }} />
  )
}

export default EmailFrame