"use client";

import { RefObject } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
  tableContainerRef?: RefObject<HTMLDivElement | null>;
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onItemsPerPageChange,
  tableContainerRef,
}: PaginationProps) {
  const handlePageChange = (page: number) => {
    onPageChange(page);
    if (tableContainerRef?.current) {
      tableContainerRef.current.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 bg-white p-4 rounded-lg shadow border">
      <div className="flex items-center gap-2">
        <Select
          value={String(itemsPerPage)}
          onValueChange={(value) => {
            onItemsPerPageChange(Number(value));
          }}
        >
          <SelectTrigger className="cursor-pointer text-[14px] !h-[35px] w-[100px] px-2">
            <SelectValue placeholder="Items per page" />
          </SelectTrigger>
          <SelectContent className="text-[12px]">
            <SelectItem value="10" className="text-[12px]">10 Data</SelectItem>
            <SelectItem value="20" className="text-[12px]">20 Data</SelectItem>
            <SelectItem value="100" className="text-[12px]">100 Data</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-[14px] text-black">
          Menampilkan {totalItems === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, totalItems)} dari {totalItems} data
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="cursor-pointer text-[12px] h-[35px] px-3"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ← Sebelumnya
        </Button>
        <div className="text-[12px] text-gray-600 px-3">
          Halaman {currentPage} dari {totalPages}
        </div>
        <Button
          variant="outline"
          className="cursor-pointer text-[12px] h-[35px] px-3"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Berikutnya →
        </Button>
      </div>
    </div>
  );
}
