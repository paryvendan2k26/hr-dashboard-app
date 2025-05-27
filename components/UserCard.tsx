// src/components/UserCard.tsx
'use client';

import Link from 'next/link';
// Remove useState import for isExpanded here, as it's managed by parent
import { useBookmarks } from '../context/BookmarkContext';
import {
  FaStar,
  FaRegStar,
  FaBookmark,
  FaRegBookmark,
  FaInfoCircle,
  FaArrowUp,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

// Define the type for a user
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  company: {
    department: string;
  };
  phone: string; // Ensure phone is here if you're using it
  // Add other relevant properties you want to display
}

const getMockRating = () => Math.floor(Math.random() * 5) + 1;

interface UserCardProps {
  user: User;
  isExpanded: boolean; // NEW: Prop indicating if this specific card is expanded
  onToggleExpand: (userId: number) => void; // NEW: Callback to toggle expansion in parent
}

export function UserCard({ user, isExpanded, onToggleExpand }: UserCardProps) {
  // Remove internal isExpanded state as it's now a prop

  // Call onToggleExpand prop, passing this card's user.id
  const handleToggleClick = () => {
    onToggleExpand(user.id);
  };

  const rating = getMockRating(); // Generates a random rating on each render

  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(user.id);

  const handleBookmarkClick = () => {
    if (bookmarked) {
      removeBookmark(user.id);
    } else {
      addBookmark({ id: user.id, firstName: user.firstName, lastName: user.lastName });
    }
  };

  return (
    <div className="border border-gray-200 p-5 rounded-lg shadow-sm bg-gradient-to-br from-white to-gray-50 flex flex-col justify-between hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      {/* Always Visible Content */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-gray-600 text-sm mb-3">
          <span className="font-medium">Department:</span> {user.company.department}
        </p>
      </div>

      {/* Collapsible Content */}
      <div
        className={`
          grid
          transition-all duration-500 ease-in-out
          ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'}
        `}
      >
        <div className="overflow-hidden">
          <p className="text-gray-600 text-sm mb-1 flex items-center pt-3">
            <span className="mr-2 text-gray-400">@</span> {user.email}
          </p>
          <p className="text-gray-600 text-sm mb-1">
            <span className="font-medium">Age:</span> {user.age}
          </p>
          <p className="text-gray-600 text-sm mb-1">
            <span className="font-medium">Phone:</span> {user.phone}
          </p>

          <div className="flex items-center mt-3 mb-4">
            <span className="text-gray-700 font-medium mr-2">Performance:</span>
            {Array.from({ length: 5 }, (_, i) => (
              i < rating ? <FaStar key={i} className="text-yellow-400 text-lg" /> : <FaRegStar key={i} className="text-gray-300 text-lg" />
            ))}
          </div>

          {/* Action Buttons - also part of collapsible content */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3 justify-end">
            <Link href={`/employee/${user.id}`} className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-200 transition duration-200 shadow-sm">
              <FaInfoCircle className="mr-2" /> View Details
            </Link>
            <button
              onClick={handleBookmarkClick}
              className={`${
                bookmarked
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              } flex items-center px-4 py-2 rounded-full text-sm font-medium transition duration-200 shadow-sm`}
            >
              {bookmarked ? (
                <>
                  <FaBookmark className="mr-2" /> Unbookmark
                </>
              ) : (
                <>
                  <FaRegBookmark className="mr-2" /> Bookmark
                </>
              )}
            </button>
            <button className="flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full hover:bg-purple-200 transition duration-200 text-sm font-medium shadow-sm">
              <FaArrowUp className="mr-2" /> Promote
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Button at the bottom */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={handleToggleClick} // Call the new handler
          className="w-full flex items-center justify-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium text-sm py-2 rounded-md bg-indigo-50 hover:bg-indigo-100"
        >
          {isExpanded ? (
            <>
              <FaChevronUp className="mr-2" /> Hide Details
            </>
          ) : (
            <>
              <FaChevronDown className="mr-2" /> View More Details
            </>
          )}
        </button>
      </div>
    </div>
  );
}