import { Skeleton } from "antd";
import { useLocale } from "@shared/data-access";

interface AdminLoadingProps {
  className?: string;
}
export const AdminLoading = ({ className }: AdminLoadingProps) => {
  const { l } = useLocale();
  return (
    <div className={className}>
      <Skeleton active />
    </div>
  );
};
