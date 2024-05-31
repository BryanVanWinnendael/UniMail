"use client"
import Sidebar from "@/components/sidebar";
import { useAppSelector } from "@/redux/store";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ambientColor = useAppSelector((state) => state.ambientReducer.value.ambientColor);
  const lighterAmbientColor = ambientColor ? `rgba(${ambientColor[0]},${ambientColor[1]},${ambientColor[2]},0.1)` : null

  return (
    <div
    style={{
      background: lighterAmbientColor ? `linear-gradient(to bottom right, ${lighterAmbientColor}, white)` : ""
    }}
    className={`h-screen w-full flex md:flex-row flex-col bg-secondary`}>
      <div className="md:w-[225px] w-fit md:h-full h-fit">
        <Sidebar/>
      </div>
      <main className="flex flex-col w-full md:h-screen h-full lg:overflow-auto overflow-hidden">
        {children}
      </main>
    </div>
      
  );
}
