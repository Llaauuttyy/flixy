import { Filter, ListFilter, SortAsc, SortDesc } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Separator } from "components/ui/separator";
import { cn } from "lib/utils";
import { useTranslation } from "react-i18next";

export type OrderColumn = "title" | "year" | "duration" | "imdb_rating";
export type OrderWay = "asc" | "desc";

const AVAILABLE_COLUMNS: OrderColumn[] = [
  "title",
  "year",
  "duration",
  "imdb_rating",
];

type Props = {
  className?: string;
  genres?: string[];
  selectedGenres?: string[];
  onGenresChange?: (next: string[]) => void;
  orderColumn?: OrderColumn;
  onOrderColumnChange: (column: OrderColumn) => void;
  orderWay?: OrderWay;
  onOrderWayChange: (way: OrderWay) => void;
};

export default function MovieFilters({
  className,
  genres = [],
  selectedGenres = [],
  onGenresChange = () => {},
  orderColumn = "title",
  onOrderColumnChange,
  orderWay,
  onOrderWayChange,
}: Props) {
  const { t } = useTranslation();
  const selectedCount = selectedGenres.length;
  const hasFilters = selectedCount > 0;

  const chips = useMemo(() => selectedGenres.slice(0, 4), [selectedGenres]);

  const toggleGenre = (g: string) => {
    const exists = selectedGenres.includes(g);
    const next = exists
      ? selectedGenres.filter((x) => x !== g)
      : [...selectedGenres, g];
    onGenresChange(next);
  };

  const clearAll = () => {
    onGenresChange([]);
  };

  return (
    <div className={cn("w-full p-3 sm:p-4 rounded-md", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-700 text-neutral-200 bg-transparent"
              >
                <Filter className="mr-2 h-4 w-4" />
                {t("movie_filters.filter.button_text")}
                {hasFilters ? (
                  <span className="ml-2 rounded bg-neutral-800 px-1.5 py-0.5 text-xs text-neutral-300">
                    {selectedCount}
                  </span>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-60 p-3 bg-neutral-900 border-neutral-800"
              side="bottom"
              align="start"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t("movie_filters.filter.dropdown_title")}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={clearAll}
                  disabled={!hasFilters}
                >
                  {t("movie_filters.filter.clear")}
                </Button>
              </div>
              <Separator className="my-2 bg-neutral-800" />
              <div className="max-h-64 overflow-auto pr-1">
                <ul className="grid gap-2">
                  {genres.map((g) => {
                    const checked = selectedGenres.includes(g);
                    return (
                      <li key={g} className="flex items-center gap-2">
                        <Checkbox
                          id={`genre-${g}`}
                          checked={checked}
                          onCheckedChange={() => toggleGenre(g)}
                        />
                        <label
                          htmlFor={`genre-${g}`}
                          className="text-sm leading-none select-none cursor-pointer"
                        >
                          {g}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </PopoverContent>
          </Popover>

          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              {chips.map((g) => (
                <Badge
                  key={g}
                  variant="secondary"
                  className="bg-neutral-800 text-neutral-300 hover:bg-neutral-800"
                >
                  {g}
                </Badge>
              ))}
              {selectedGenres.length > chips.length ? (
                <Badge
                  variant="secondary"
                  className="bg-neutral-800 text-neutral-300"
                >{`+${selectedGenres.length - chips.length}`}</Badge>
              ) : null}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-700 text-neutral-200 bg-transparent"
              >
                <ListFilter className="mr-2 h-4 w-4" />
                {t("movie_filters.order.button_text")}:{" "}
                {t(`movie_filters.order.column.${orderColumn}`)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-neutral-900 border-neutral-800 text-neutral-200">
              <DropdownMenuLabel>
                {t("movie_filters.order.dropdown_column_title")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neutral-800" />
              <DropdownMenuRadioGroup
                value={orderColumn}
                onValueChange={(v) => onOrderColumnChange(v as OrderColumn)}
              >
                {AVAILABLE_COLUMNS.map((value: OrderColumn) => (
                  <DropdownMenuRadioItem value={value}>
                    {t(`movie_filters.order.column.${value}`)}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-700 text-neutral-200 bg-transparent"
              >
                {orderWay === "asc" ? (
                  <>
                    <SortAsc className="mr-2 h-4 w-4" />
                    {t(`movie_filters.order.way.asc`)}
                  </>
                ) : (
                  <>
                    <SortDesc className="mr-2 h-4 w-4" />
                    {t(`movie_filters.order.way.desc`)}
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 bg-neutral-900 border-neutral-800 text-neutral-200">
              <DropdownMenuLabel>
                {t(`movie_filters.order.dropdown_way_title`)}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-neutral-800" />
              <DropdownMenuRadioGroup
                value={orderWay}
                onValueChange={(v) => onOrderWayChange(v as OrderWay)}
              >
                <DropdownMenuRadioItem value="asc">
                  <SortAsc className="mr-2 h-4 w-4" />
                  {t(`movie_filters.order.way.asc`)}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="desc">
                  <SortDesc className="mr-2 h-4 w-4" />
                  {t(`movie_filters.order.way.desc`)}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
