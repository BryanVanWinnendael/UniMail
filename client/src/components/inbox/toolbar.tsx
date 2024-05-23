import { Input } from "@/components/ui/input"
import RefreshButton from "./refresh-button";
import Spinner from "../spinner";

type ToolbarProps = {
  loading: boolean
  refresh: (type: "hard" | "soft") => void;
  emailsCount: number;
  setSearchQuery: (query: string) => void;
}
const Toolbar = ({ loading, refresh, emailsCount, setSearchQuery } : ToolbarProps) => {
  return (
    <div className="w-full grid grid-cols-[0.8fr_0.2fr] gap-2 bg-neutral-50 h-12 items-center pb-12">
      <div className="flex gap-2">
        <RefreshButton refresh={refresh} loading={loading}/>
        <Input onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search"/>
      </div>
      <div className="flex justify-end">
        <p className="bg-primary text-secondary p-2 rounded-lg border border-slate-200 truncate w-fit flex items-center gap-1"><b>Mails: </b> {loading ? <Spinner size={4}/> :emailsCount}</p>
      </div>
    </div>
  )
}

export default Toolbar