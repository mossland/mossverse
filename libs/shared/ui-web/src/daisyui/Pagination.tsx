import { FC } from "react";
import { BiChevronLeft, BiChevronRight, BiDotsHorizontalRounded } from "react-icons/bi";

type PaginationProps = {
  currentPage: number;
  total: number;
  onPageSelect: (page: number) => void;
  itemsPerPage: number;
};

export const Pagination: FC<PaginationProps> = ({ currentPage, total, onPageSelect, itemsPerPage }) => {
  const handleLeftClick = () => {
    if (currentPage <= 1) return;
    onPageSelect(currentPage - 1);
  };

  const handleRightClick = () => {
    if (currentPage >= Math.ceil(total / itemsPerPage)) return;
    onPageSelect(currentPage + 1);
  };

  const pageNumbers = new Array(Math.ceil(total / itemsPerPage)).fill("").map((_, i) => {
    return String(i + 1);
  });

  const totalPages = Math.ceil(total / itemsPerPage);

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
            <button key={index} className="btn btn-ghost">
              <BiDotsHorizontalRounded />
            </button>
          );
        }
        if (Number(pageNum) === currentPage) {
          return (
            <button key={index} className="btn btn-ghost text-color-main">
              {pageNum}
            </button>
          );
        }
        return (
          <button key={index} className="btn btn-ghost" onClick={() => onPageSelect(Number(pageNum))}>
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
