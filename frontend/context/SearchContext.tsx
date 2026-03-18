"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  search: (q: string) => void;
  clearSearch: () => void;
}

export interface SearchResult {
  id: string;
  type: "restaurant" | "dish";
  name: string;
  subtitle: string;
  price?: number;
  emoji: string;
  href: string;
}

const ALL_ITEMS: SearchResult[] = [
  { id: "r1", type: "restaurant", name: "McDonald's East London", subtitle: "Burgers • Fast Food • 20-25 min", emoji: "🍟", href: "/restaurants/mcdonalds" },
  { id: "r2", type: "restaurant", name: "Chef Burgers London", subtitle: "Burgers • Grill • 30-35 min", emoji: "🍔", href: "/restaurants/chef-burgers" },
  { id: "r3", type: "restaurant", name: "Grand Ai Cafe", subtitle: "Cafe • Coffee • 15-20 min", emoji: "☕", href: "/restaurants/grand-ai-cafe" },
  { id: "r4", type: "restaurant", name: "Papa Johns", subtitle: "Pizza • Italian • 25-30 min", emoji: "🍕", href: "/restaurants/papa-johns" },
  { id: "r5", type: "restaurant", name: "KFC South London", subtitle: "Chicken • Fast Food • 20-25 min", emoji: "🍗", href: "/restaurants/kfc" },

  { id: "d1", type: "dish", name: "Royal Cheese Burger", subtitle: "McDonald's East London", price: 23.10, emoji: "🍔", href: "/restaurants/mcdonalds" },
  { id: "d2", name: "Medium Fries", type: "dish", subtitle: "McDonald's East London", price: 3.50, emoji: "🍟", href: "/restaurants/mcdonalds" },
  { id: "d3", name: "Pepperoni Pizza", type: "dish", subtitle: "Papa Johns", price: 13.99, emoji: "🍕", href: "/restaurants/papa-johns" },
  { id: "d4", name: "Hot Wings Bucket", type: "dish", subtitle: "KFC South London", price: 11.99, emoji: "🍗", href: "/restaurants/kfc" },
  { id: "d5", name: "Margherita Pizza", type: "dish", subtitle: "Papa Johns", price: 11.99, emoji: "🍕", href: "/restaurants/papa-johns" },
  { id: "d6", name: "Iced Latte", type: "dish", subtitle: "Grand Ai Cafe", price: 4.50, emoji: "☕", href: "/restaurants/grand-ai-cafe" },
  { id: "d7", name: "Double Whopper", type: "dish", subtitle: "Chef Burgers London", price: 14.99, emoji: "🍔", href: "/restaurants/chef-burgers" },
];

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const lower = q.toLowerCase();
    const filtered = ALL_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.subtitle.toLowerCase().includes(lower)
    );
    setResults(filtered);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsSearching(false);
  };

  return (
    <SearchContext.Provider value={{ query, setQuery, results, isSearching, search, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be within SearchProvider");
  return ctx;
}
