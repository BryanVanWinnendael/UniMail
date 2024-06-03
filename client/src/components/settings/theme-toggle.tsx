"use client"
import { Check, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="flex" onClick={() => setTheme("light")}>
          <Check className={`w-5 h-5 pr-2 ${theme != "light" && "opacity-0"}`}/>
          <p>Light</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex" onClick={() => setTheme("dark")}>
          <Check className={`w-5 h-5 pr-2 ${theme != "dark" && "opacity-0"}`}/>
          <p>Dark</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex" onClick={() => setTheme("system")}>
          <Check className={`w-5 h-5 pr-2 ${theme != "system" && "opacity-0"}`}/>
          <p>System</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeToggle