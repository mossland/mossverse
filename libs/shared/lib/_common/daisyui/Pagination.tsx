"use client";
import { BiChevronLeft, BiChevronRight, BiDotsHorizontalRounded } from "react-icons/bi";
import { FC } from "react";

export type PaginationProps = {
  currentPage: number;
  total: number;
  onPageSelect: (page: number) => void;
  itemsPerPage: number;
};

export const Pagination: FC<PaginationProps> = ({ currentPage, total, onPageSelect, itemsPerPage }) => {
  const totalPages = Math.ceil(total / (itemsPerPage || 1));
  const handleLeftClick = () => {
    if (currentPage <= 1) return;
    onPageSelect(currentPage - 1);
  };
  const handleRightClick = () => {
    if (currentPage >= totalPages) return;
    onPageSelect(currentPage + 1);
  };
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
      <button className="btn btn-ghost" onClick={handleLeftClick}>
        <BiChevronLeft />
      </button>
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
          <button key={index} className="btn btn-ghost text-primary/40" onClick={() => onPageSelect(Number(pageNum))}>
            {pageNum}
          </button>
        );
      })}
      <button className="btn btn-ghost" onClick={handleRightClick}>
        <BiChevronRight />
      </button>
    </div>
  );
};
