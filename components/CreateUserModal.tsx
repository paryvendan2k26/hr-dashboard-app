// components/CreateUserModal.tsx
'use client';

import React, { useState } from 'react';
import { FaTimes, FaUserPlus, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Import icons

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    age: number; // Added age
    phone: string; // Added phone
  }) => void;
}

export function CreateUserModal({ isOpen, onClose, onSubmit }: CreateUserModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [age, setAge] = useState<string>(''); // Keep as string for input, convert to number on submit
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!firstName.trim()) newErrors.firstName = 'First Name is required.';
    if (!lastName.trim()) newErrors.lastName = 'Last Name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!department.trim()) newErrors.department = 'Department is required.';

    // Validate Age
    if (!age.trim()) {
      newErrors.age = 'Age is required.';
    } else {
      const ageNum = parseInt(age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 99) {
        newErrors.age = 'Age must be a number between 18 and 99.';
      }
    }

    // Validate Phone Number (simple pattern)
    if (!phone.trim()) {
      newErrors.phone = 'Phone Number is required.';
    } else if (!/^\+?[0-9\s-()]{7,20}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        firstName,
        lastName,
        email,
        department,
        age: parseInt(age), // Convert age to number here
        phone,
      });
      // Reset form fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setDepartment('');
      setAge('');
      setPhone('');
      setErrors({});
      onClose(); // Close modal after successful submission
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
          aria-label="Close modal"
        >
          <FaTimes className="text-xl" />
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
          <FaUserPlus className="text-indigo-600 text-2xl" /> Add New Employee
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              id="firstName"
              className={`mt-1 block w-full p-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm
                         focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200`}
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); setErrors(prev => ({ ...prev, firstName: '' })); }}
              aria-invalid={errors.firstName ? "true" : "false"}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
            />
            {errors.firstName && (
              <p id="firstName-error" className="text-red-600 text-xs mt-1 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.firstName}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              id="lastName"
              className={`mt-1 block w-full p-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm
                         focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200`}
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); setErrors(prev => ({ ...prev, lastName: '' })); }}
              aria-invalid={errors.lastName ? "true" : "false"}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            {errors.lastName && (
              <p id="lastName-error" className="text-red-600 text-xs mt-1 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.lastName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              className={`mt-1 block w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm
                         focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200`}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-600 text-xs mt-1 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.email}
              </p>
            )}
          </div>

          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
            <input
              type="text"
              id="department"
              className={`mt-1 block w-full p-3 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm
                         focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200`}
              value={department}
              onChange={(e) => { setDepartment(e.target.value); setErrors(prev => ({ ...prev, department: '' })); }}
              aria-invalid={errors.department ? "true" : "false"}
              aria-describedby={errors.department ? "department-error" : undefined}
            />
            {errors.department && (
              <p id="department-error" className="text-red-600 text-xs mt-1 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.department}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
            <input
              type="number" // Use type="number" for age
              id="age"
              className={`mt-1 block w-full p-3 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm
                         focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200`}
              value={age}
              onChange={(e) => { setAge(e.target.value); setErrors(prev => ({ ...prev, age: '' })); }}
              aria-invalid={errors.age ? "true" : "false"}
              aria-describedby={errors.age ? "age-error" : undefined}
              min="18" // Min age
              max="99" // Max age
            />
            {errors.age && (
              <p id="age-error" className="text-red-600 text-xs mt-1 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.age}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel" // Use type="tel" for phone numbers
              id="phone"
              className={`mt-1 block w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm
                         focus:ring-indigo-500 focus:border-indigo-500 outline-none transition duration-200`}
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: '' })); }}
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && (
              <p id="phone-error" className="text-red-600 text-xs mt-1 flex items-center">
                <FaExclamationCircle className="mr-1" /> {errors.phone}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-full shadow-lg
                       text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                       transition-all duration-200 ease-in-out mt-6"
          >
            <FaCheckCircle className="mr-2 -ml-1 text-lg" /> Add Employee
          </button>
        </form>
      </div>
    </div>
  );
}