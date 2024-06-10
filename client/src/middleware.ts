import { NextRequest, NextResponse } from "next/server"

export const middleware = async (req: NextRequest, res: NextResponse) => {
  const accountsCookie = req.cookies.get("accounts")
  if (!accountsCookie) {
    return NextResponse.redirect(new URL("login", req.nextUrl))
  }
  const tokensEncrypted = accountsCookie.value
  const token: string[] = JSON.parse(atob(tokensEncrypted))
  if (token.length === 0) {
    return NextResponse.redirect(new URL("login", req.nextUrl))
  }
}

export const config = {
  matcher: "/",
}
