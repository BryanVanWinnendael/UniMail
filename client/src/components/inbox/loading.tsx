import { Skeleton } from "@/components/ui/skeleton"

interface LoadingProps {
  n: number
  h?: string
  w?: string
}

const Loading = ({ n, h = "3rem", w }: LoadingProps) => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: n }).map((_, index) => (
        <Skeleton
          style={{
            height: h,
            width: w,
          }}
          key={index}
          className="w-full rounded-md"
        />
      ))}
    </div>
  )
}

export default Loading
