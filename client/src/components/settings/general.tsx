import ThemeToggle from "./theme-toggle"

const General = () => {
  return (
    <div className="p-5 flex flex-col h-full">
      <div className="w-full flex justify-between mt-6">
        <div>
          <p className="text-lg font-semibold">Theme</p>
          <p className="text-muted-foreground">Change your theme</p>
        </div>
        <ThemeToggle />
      </div>
      
    </div>
  )
}

export default General