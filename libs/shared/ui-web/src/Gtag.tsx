import Router from "next/router";
import { useEffect } from "react";

declare const window: any;

export const Gtag = ({ trackingId }: { trackingId: string }) => {
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
    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [Router.events]);

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
};
