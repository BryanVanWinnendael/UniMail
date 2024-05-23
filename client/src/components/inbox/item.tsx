import { Email } from '@/types'

const Item = ({ email, id, handleItemClick } : { email: Email, id: string, handleItemClick: (id: string) => void }) => {

  const handleClick = () => {
    handleItemClick(id)
  }

  return (
  <div 
    className="w-full flex bg-neutral-50 px-4 py-2 rounded-md cursor-pointer border border-slate-200" 
    onClick={handleClick}
  >
    <div className="w-full grid grid-cols-3 justify-between">
      <p className="font-semibold ">{email.sender}</p>
      <p className="truncate">{email.subject}</p>
      <p className="text-right">{email.date}</p>
    </div>
  </div>
  )
}

export default Item