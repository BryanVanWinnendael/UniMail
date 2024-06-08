import { useEffect, useState } from "react"

type StreamTextProps = {
  text: string
  speed?: number
}

const StreamText = ({ text, speed = 100 }: StreamTextProps) => {
  const [displayedText, setDisplayedText] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index])
        setIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timeoutId)
    }
  }, [index, text, speed])

  return <p>{displayedText}</p>
}

export default StreamText
