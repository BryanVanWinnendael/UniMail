"use client"
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog"
import { toggleDialog } from "@/redux/features/settings-slice";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";
import Settings from "./settings";

const SettingsDialog = () => {
  const isOpen = useAppSelector((state) => state.settingsReducer.value.isOpen);
  const dispatch = useDispatch();

  const handleToggleDialog = () => {
    dispatch(toggleDialog());
  }

  return (
    <Dialog onOpenChange={handleToggleDialog} open={isOpen}>
      <DialogOverlay className="bg-transparent" />
      <DialogContent className="w-full h-2/3 max-w-4xl p-0 m-0 border-0 bg-transparent">
        <Settings />
      </DialogContent>
    </Dialog>
  )
}

export default SettingsDialog