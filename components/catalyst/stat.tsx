import { Badge } from "./badge";
import { Divider } from "./divider";

export default function Stat({ title, value, change }: { title: string; value: string; change?: string }) {
    return (
      <div>
        <Divider />
        <div className="mt-6 text-lg/6 font-medium sm:text-sm/6">{title}</div>
        <div className="mt-3 text-3xl/8 font-semibold sm:text-2xl/8">{value}</div>
        {change && (<div className="mt-3 text-sm/6 sm:text-xs/6">
          <Badge color={change.startsWith('+') ? 'lime' : 'pink'}>{change}</Badge>{' '}
          <span className="text-gray-500">from last week</span>
        </div>)}
      </div>
    )
  }