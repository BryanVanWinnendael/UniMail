const NAVS = [
  "Accounts",
  "General"
]

const Nav = ({ active, setActive } : { active: string, setActive: (nav: string) => void }) => {
  return (
    <div className="w-full h-full flex flex-col gap-2 p-5">
      {
        NAVS.map((nav) => {
          return (
            <div onClick={() => setActive(nav)} key={nav} 
            className={`w-full ${active === nav && "bg-primary text-secondary border border-gray border-opacity-10"} rounded-md py-1 px-2 cursor-pointer hover:text-secondary hover:bg-primary duration-150`}>
              {nav}
            </div>
          )
        })
      }
    </div>
  )
}

export default Nav