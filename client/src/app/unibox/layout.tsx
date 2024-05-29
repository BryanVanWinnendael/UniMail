import Sidebar from "@/components/sidebar";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen w-full flex md:flex-row flex-col">
      <div className="md:w-[225px] w-fit md:h-full h-fit">
        <Sidebar/>
      </div>
      <main className="flex flex-col w-full md:h-screen h-full lg:overflow-auto overflow-hidden">
        {children}
      </main>
    </div>
      
  );
}
