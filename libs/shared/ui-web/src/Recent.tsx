import { useLocale } from "@shared/data-access";
import dayjs, { Dayjs } from "dayjs";

export const RecentTime = ({
  date,
  breakUnit,
  className,
  timeOption = { dateStyle: "short" },
}: {
  date: Date | Dayjs;
  breakUnit?: Intl.RelativeTimeFormatUnit;
  timeOption?: Intl.DateTimeFormatOptions;
  className?: string;
}) => {
  const { lang } = useLocale();
  const diff = dayjs().diff(dayjs(date));
  const rel = new Intl.RelativeTimeFormat();
  const dt = new Intl.DateTimeFormat(lang, timeOption);
  const diffSecs = Math.floor(diff / 1000);
  if (!date) return null;
  if (breakUnit === "second") return <span className={className}>{dt.format(dayjs(date).toDate())}</span>;
  if (Math.abs(diffSecs) < 60) return <span className={className}>{rel.format(-diffSecs, "second")}</span>;
  else if (breakUnit === "minute") return <span className={className}>{dt.format(dayjs(date).toDate())}</span>;
  const diffMins = Math.floor(diff / (1000 * 60));
  if (Math.abs(diffMins) < 60) return <span className={className}>{rel.format(-diffMins, "minute")}</span>;
  else if (breakUnit === "hour") return <span className={className}>{dt.format(dayjs(date).toDate())}</span>;
  const diffHours = Math.floor(diff / (1000 * 3600));
  if (Math.abs(diffHours) < 24) return <span className={className}>{rel.format(-diffHours, "hour")}</span>;
  else if (breakUnit === "day") return <span className={className}>{dt.format(dayjs(date).toDate())}</span>;
  const diffDays = Math.floor(diff / (1000 * 3600 * 24));
  if (Math.abs(diffDays) < 7) return <span className={className}>{rel.format(-diffDays, "day")}</span>;
  else if (breakUnit === "week") return <span className={className}>{dt.format(dayjs(date).toDate())}</span>;
  const diffWeeks = Math.floor(diff / (1000 * 3600 * 24 * 7));
  if (Math.abs(diffWeeks) < 4) return <span className={className}>{rel.format(-diffWeeks, "week")}</span>;
  else if (breakUnit === "month") return <span className={className}>{dt.format(dayjs(date).toDate())}</span>;
  const diffMonths = Math.floor(diff / (1000 * 3600 * 24 * 30));
  if (Math.abs(diffMonths) < 12) return <span className={className}>{rel.format(-diffMonths, "month")}</span>;
  else if (breakUnit === "year") return <span className={className}>{dt.format(dayjs(date).toDate())}</span>;
  const diffYears = Math.floor(diff / (1000 * 3600 * 24 * 365));
  return <span className={className}>{rel.format(-diffYears, "year")}</span>;
};
