import { Platforms } from '@/types'
import Image from "next/image";

type PLATFORMIMAGE = {
  [key in Platforms]: string
}

const IMAGES: PLATFORMIMAGE = {
  google: "https://www.svgrepo.com/show/475656/google-color.svg",
  outlook: "https://www.svgrepo.com/show/373951/outlook.svg"
}

interface EmailButtonProps {
  platform: Platforms
  text: string
  onClick: () => void
}

const EmailButton = ({ platform, text, onClick }: EmailButtonProps) => {
  return (
    <button onClick={onClick} className="w-fit px-4 py-2 border flex gap-2 bg-white border-slate-200 rounded-lg text-slate-700 hover:border-slate-300 hover:text-slate-900 transition duration-150">
      <Image width={24} height={24} src={IMAGES[platform]} loading="lazy" alt="google logo" />
      <span>{text}</span>
  </button>
  )
}

export default EmailButton