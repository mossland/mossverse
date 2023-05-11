import { Skeleton } from "antd";
import { useLocale } from "@platform/data-access";

interface TradeLoadingProps {
  className?: string;
}
export const TradeLoading = ({ className }: TradeLoadingProps) => {
  const { l } = useLocale();
  return (
    <div className={className}>
      <Skeleton active />
    </div>
  );
};
