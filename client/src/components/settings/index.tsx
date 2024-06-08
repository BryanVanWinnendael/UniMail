import { useState } from "react"
import Nav from "./nav"
import Accounts from "./accounts"
import General from "./general"

const Index = () => {
  const [active, setActive] = useState("General")

  return (
    <div className="flex h-full w-full overflow-hidden border border-border rounded-md">
      <div className="bg-neutral-50 dark:bg-neutral-900 w-1/3 h-full rounded-tl-md rounded-bl-md">
        <Nav active={active} setActive={setActive} />
      </div>
      <div className="bg-white dark:bg-neutral-950 w-full h-full rounded-tr-md rounded-br-md">
        {
          {
            Accounts: <Accounts />,
            General: <General />,
          }[active]
        }
      </div>
    </div>
  )
}

export default Index
