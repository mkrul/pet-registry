import React, { useState } from "react";
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

  return (
    <div>
      <button
        onClick={handleClick}
        className={`fixed bottom-4 md:bottom-8 right-0 z-50 bg-blue-600 text-white px-4 py-2 md:px-5 md:py-3 rounded-l-lg shadow-lg text-sm md:text-base lg:text-lg 2xl:text-xl ${!hasBeenClicked ? "md:animate-glow-pulse" : ""}`}
      >
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 md:h-6 md:w-6"
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
          {isOpen ? "Close" : "Search"}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 right-0 w-full xs:w-4/5 sm:w-3/5 md:w-2/5 lg:w-1/3 2xl:w-1/4 h-screen bg-white z-40 overflow-y-auto shadow-lg"
          >
            <div className="p-4 pt-16">
              <SearchContainer onSearchComplete={onSearchComplete} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchTab;
