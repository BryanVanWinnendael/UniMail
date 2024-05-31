const NAVS = [
  "General",
  "Accounts",
]

interface NavProps {
  active: string
  setActive: (nav: string) => void
}

const Nav = ({ active, setActive } : NavProps) => {
  return (
    <div className="w-full h-full flex flex-col gap-2 p-5">
      {
        NAVS.map((nav) => {
          return (
            <div onClick={() => setActive(nav)} key={nav} 
              className={`w-full ${active === nav && "bg-muted dark:text-zinc-100 text-zinc-900"} text-[#71717a] rounded-md py-1 px-2 cursor-pointer hover:bg-muted hover:text-zinc-900 dark:hover:text-zinc-100 duration-100 transition`}>
              {nav}
            </div>
          )
        })
      }
    </div>
  )
}

export default Nav