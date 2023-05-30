import { UrlObject } from "url";
import NextLink, { LinkProps } from "next/link";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children?: React.ReactNode;
  } & React.RefAttributes<HTMLAnchorElement>;
export default function Link({
  className,
  children,
  disabled,
  href,
  ...props
}: Omit<Props, "href"> & { disabled?: boolean; href?: string | UrlObject | null }) {
  if (disabled || !href)
    return (
      <div className={className} {...(props as any)}>
        {children}
      </div>
    );
  return (
    <NextLink className={className} href={href} passHref {...props}>
      {children}
    </NextLink>
  );
}
