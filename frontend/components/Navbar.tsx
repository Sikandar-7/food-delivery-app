"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBasket, MapPin, User, Menu, X, Search, LogOut, ChevronDown, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";
import { useModal } from "@/context/ModalContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  const { query, results, search, clearSearch } = useSearch();
  const { openModal } = useModal();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Browse Menu", path: "/menu" },
    { name: "Restaurants", path: "/restaurants" },
    { name: "Track Order", path: "/track" },
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchSelect = (href: string) => {
    clearSearch();
    setShowSearch(false);
    router.push(href);
  };

  return (
    <header className="w-full bg-white relative z-50 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="w-full bg-background hidden md:border-b md:border-gray-200 md:block">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2 flex justify-between items-center text-sm">
          <div className="font-medium">
            🌟 Get 5% Off your first order, <span className="text-primary font-bold">Promo: ORDER5</span>
          </div>
          <div className="flex items-center gap-2 text-foreground">
            <MapPin size={16} />
            <span>MM Alam Road, Gulberg, Lahore</span>
            <button
              onClick={() => openModal("POSTCODE")}
              className="text-primary font-medium hover:underline ml-2"
            >
              Change Location
            </button>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => openModal("CART_DRAWER")}
              className="bg-success text-white rounded-pill px-4 py-2 flex items-center gap-3 hover:bg-success/90 transition"
            >
              <ShoppingBasket size={18} />
              <span className="font-medium text-sm">{state.items.length} Items</span>
              <span className="font-bold text-sm">· GBP {state.total.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo + Hamburger */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-navy"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <Link href="/" className="flex items-center">
            <span className="font-heading font-bold text-3xl tracking-tight text-navy">
              Order<span className="text-primary">🔥</span>
            </span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`font-medium transition-colors ${
                pathname === link.path ? "text-primary" : "text-foreground hover:text-primary"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Controls: Search + Auth + Mobile cart */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative" ref={searchRef}>
            <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-pill px-4 py-2 focus-within:border-primary focus-within:bg-white transition-all w-48 md:w-64">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search restaurants or food..."
                value={query}
                onChange={(e) => { search(e.target.value); setShowSearch(true); }}
                onFocus={() => setShowSearch(true)}
                className="bg-transparent outline-none text-sm w-full text-foreground placeholder:text-gray-400"
              />
              {query && (
                <button onClick={clearSearch} className="text-gray-400 hover:text-navy transition">
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showSearch && query && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 left-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[200]"
                >
                  {results.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-sm">No results for &quot;{query}&quot;</div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {/* Restaurants group */}
                      {results.filter(r => r.type === "restaurant").length > 0 && (
                        <div>
                          <p className="px-4 pt-3 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Restaurants</p>
                          {results.filter(r => r.type === "restaurant").map(result => (
                            <button
                              key={result.id}
                              onClick={() => handleSearchSelect(result.href)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                            >
                              <span className="text-2xl">{result.emoji}</span>
                              <div>
                                <p className="font-bold text-navy text-sm">{result.name}</p>
                                <p className="text-xs text-gray-500">{result.subtitle}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                      {/* Dishes group */}
                      {results.filter(r => r.type === "dish").length > 0 && (
                        <div className="border-t border-gray-100">
                          <p className="px-4 pt-3 pb-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Menu Items</p>
                          {results.filter(r => r.type === "dish").map(result => (
                            <button
                              key={result.id}
                              onClick={() => handleSearchSelect(result.href)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                            >
                              <span className="text-2xl">{result.emoji}</span>
                              <div className="flex-1">
                                <p className="font-bold text-navy text-sm">{result.name}</p>
                                <p className="text-xs text-gray-500">{result.subtitle}</p>
                              </div>
                              {result.price && <span className="font-bold text-navy text-sm flex-shrink-0">Rs.{result.price.toFixed(2)}</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth Button */}
          {isLoggedIn ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hidden md:flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-pill hover:bg-navy/90 transition font-medium"
              >
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center font-bold text-sm">
                  {user?.profilePhoto}
                </div>
                <span className="max-w-[80px] truncate">{user?.fullName}</span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[200]"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-bold text-navy">{user?.fullName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href="/track"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-navy font-medium text-sm"
                    >
                      <Package size={16} />
                      My Orders
                    </Link>
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-error font-medium text-sm"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={() => openModal("AUTH")}
              className="hidden md:flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-pill hover:bg-navy/90 transition-colors font-medium"
            >
              <User size={18} />
              Login / Signup
            </button>
          )}

          {/* Mobile Cart button */}
          <button
            onClick={() => openModal("CART_DRAWER")}
            className="md:hidden bg-success text-white px-4 py-2 rounded-pill flex items-center gap-2 font-bold shadow-md"
          >
            <ShoppingBasket size={18} />
            <span>Rs.{state.total.toFixed(2)}</span>
            {state.items.length > 0 && (
              <span className="bg-white text-success rounded-full w-5 h-5 text-xs font-black flex items-center justify-center">
                {state.items.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-3 px-4 rounded-xl font-medium transition-colors ${
                    pathname === link.path ? "bg-primary/10 text-primary" : "text-foreground hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-3 mt-3">
                {isLoggedIn ? (
                  <div className="flex items-center justify-between px-4 py-2">
                    <div>
                      <p className="font-bold text-navy">{user?.fullName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button onClick={logout} className="text-error font-medium text-sm flex items-center gap-1">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { openModal("AUTH"); setMobileMenuOpen(false); }}
                    className="w-full bg-navy text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <User size={18} /> Login / Signup
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
