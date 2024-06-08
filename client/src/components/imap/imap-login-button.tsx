"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "../ui/label"
import { useState } from "react"
import useAuth from "@/hooks/useAuth"
import { TokenObject } from "@/types"
import { useRouter } from "next/navigation"
import EmailButton from "../email-button"
import { tryConnection } from "@/services/imap"
import { toast } from "sonner"

const IMAPLoginButton = () => {
  const { login } = useAuth()
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const [imappInfo, setImapInfo] = useState({
    server: "",
    port: "993",
    email: "",
    password: "",
  })

  const handleLogin = async () => {
    const password = btoa(imappInfo.password)

    const tokenObject: TokenObject = {
      access_token: password,
      refresh_token: password,
      imap_server: imappInfo.server,
      imap_port: imappInfo.port,
    }

    const hasConnected = await tryConnection(tokenObject, imappInfo.email)
    if (hasConnected.success) {
      login(tokenObject, "imap", imappInfo.email)
      setOpen(false)
      router.push("/")
    } else {
      toast("Error, imap configuration is wrong", {
        id: "error-toast",
        action: {
          label: "Close",
          onClick: () => console.log("Close"),
        },
        classNames: {
          toast: "!bg-red-600",
          title: "!text-white",
        },
      })
    }
  }

  const handleToggleDialog = () => {
    setOpen(!open)
  }

  return (
    <Dialog open={open} onOpenChange={handleToggleDialog}>
      <DialogTrigger asChild>
        <EmailButton
          onClick={() => setOpen(true)}
          platform="imap"
          text="IMAP"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect to IMAP server</DialogTitle>
          <DialogDescription>
            Enter your IMAP server details to connect.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="server">Server</Label>
            <Input
              onChange={(e) =>
                setImapInfo({ ...imappInfo, server: e.target.value })
              }
              value={imappInfo.server}
              type="text"
              id="server"
              placeholder="smtp.test.com"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="port">Port</Label>
            <Input
              onChange={(e) =>
                setImapInfo({ ...imappInfo, port: e.target.value })
              }
              value={imappInfo.port}
              type="text"
              id="port"
              placeholder="993"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              onChange={(e) =>
                setImapInfo({ ...imappInfo, email: e.target.value })
              }
              value={imappInfo.email}
              type="email"
              id="email"
              placeholder="Email"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              onChange={(e) =>
                setImapInfo({ ...imappInfo, password: e.target.value })
              }
              value={imappInfo.password}
              type="password"
              id="password"
              placeholder="***"
            />
          </div>
        </div>
        <Button onClick={handleLogin} variant="secondary">
          Connect
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default IMAPLoginButton
