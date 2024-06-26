import { useEffect, useRef } from "react"

interface EmailFrameProps {
  body: string
}

const EmailFrame = ({ body }: EmailFrameProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = body
    }
  }, [body])

  return (
    <iframe
      className="rounded-md !font-mono"
      ref={iframeRef}
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  )
}

export default EmailFrame
