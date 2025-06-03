// src/app/bookmarks/page.tsx
'use client';

import { useBookmarks } from '../../../../context/BookmarkContext'; // CORRECTED PATH
import Link from 'next/link';
import { FaInfoCircle, FaRegBookmark, FaArrowUp, FaArrowLeft, FaTrashAlt } from 'react-icons/fa';

export default function BookmarksPage() {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-8 lg:p-12 border border-gray-100">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-8 text-center leading-tight">
          Your Bookmarked Employees
        </h1>

        {bookmarks.length === 0 ? (
          <div className="text-center bg-blue-50 border border-blue-200 text-blue-800 p-8 rounded-lg max-w-2xl mx-auto shadow-sm">
            <FaRegBookmark className="text-blue-500 text-5xl mb-4 mx-auto" />
            <p className="text-lg mb-4 font-medium">
              It looks like you have not bookmarked any employees yet.
            </p>
            <p className="text-md text-blue-700 mb-6">
              Bookmarks allow you to quickly access your favorite employee profiles.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-full shadow-sm
                         text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         transition-all duration-200 ease-in-out"
            >
              <FaArrowLeft className="mr-2 -ml-1" /> Explore Employees
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="border border-gray-200 p-5 rounded-lg shadow-md bg-gradient-to-br from-white to-gray-50
                           flex flex-col justify-between hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
                    {bookmark.firstName} {bookmark.lastName}
                  </h2>
                  <p className="text-gray-600 text-sm">Employee ID: <span className="font-medium text-gray-700">{bookmark.id}</span></p>
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-3 justify-end">
                  <Link
                    href={`/employee/${bookmark.id}`}
                    className="flex items-center bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium
                               hover:bg-indigo-200 transition duration-200 shadow-sm"
                  >
                    <FaInfoCircle className="mr-2" /> Details
                  </Link>
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium
                               hover:bg-red-200 transition duration-200 shadow-sm"
                  >
                    <FaTrashAlt className="mr-2" /> Remove
                  </button>
                  <button
                    className="flex items-center bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium
                               hover:bg-purple-200 transition duration-200 shadow-sm"
                  >
                    <FaArrowUp className="mr-2" /> Promote
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back to Dashboard Button (only if bookmarks exist, or always displayed clearly) */}
        {bookmarks.length > 0 && (
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-semibold rounded-full shadow-md
                         text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300
                         transition-all duration-200 ease-in-out"
            >
              <FaArrowLeft className="mr-2" /> Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
