import Sidebar from "@/components/sidebar"

export const metadata = {
  title: "UniBox | UniMail",
  description: "UniBox page of UniMail",
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-screen w-full flex md:flex-row flex-col bg-secondary">
      <div className="md:w-[225px] w-fit md:h-full h-fit">
        <Sidebar />
      </div>
      <main className="flex flex-col w-full md:h-screen h-full lg:overflow-auto overflow-hidden">
        {children}
      </main>
    </div>
  )
}
