import { Platforms } from '@/types'
import Image from "next/image";
import { Button } from './ui/button';

type PLATFORMIMAGE = {
  [key in Platforms]: string
}

const IMAGES: PLATFORMIMAGE = {
  google: "https://www.svgrepo.com/show/475656/google-color.svg",
  outlook: "https://www.svgrepo.com/show/373951/outlook.svg",
  yahoo: "https://www.svgrepo.com/show/475657/yahoo-color.svg",
}

interface EmailButtonProps {
  platform: Platforms
  text: string
  onClick: () => void
}

const EmailButton = ({ platform, text, onClick }: EmailButtonProps) => {
  return (
    <Button onClick={onClick} className="w-full px-4 py-2 border grid grid-cols-[auto_auto] text-secondary-foreground gap-2 border-border rounded-lg hover:shadow transition duration-100 overflow-hidden">
      <Image width={24} height={24} src={IMAGES[platform]} loading="lazy" alt="button logo" />
      <p className='truncate w-auto text-left'>{text}</p>
    </Button>
  )
}

export default EmailButton