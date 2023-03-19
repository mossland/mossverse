import { Skeleton } from "antd";
import { useLocale } from "@decentverse/data-access";

interface TeleportLoadingProps {
  className?: string;
}
export const TeleportLoading = ({ className }: TeleportLoadingProps) => {
  const { l } = useLocale();
  return (
    <div className={className}>
      <Skeleton active />
    </div>
  );
};
