import GoogleLoginButton from "@/components/google/google-login-button";
import OutlookLoginButton from "@/components/outlook/outlook-login-button";
import YahooLoginButton from "@/components/yahoo/yahoo-login";

const Page = () => {
  return (
    <div className="w-screen h-screen p-8 flex justify-center bg-secondary">
      <div className="w-full p-4 rounded-lg flex flex-col items-center justify-center bg-primary gap-4">
        <div className="text-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">UniMail</h1>
          <p className="text-xl text-muted-foreground">Keep all your emails at one place</p>
        </div>
        <div className="flex flex-col gap-2">
          <GoogleLoginButton />
          <OutlookLoginButton />
          <YahooLoginButton />
        </div>
      </div>
    </div>
  )
}

export default Page