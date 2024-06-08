import { getDate } from "@/lib/utils"
import { Email } from "@/types"

interface ItemProps {
  email: Email
  id: string
  handleItemClick: (id: string) => void
}

const Item = ({ email, id, handleItemClick }: ItemProps) => {
  const handleClick = () => {
    handleItemClick(id)
  }

  return (
    <div
      className="w-full flex bg-primary px-4 py-2 rounded cursor-pointer border border-border hover:shadow duration-100 transition"
      onClick={handleClick}
    >
      <div className="w-full grid grid-cols-3 justify-between">
        <p className="font-[525] ">{email.sender}</p>
        <p className="truncate text-muted-foreground">{email.subject}</p>
        <p className="text-right text-muted-foreground">
          {getDate(email.date)}
        </p>
      </div>
    </div>
  )
}

export default Item
