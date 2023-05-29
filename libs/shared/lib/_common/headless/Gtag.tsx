"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare const window: any;

export default function Gtag({ trackingId }: { trackingId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // https://developers.google.com/analytics/devguides/collection/gtagjs/pages
  const pageview = (url) => {
    window.gtag?.("config", trackingId, { page_path: url });
  };

  // https://developers.google.com/analytics/devguides/collection/gtagjs/events
  const event = ({ action, category, label, value }) => {
    window.gtag?.("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  };
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };
    pathname && searchParams && handleRouteChange(pathname + searchParams?.toString());
    // const url = pathname + searchParams?.toString();
    // handleRouteChange(url);
  }, [pathname, searchParams]);

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${trackingId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${trackingId}', {
      page_path: window.location.pathname,
    });
  `,
        }}
      />
    </>
  );
}
