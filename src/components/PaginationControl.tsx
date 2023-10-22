"use client";

import React from "react";
import { Button } from "./ui/button";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import Link from "next/link";
import clsx from "clsx";

interface PaginationControlProps {
  currentPage: number;
  pageCount: number;
  previousPage: string;
  nextPage: string;
}

const PaginationControl = ({
  currentPage,
  pageCount,
  previousPage,
  nextPage,
}: PaginationControlProps) => {
  return (
    <div className="flex items-center space-x-2 mx-auto mb-6">
      <Link
        href={previousPage}
        className={clsx(currentPage <= 1 && "pointer-events-none opacity-50")}
      >
        <span className="sr-only">Go to previous page</span>
        <Button variant="outline-dark" size="icon">
          <IoChevronBackOutline />
        </Button>
      </Link>

      <div className="flex w-[100px] items-center justify-center text-sm font-medium">
        Page {currentPage} of {pageCount}
      </div>

      <Link
        href={nextPage}
        className={clsx(
          currentPage >= pageCount && "pointer-events-none opacity-50"
        )}
      >
        <span className="sr-only">Go to next page</span>
        <Button variant="outline-dark" size="icon">
          <IoChevronForwardOutline />
        </Button>
      </Link>
    </div>
  );
};

export default PaginationControl;
