import { Switch } from "@/components/ui/switch"
import { setSideView } from "@/redux/features/settings-slice"
import { useAppSelector } from "@/redux/store"
import { useDispatch } from "react-redux"

const SideViewToggle = () => {
  const sideView = useAppSelector(
    (state) => state.settingsReducer.value.sideView,
  )
  const dispatch = useDispatch()

  const handleChange = (checked: boolean) => {
    dispatch(setSideView(checked))
  }

  return (
    <Switch
      className="data-[state=checked]:bg-secondary-foreground data-[state=unchecked]:bg-muted "
      onCheckedChange={handleChange}
      checked={sideView}
    />
  )
}

export default SideViewToggle
