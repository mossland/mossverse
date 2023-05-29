import { Card } from "@shared/client";
import { fetch, usePage } from "@decentverse/client";
import { twMerge } from "tailwind-merge";

interface GeneralProps {
  className?: string;
  map: fetch.Map;
}
export const General = ({ className, map }: GeneralProps) => {
  const { l } = usePage();
  return (
    <div className={twMerge(className, ``)}>
      <Card title={`Map: ${map?.name}`} className="mb-[20px]">
        <div>
          <div className="border border-gray-100 rounded-lg sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="p-2 text-sm text-gray-500 bg-gray-50">tiles</dt>
            <dd className="p-2 text-sm text-gray-900 sm:col-span-2">
              {map.wh[0]} X {map.wh[1]}
            </dd>
          </div>
        </div>
      </Card>
    </div>
  );
};
