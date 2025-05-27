// src/app/page.tsx
'use client';

import { UserCard } from '../../components/UserCard';
import { SearchFilter } from '../../components/SearchFilter';
import { CreateUserModal } from '../../components/CreateUserModal';
import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaSpinner, FaUsersSlash, FaCheckCircle, FaArrowRight } from 'react-icons/fa';

// Define the type for a user, as received from dummyjson
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  company: {
    department: string;
  };
  phone: string; // Ensure phone is here if you're adding it in CreateUserModal
  // Add other relevant properties you want to display
}

// Helper for a quick mock rating (1-5 stars) - Consistent with UserCard's internal logic
const getMockRatingForUser = (userId: number) => {
  return (userId % 5) + 1;
};

// Helper for rendering stars using react-icons - consistent with SearchFilter and UserCard
import { FaStar, FaRegStar } from 'react-icons/fa';

const renderStars = (rating: number) => {
  return (
    <div className="flex text-yellow-400">
      {Array.from({ length: 5 }, (_, i) => (
        i < rating ? <FaStar key={i} className="h-5 w-5" /> : <FaRegStar key={i} className="h-5 w-5" />
      ))}
    </div>
  );
};


async function fetchUsers(limit: number, skip: number): Promise<{ users: User[], total: number }> {
  try {
    const res = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.statusText}`);
    }
    const data = await res.json();
    return { users: data.users, total: data.total };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { users: [], total: 0 };
  }
}

// Main Dashboard Page component
export default function HomePage() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [allDepartments, setAllDepartments] = useState<string[]>([]);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(12);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // NEW STATE: Tracks the ID of the currently expanded card
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  // NEW FUNCTION: Toggles the expanded state of a card
  const handleToggleCardExpand = (cardId: number) => {
    setExpandedCardId(prevId => (prevId === cardId ? null : cardId));
  };


  const loadUsers = useCallback(async () => {
    setLoadingMore(true);
    const { users: newUsers, total } = await fetchUsers(limit, skip);

    setAllUsers(prevUsers => {
      const uniqueNewUsers = newUsers.filter(nu => !prevUsers.some(pu => pu.id === nu.id));
      const combinedUsers = [...prevUsers, ...uniqueNewUsers];

      const uniqueDepartments = Array.from(new Set(combinedUsers.map(user => user.company.department)));
      setAllDepartments(uniqueDepartments);

      return combinedUsers;
    });

    setSkip(prevSkip => prevSkip + newUsers.length);
    setHasMore(skip + newUsers.length < total);
    setLoadingMore(false);
    setInitialLoading(false);
  }, [limit, skip]);

  useEffect(() => {
    loadUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let currentFiltered = allUsers;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentFiltered = currentFiltered.filter(user =>
        user.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.company.department.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (selectedDepartments.length > 0) {
      currentFiltered = currentFiltered.filter(user =>
        selectedDepartments.includes(user.company.department)
      );
    }

    if (selectedRatings.length > 0) {
      currentFiltered = currentFiltered.filter(user =>
        selectedRatings.includes(getMockRatingForUser(user.id))
      );
    }

    setFilteredUsers(currentFiltered);
  }, [searchTerm, selectedDepartments, selectedRatings, allUsers]);


  const handleCreateUser = (userData: { firstName: string; lastName: string; email: string; department: string; age: number; phone: string; }) => {
    // console.log("New user data to create:", userData);

    // Using Math.random() for ID is not robust in real apps but okay for this mock
    const newId = allUsers.length > 0 ? Math.max(...allUsers.map(u => u.id)) + 1 : 1;
    const newUser: User = { // Ensure newUser matches the User interface
      id: newId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      age: userData.age,
      company: {
        department: userData.department,
      },
      phone: userData.phone,
      // You might want to add other dummy properties like image, etc., if your User interface has them
      // image: `https://robohash.org/${newId}.png?set=set4`, // Example for a dummy image
    };
    setAllUsers(prevUsers => [...prevUsers, newUser]);
    setIsModalOpen(false);
  };


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-8 lg:p-12 border border-gray-100">
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight">
              Employee Dashboard
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Manage your workforce and gain valuable insights.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-full shadow-lg
                       text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                       transition-all duration-200 ease-in-out whitespace-nowrap"
          >
            <FaPlus className="mr-2 -ml-1 text-lg" /> Add New Employee
          </button>
        </div>

        {/* Search and Filter Section */}
        <SearchFilter
          onSearch={setSearchTerm}
          onFilterDepartment={setSelectedDepartments}
          onFilterRating={setSelectedRatings}
          allDepartments={allDepartments}
          renderStars={renderStars}
          selectedDepartments={selectedDepartments}
          selectedRatings={selectedRatings}
        />

        {/* Employee List / Loading / Empty States */}
        {initialLoading ? (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <FaSpinner className="animate-spin text-indigo-500 text-6xl mb-4" />
            <p className="text-xl text-gray-700 font-medium">Loading employee data...</p>
            <p className="text-gray-500 mt-2">Please wait a moment while we fetch the records.</p>
          </div>
        ) : filteredUsers.length === 0 && !loadingMore ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center">
            <FaUsersSlash className="text-indigo-400 text-5xl mb-4" />
            <p className="text-xl text-gray-700 font-semibold mb-2">No employees found.</p>
            <p className="text-gray-500 max-w-md">
              Your search and filter criteria yielded no matching employees. Try adjusting your selections.
            </p>
            {(searchTerm || selectedDepartments.length > 0 || selectedRatings.length > 0) && (
                <button
                    onClick={() => {
                        setSearchTerm('');
                        setSelectedDepartments([]);
                        setSelectedRatings([]);
                        setExpandedCardId(null); // Collapse any expanded card when filters are cleared
                    }}
                    className="mt-6 inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                    Clear Filters
                </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map(user => (
              <UserCard
                key={user.id}
                user={user}
                isExpanded={user.id === expandedCardId} // Pass if this card should be expanded
                onToggleExpand={handleToggleCardExpand} // Pass the handler
              />
            ))}
          </div>
        )}

        {hasMore && filteredUsers.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={loadUsers}
              disabled={loadingMore}
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-semibold rounded-full shadow-lg
                         text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <FaSpinner className="animate-spin mr-3" /> Loading More...
                </>
              ) : (
                <>
                  Load More Employees <FaArrowRight className="ml-3" />
                </>
              )}
            </button>
          </div>
        )}

        {!hasMore && !initialLoading && filteredUsers.length > 0 && (
            <p className="text-center text-neutral-dark text-sm mt-4">You have reached the end of the employee list.</p>
        )}

        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateUser}
        />
      </div>
    </div>
  );
}