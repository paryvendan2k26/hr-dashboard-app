// src/app/employee/[id]/page.tsx
'use client'; // ADD THIS LINE at the very top

import Link from 'next/link';

// Define the detailed type for a user, as received from dummyjson
interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  phone: string;
  address: {
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  company: {
    department: string;
    title: string;
    name: string; // Company name
  };
  bloodGroup: string;
  gender: string;
  birthDate: string;
  image: string; // User image URL
  // Add more fields from dummyjson user object as needed
}

// Client-side function to fetch details for a single user by ID
// This function needs to be defined outside the component or memoized if it were a server component
// but since the page is now 'use client', it's fine as a regular async function inside.
async function getUserDetails(id: string): Promise<UserDetails> {
  try {
    const res = await fetch(`https://dummyjson.com/users/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch user details for ID ${id}: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching user details for ID ${id}:`, error);
    throw error;
  }
}

// Mock data for past performance history (for demonstration)
const mockPastPerformance = [
  { id: 1, date: '2024-01-15', score: 4.5, notes: 'Exceeded Q1 targets, strong leadership.' },
  { id: 2, date: '2023-07-20', score: 4.0, notes: 'Consistent performance, good team player.' },
  { id: 3, date: '2023-01-10', score: 3.8, notes: 'Met expectations, areas for growth identified.' },
];

// Helper function to determine performance badge color based on rating
const getPerformanceBadgeColor = (rating: number) => {
  if (rating >= 4.5) return 'bg-green-600';
  if (rating >= 4.0) return 'bg-green-500';
  if (rating >= 3.5) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Helper for a quick mock rating (1-5 stars) - for current performance display
const getMockCurrentRating = () => Math.floor(Math.random() * 5) + 1;


// Dynamic Employee Details Page component
// Now that this is a client component, you'll need to fetch data within useEffect or use a client-side data fetching library
// For simplicity in this sprint, we'll keep the async direct call, but remember it will execute on initial load client-side.
// If you need server-side rendering for the initial data, you'd fetch in a separate Server Component and pass props.
import { useEffect, useState } from 'react'; // Import useEffect and useState for client-side data fetching

export default function EmployeeDetailsPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const userData = await getUserDetails(params.id);
        setUser(userData);
      } catch (err: any) {
        setError(err.message || "Failed to load user details.");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [params.id]); // Re-run when the ID changes

  if (loading) {
    return <div className="text-center text-xl text-gray-700 mt-10">Loading employee details...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600 mt-10">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-center text-xl text-gray-700 mt-10">Employee not found.</div>;
  }

  const currentMockRating = getMockCurrentRating(); // Get a mock current rating

  return (
    <div className="p-6 bg-white shadow-xl rounded-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
        <img
          src={user.image || `https://placehold.co/128x128/aabbcc/ffffff?text=${user.firstName[0]}${user.lastName[0]}`}
          alt={`${user.firstName} ${user.lastName}`}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow-md mb-4 md:mb-0 md:mr-6"
          onError={(e) => { e.currentTarget.src = `https://placehold.co/128x128/aabbcc/ffffff?text=${user.firstName[0]}${user.lastName[0]}`; }}
        />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-800">{user.firstName} {user.lastName}</h1>
          <p className="text-xl text-blue-600 font-medium">{user.company.title} at {user.company.name}</p>
          <div className="mt-3 flex items-center justify-center md:justify-start">
            <span className="font-semibold text-gray-700 mr-2">Current Performance:</span>
            <span className={`px-4 py-1 rounded-full text-white font-bold ${getPerformanceBadgeColor(currentMockRating)} shadow-sm`}>
              {'⭐'.repeat(currentMockRating)} ({currentMockRating} stars)
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Contact Information */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 border-b pb-2">Contact Information</h2>
          <p className="text-gray-700 mb-2"><strong className="font-medium">Email:</strong> {user.email}</p>
          <p className="text-gray-700 mb-2"><strong className="font-medium">Phone:</strong> {user.phone}</p>
          <p className="text-gray-700 mb-2"><strong className="font-medium">Address:</strong> {user.address.address}, {user.address.city}, {user.address.state} {user.address.postalCode}</p>
        </div>

        {/* Personal Details */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 border-b pb-2">Personal Details</h2>
          <p className="text-gray-700 mb-2"><strong className="font-medium">Age:</strong> {user.age}</p>
          <p className="text-gray-700 mb-2"><strong className="font-medium">Gender:</strong> {user.gender}</p>
          <p className="text-gray-700 mb-2"><strong className="font-medium">Date of Birth:</strong> {user.birthDate}</p>
          <p className="text-gray-700 mb-2"><strong className="font-medium">Blood Group:</strong> {user.bloodGroup}</p>
        </div>
      </div>

      {/* Past Performance History */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 border-b pb-2">Past Performance History</h2>
        {mockPastPerformance.map(p => (
          <div key={p.id} className="mb-3 p-3 border border-gray-200 bg-white rounded-md last:mb-0">
            <p className="text-gray-800"><strong>Date:</strong> {p.date}</p>
            <p className="text-gray-800"><strong>Score:</strong> {p.score}</p>
            <p className="text-gray-800"><strong>Notes:</strong> {p.notes}</p>
          </div>
        ))}
      </div>

      {/* Tabbed UI Placeholder */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 border-b pb-2">Additional Information (Tabs)</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="px-4 py-2 bg-blue-100 text-blue-800 font-medium rounded-md hover:bg-blue-200 transition-colors duration-150">Overview</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition-colors duration-150">Projects</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition-colors duration-150">Feedback</button>
        </div>
        <div className="border border-gray-200 p-4 rounded-md bg-white text-gray-700">
          <p>Content for the selected tab would load dynamically here. For this sprint, this is a placeholder.</p>
        </div>
      </div>

      {/* Back to Dashboard Link */}
      <Link href="/" className="inline-block bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 text-lg font-medium shadow-md">
        ← Back to Dashboard
      </Link>
    </div>
  );
}