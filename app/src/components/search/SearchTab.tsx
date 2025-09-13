import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchContainer from "./SearchContainer";
import { FiltersProps } from "../../types/common/Search";

interface SearchTabProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSearchComplete: (query: string, page: number, filters: FiltersProps) => void;
}

const SearchTab: React.FC<SearchTabProps> = ({ isOpen, setIsOpen, onSearchComplete }) => {
  const [hasBeenClicked, setHasBeenClicked] = useState(false);

  const handleClick = () => {
    if (!hasBeenClicked) {
      setHasBeenClicked(true);
    }
    setIsOpen(!isOpen);
  };

  const wrappedOnSearchComplete = (query: string, page: number, filters: FiltersProps) => {
    onSearchComplete(query, page, filters);
    if (query !== "") {
      setIsOpen(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`fixed bottom-16 md:bottom-10 right-0 z-50 ${
          isOpen ? "bg-green-500" : "bg-green-600"
        } transition-colors duration-300 text-white px-3 py-0 md:px-4 md:py-2.5 h-11 md:h-auto rounded-l-lg shadow-lg text-sm md:text-base ${
          !hasBeenClicked ? "animate-glow-pulse" : ""
        }`}
      >
        {/* Mobile: Icon only, Desktop: Icon + Text in flex container */}
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 md:h-5 md:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="hidden md:inline">{isOpen ? "Close" : "Search"}</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 right-0 w-full xs:w-[27rem] h-screen bg-white z-40 shadow-lg"
          >
            <div className="p-4 pt-16 flex flex-col h-full overflow-y-auto">
              <SearchContainer onSearchComplete={wrappedOnSearchComplete} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchTab;
