'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  cities: string[];
}

export default function SearchBar({ onSearch, cities }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity('');
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCity(value);
    
    if (value.trim()) {
      const filteredCities = cities.filter(c => 
        c.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filteredCities);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectCity = (selectedCity: string) => {
    setCity(selectedCity);
    setSuggestions([]);
    onSearch(selectedCity);
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <form onSubmit={handleSubmit} className="flex w-full">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </span>
          <input
            type="text"
            value={city}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="输入城市名称"
            className="w-full pl-10 pr-4 py-3 border-2 border-primary-200 focus:border-primary-500 rounded-l-xl bg-white dark:bg-primary-900 dark:border-primary-700 dark:text-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-200"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-primary-600 text-white rounded-r-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 font-medium"
        >
          搜索
        </button>
      </form>
      
      {suggestions.length > 0 && isFocused && (
        <ul className="absolute z-10 w-full bg-white dark:bg-primary-800 border-2 border-primary-200 dark:border-primary-700 rounded-xl mt-1 shadow-lg max-h-60 overflow-auto animate-fade-in">
          {suggestions.map((suggestion, index) => (
            <li 
              key={index}
              className="px-4 py-3 hover:bg-primary-50 dark:hover:bg-primary-700 cursor-pointer transition-colors duration-150 text-gray-800 dark:text-white"
              onClick={() => handleSelectCity(suggestion)}
            >
              <div className="flex items-center">
                <span className="text-primary-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </span>
                {suggestion}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 