import { BiChevronLeft, BiChevronRight, BiDotsHorizontalRounded } from "react-icons/bi";
import { FC } from "react";
import { Link } from "../headless";
import { UrlObject } from "url";

export type ServerPaginationProps = {
  currentPage: number;
  total: number;
  href: (page: number) => string | UrlObject;
  itemsPerPage: number;
};
export const ServerPagination: FC<ServerPaginationProps> = ({ currentPage, total, href, itemsPerPage }) => {
  const totalPages = Math.ceil(total / (itemsPerPage || 1));
  const pageNumbers = new Array(totalPages).fill("").map((_, i) => {
    return String(i + 1);
  });
  let displayNumbers = pageNumbers;
  if (totalPages > 10) {
    if (currentPage < 5) {
      displayNumbers = pageNumbers.slice(0, 5).concat(["...", String(totalPages)]);
    } else if (currentPage >= 5 && currentPage <= totalPages - 4) {
      displayNumbers = [
        "1",
        "...",
        ...pageNumbers.slice(Number(currentPage) - 3, Number(currentPage) + 2),
        "...",
        String(totalPages),
      ];
    } else {
      displayNumbers = ["1", "...", ...pageNumbers.slice(-5)];
    }
  }

  return (
    <div className="flex items-center">
      <Link replace href={href(Number(currentPage) - 1)} disabled={currentPage <= 1}>
        <button className="btn btn-ghost">
          <BiChevronLeft />
        </button>
      </Link>
      {displayNumbers.map((pageNum, index) => {
        if (pageNum === "...") {
          return (
            <button key={index} className="btn btn-ghost text-primary/40">
              <BiDotsHorizontalRounded />
            </button>
          );
        }
        if (Number(pageNum) === currentPage) {
          return (
            <button key={index} className="btn btn-ghost text-primary">
              {pageNum}
            </button>
          );
        }
        return (
          <Link key={index} href={href(Number(pageNum))}>
            <button className="btn btn-ghost text-primary/40">{pageNum}</button>
          </Link>
        );
      })}
      <Link href={href(Number(currentPage) + 1)} disabled={currentPage >= totalPages}>
        <button className="btn btn-ghost">
          <BiChevronRight />
        </button>
      </Link>
    </div>
  );
};
