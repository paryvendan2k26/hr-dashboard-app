// src/components/SearchFilter.tsx
import React, { useState } from 'react';
import { FaSearch, FaStar, FaRegStar } from 'react-icons/fa'; // Import necessary icons

interface SearchFilterProps {
  onSearch: (searchTerm: string) => void;
  onFilterDepartment: (departments: string[]) => void;
  onFilterRating: (ratings: number[]) => void;
  allDepartments: string[];
  renderStars: (rating: number) => JSX.Element; // Expect renderStars prop (e.g., from UserCard's logic)
  selectedDepartments: string[];
  selectedRatings: number[];
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearch,
  onFilterDepartment,
  onFilterRating,
  allDepartments,
  renderStars,
  selectedDepartments,
  selectedRatings,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
    onSearch(e.target.value); // Trigger parent search immediately
  };

  const handleDepartmentClick = (department: string) => {
    if (selectedDepartments.includes(department)) {
      onFilterDepartment(selectedDepartments.filter((d) => d !== department));
    } else {
      onFilterDepartment([...selectedDepartments, department]);
    }
  };

  const handleRatingClick = (rating: number) => {
    if (selectedRatings.includes(rating)) {
      onFilterRating(selectedRatings.filter((r) => r !== rating));
    } else {
      onFilterRating([...selectedRatings, rating]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-10">
      {/* Search Input Section */}
      <section className="mb-8">
        <label htmlFor="search-input" className="sr-only">Search employees</label>
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="search-input"
            type="text"
            placeholder="Search by name, email, or department..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400
                       focus:ring-2 focus:ring-indigo-300 focus:border-transparent outline-none
                       transition-all duration-200 ease-in-out text-base"
            value={localSearchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Filter by Department Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-100">
            Filter by Department
          </h3>
          <div className="flex flex-wrap gap-2">
            {allDepartments.length > 0 ? (
              allDepartments.map((department) => (
                <button
                  key={department}
                  onClick={() => handleDepartmentClick(department)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out
                    ${selectedDepartments.includes(department)
                      ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' // Stronger selected state
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                >
                  {department}
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No departments loaded.</p>
            )}
          </div>
        </section>

        {/* Filter by Rating Section */}
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 border-gray-100">
            Filter by Performance Rating
          </h3>
          <div className="flex flex-wrap gap-2 items-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingClick(rating)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out
                  ${selectedRatings.includes(rating)
                    ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' // Stronger selected state
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
              >
                {/* Use the provided renderStars prop, but wrap it for consistent icon sizing/alignment */}
                <span className="flex items-center text-lg leading-none">
                   {/* Here, we manually render stars to ensure consistent sizing within the button.
                       You can choose to still use `renderStars(rating)` if its output is visually compatible.
                       For explicit control here, I'll use FaStar/FaRegStar directly for the buttons.
                   */}
                   {Array.from({ length: rating }, (_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                   ))}
                   {Array.from({ length: 5 - rating }, (_, i) => (
                      <FaRegStar key={i} className="text-gray-300" />
                   ))}
                </span>
                <span className="ml-2">({rating} {rating === 1 ? 'Star' : 'Stars'})</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};