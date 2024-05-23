import { Skeleton } from "@/components/ui/skeleton"

const Loading = ({ n }: { n: number }) => {
  return (
    <div className="flex flex-col gap-4">
      {
        Array.from({ length: n }).map((_, index) => (
          <Skeleton key={index} className="w-full h-12 rounded-md" />
        ))
      }
    </div>
  )
}

export default Loading