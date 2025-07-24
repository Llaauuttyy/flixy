import { cn } from "lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

interface Page<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface PaginationProps<T> {
  children: React.ReactNode;
  itemsPage: Page<T>;
  onPageChange?: (page: number) => void;
}

const ArrowButton = ({
  direction,
  currentPage,
  pages,
  onClick,
}: {
  direction: "left" | "right";
  currentPage: number;
  pages: number;
  onClick: () => void;
}) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={
        direction === "left" ? currentPage === 1 : currentPage === pages
      }
      className="h-9 w-9 p-0 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={`Página ${direction === "left" ? "anterior" : "siguiente"}`}
    >
      {direction === "left" ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  );
};

const PageButton = ({
  page,
  currentPage,
  onPageChange,
}: {
  page: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) => {
  {
    /* <button
      style={{
        padding: "5px 10px",
        borderRadius: "5px",
        backgroundColor: page === currentPage ? "#007bff" : "#fff",
        color: page === currentPage ? "#fff" : "#000",
      }}
      disabled={page === currentPage}
      onClick={() => onPageChange(page)}
    >
      {page}
    </button> */
  }
  const isCurrentPage = page === currentPage;

  return (
    <Button
      key={page}
      variant={isCurrentPage ? "default" : "ghost"}
      size="sm"
      onClick={() => onPageChange(page)}
      className={cn(
        "h-9 w-9 p-0",
        isCurrentPage
          ? "ring-offset-background transition-colors hover:text-white hover:bg-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          : "text-slate-400 hover:text-white hover:bg-slate-800"
      )}
      aria-label={`Página ${page}`}
      aria-current={isCurrentPage ? "page" : undefined}
    >
      {page}
    </Button>
  );
};

export const Pagination = <T,>({
  children,
  itemsPage,
  onPageChange,
}: PaginationProps<T>) => {
  const { page, pages } = itemsPage;

  const handlePageChange = (newPage: number) => {
    if (newPage !== page && onPageChange) onPageChange(newPage);
  };

  if (pages <= 1) return <>{children}</>;

  const maxVisible = 5;
  let start = Math.max(1, page - Math.floor(maxVisible / 2));
  let end = Math.min(pages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const visiblePages = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );

  return (
    <>
      {children}
      <div
        aria-label="Pagination"
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <ArrowButton
          direction="left"
          currentPage={page}
          pages={pages}
          onClick={() => handlePageChange(page - 1)}
        />

        {start > 1 && (
          <>
            <PageButton
              page={1}
              currentPage={page}
              onPageChange={handlePageChange}
            />
            {start > 2 && <span>...</span>}
          </>
        )}

        {visiblePages.map((num) => (
          <PageButton
            key={num}
            page={num}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        ))}

        {end < pages && (
          <>
            {end < pages - 1 && <span>...</span>}
            <PageButton
              page={pages}
              currentPage={page}
              onPageChange={handlePageChange}
            />
          </>
        )}

        <ArrowButton
          direction="right"
          currentPage={page}
          pages={pages}
          onClick={() => handlePageChange(page + 1)}
        />
      </div>
    </>
  );
};
