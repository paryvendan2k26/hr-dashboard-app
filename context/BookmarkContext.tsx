// context/BookmarkContext.tsx
'use client'; // This component uses client-side features like useState, useEffect, localStorage

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the type for a bookmarked user (minimal info needed for display)
interface Bookmark {
  id: number;
  firstName: string;
  lastName: string;
}

// Define the shape of our context value
interface BookmarkContextType {
  bookmarks: Bookmark[];
  addBookmark: (user: Omit<Bookmark, 'id'> & { id: number }) => void;
  removeBookmark: (id: number) => void;
  isBookmarked: (id: number) => boolean;
}

// Create the context with an initial undefined value
const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

// Create the provider component that will wrap parts of our application
export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // useEffect to load bookmarks from localStorage on initial component mount
  // This ensures that bookmarks persist across sessions
  useEffect(() => {
    const storedBookmarks = localStorage.getItem('bookmarks');
    if (storedBookmarks) {
      try {
        // Attempt to parse the stored string back into a JavaScript array
        setBookmarks(JSON.parse(storedBookmarks));
      } catch (e) {
        // Log an error if parsing fails (e.g., corrupted data in localStorage)
        console.error("Failed to parse bookmarks from localStorage", e);
        setBookmarks([]); // Reset bookmarks to an empty array in case of error
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // useEffect to save bookmarks to localStorage whenever the 'bookmarks' state changes
  useEffect(() => {
    // Only save if bookmarks array is not empty or if there's existing data to clear
    // This prevents unnecessary writes and clears if all bookmarks are removed
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]); // Dependency array ensures this runs whenever 'bookmarks' state updates

  // Function to add a user to bookmarks
  const addBookmark = (user: Omit<Bookmark, 'id'> & { id: number }) => {
    setBookmarks((prev) => {
      // Check if the user is already bookmarked to prevent duplicates
      if (prev.some(b => b.id === user.id)) {
        return prev; // If already exists, return the previous state without changes
      }
      // If not bookmarked, add the new user to the array
      return [...prev, { id: user.id, firstName: user.firstName, lastName: user.lastName }];
    });
  };

  // Function to remove a user from bookmarks
  const removeBookmark = (id: number) => {
    // Filter out the bookmark with the matching ID
    setBookmarks((prev) => prev.filter(b => b.id !== id));
  };

  // Function to check if a user is currently bookmarked
  const isBookmarked = (id: number) => {
    // Returns true if any bookmark in the array has the given ID
    return bookmarks.some(b => b.id === id);
  };

  // Provide the bookmarks state and functions to consumers of this context
  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

// Custom hook to easily consume the BookmarkContext in any functional component
export function useBookmarks() {
  const context = useContext(BookmarkContext);
  // Throw an error if the hook is used outside of a BookmarkProvider,
  // which indicates a common setup mistake
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}