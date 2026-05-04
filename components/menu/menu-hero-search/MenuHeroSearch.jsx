"use client";

import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button/Button";
import styles from "./menu-hero-search.module.css";

const FILTER_CATEGORIES = ["All", "Desserts", "Drinks", "Meals", "Salads"];

export default function MenuHeroSearch({
  searchQuery,
  selectedCategory,
  newOnly,
  resultCount,
  onSearchChange,
  onCategoryChange,
  onNewOnlyChange,
  onReset,
}) {
  return (
    <div className={styles.heroSearchOverlay}>
      <div className={styles.searchShell}>
        <div className={styles.searchInputWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search menu"
            className={styles.searchInput}
            aria-label="Search menu"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="plain"
              className={styles.clearSearchButton}
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </Button>
          )}
        </div>

        <div className={styles.filterGroup}>
          <div className={styles.filterSelectWrapper}>
            <SlidersHorizontal size={16} />
            <select
              value={selectedCategory}
              onChange={(event) => onCategoryChange(event.target.value)}
              className={styles.categorySelect}
              aria-label="Filter by category"
            >
              {FILTER_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <label className={styles.newOnlyToggle}>
            <input
              type="checkbox"
              checked={newOnly}
              onChange={(event) => onNewOnlyChange(event.target.checked)}
            />
            <Sparkles size={15} />
            <span>New</span>
          </label>
        </div>

        <div className={styles.searchMeta}>
          <span>{resultCount} matches</span>
          <Button
            type="button"
            variant="plain"
            className={styles.resetFiltersButton}
            onClick={onReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
