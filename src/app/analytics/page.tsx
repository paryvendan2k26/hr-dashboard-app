// src/app/analytics/page.tsx
'use client';

import Link from 'next/link';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData, // Re-import ChartData type
  ChartOptions, // Re-import ChartOptions type
  TooltipItem, // Still useful for tooltip callbacks
} from 'chart.js';

import { FaUsers, FaBirthdayCake, FaBookmark, FaChartBar, FaArrowLeft } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  // --- Professional Color Palette for Charts ---
  const primaryChartColor = 'rgba(79, 70, 229, 0.7)'; // Indigo-600 with opacity
  const primaryChartBorder = 'rgba(79, 70, 229, 1)';
  const accentChartColors = [
    'rgba(99, 102, 241, 0.8)', // Indigo-500
    'rgba(34, 197, 94, 0.8)',  // Green-500
    'rgba(249, 115, 22, 0.8)', // Orange-500
    'rgba(6, 182, 212, 0.8)',  // Cyan-500
    'rgba(168, 85, 247, 0.8)', // Purple-500
    'rgba(239, 68, 68, 0.8)',  // Red-500
    'rgba(245, 158, 11, 0.8)', // Yellow-500
    'rgba(100, 116, 139, 0.8)',// Slate-500
  ];
  const accentChartBorders = accentChartColors.map(color => color.replace('0.8', '1'));

  // --- Mock Data ---
  const mockDeptRatings = [
    { department: 'Sales', avgRating: 4.2 },
    { department: 'Marketing', avgRating: 3.8 },
    { department: 'Engineering', avgRating: 4.5 },
    { department: 'Human Resources', avgRating: 4.0 },
    { department: 'Customer Service', avgRating: 3.5 },
    { department: 'Finance', avgRating: 4.1 },
    { department: 'Operations', avgRating: 3.7 },
  ];

  const mockBookmarkTrends = [
    { month: 'Jan', count: 5 },
    { month: 'Feb', count: 8 },
    { month: 'Mar', count: 7 },
    { month: 'Apr', count: 10 },
    { month: 'May', count: 12 },
    { month: 'Jun', count: 9 },
    { month: 'Jul', count: 15 },
  ];

  const mockEmployeeAgeDistribution = [
    { range: '18-25', count: 30 },
    { range: '26-35', count: 65 },
    { range: '36-45', count: 40 },
    { range: '46-55', count: 20 },
    { range: '56+', count: 10 },
  ];

  const mockEmployeeGenderDistribution = [
    { gender: 'Male', count: 80 },
    { gender: 'Female', count: 85 },
    { gender: 'Other', count: 5 },
  ];

  // --- Key Performance Indicators (KPIs) ---
  const totalEmployees = mockEmployeeAgeDistribution.reduce((sum, item) => sum + item.count, 0);
  const totalBookmarks = mockBookmarkTrends.reduce((sum, item) => sum + item.count, 0);
  const averageEmployeeAge = '35.2'; // Mock average for display

  // --- Chart Data & Options ---

  // Department-wise Average Performance Ratings (Bar Chart)
  const departmentData: ChartData<'bar'> = { // Explicitly type ChartData
    labels: mockDeptRatings.map(data => data.department),
    datasets: [
      {
        label: 'Average Performance Rating (1-5 Stars)',
        data: mockDeptRatings.map(data => data.avgRating),
        backgroundColor: accentChartColors.slice(0, mockDeptRatings.length),
        borderColor: accentChartBorders.slice(0, mockDeptRatings.length),
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const departmentOptions: ChartOptions<'bar'> = { // Explicitly type ChartOptions
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Department-wise Average Performance Ratings',
        font: { size: 20, weight: 'bold', family: 'system-ui, sans-serif' },
        color: '#333',
        padding: { top: 10, bottom: 20 }
      },
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        bodyFont: { size: 14 },
        titleFont: { size: 16, weight: 'bold' },
        callbacks: {
          label: (context: TooltipItem<'bar'>) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)} Stars`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'Average Rating (Stars)',
          font: { size: 14, weight: 'bold' },
          color: '#555'
        },
        ticks: { color: '#666' },
        grid: { color: '#eee' }
      },
      x: {
        title: {
          display: true,
          text: 'Department',
          font: { size: 14, weight: 'bold' },
          color: '#555'
        },
        ticks: { color: '#666' },
        grid: { display: false }
      },
    },
  };

  // Bookmark Trends (Line Chart)
  const bookmarkTrendsData: ChartData<'line'> = { // Explicitly type ChartData
    labels: mockBookmarkTrends.map(data => data.month),
    datasets: [
      {
        label: 'Number of Bookmarks',
        data: mockBookmarkTrends.map(data => data.count),
        fill: true,
        backgroundColor: primaryChartColor.replace('0.7', '0.2'),
        borderColor: primaryChartBorder,
        tension: 0.4,
        pointBackgroundColor: primaryChartBorder,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: primaryChartBorder,
      },
    ],
  };

  const bookmarkTrendsOptions: ChartOptions<'line'> = { // Explicitly type ChartOptions
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Bookmark Trends',
        font: { size: 20, weight: 'bold', family: 'system-ui, sans-serif' },
        color: '#333',
        padding: { top: 10, bottom: 20 }
      },
      legend: {
        display: true,
        position: 'top' as const,
        labels: { color: '#555' }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        bodyFont: { size: 14 },
        titleFont: { size: 16, weight: 'bold' },
        callbacks: {
          label: (context: TooltipItem<'line'>) => `${context.dataset.label}: ${context.parsed.y} Bookmarks`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Bookmarks',
          font: { size: 14, weight: 'bold' },
          color: '#555'
        },
        ticks: { color: '#666', precision: 0 },
        grid: { color: '#eee' }
      },
      x: {
        title: {
          display: true,
          text: 'Month',
          font: { size: 14, weight: 'bold' },
          color: '#555'
        },
        ticks: { color: '#666' },
        grid: { display: false }
      },
    },
  };

  // Employee Gender Distribution (Pie Chart)
  const genderData: ChartData<'pie'> = { // Explicitly type ChartData
    labels: mockEmployeeGenderDistribution.map(data => data.gender),
    datasets: [
      {
        label: 'Number of Employees',
        data: mockEmployeeGenderDistribution.map(data => data.count),
        backgroundColor: [
          accentChartColors[0],
          accentChartColors[1],
          accentChartColors[2],
        ],
        borderColor: accentChartBorders.slice(0, 3),
        borderWidth: 1,
      },
    ],
  };

  const genderOptions: ChartOptions<'pie'> = { // Explicitly type ChartOptions
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Employee Gender Distribution',
        font: { size: 20, weight: 'bold', family: 'system-ui, sans-serif' },
        color: '#333',
        padding: { top: 10, bottom: 20 }
      },
      legend: {
        position: 'right' as const,
        labels: { color: '#555', font: { size: 14 } }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        bodyFont: { size: 14 },
        titleFont: { size: 16, weight: 'bold' },
        callbacks: {
          label: (context: TooltipItem<'pie'>) => { // Explicitly type context
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((acc: number, val: number) => acc + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Employee Age Distribution (Bar Chart)
  const ageData: ChartData<'bar'> = { // Explicitly type ChartData
    labels: mockEmployeeAgeDistribution.map(data => data.range),
    datasets: [
      {
        label: 'Number of Employees',
        data: mockEmployeeAgeDistribution.map(data => data.count),
        backgroundColor: accentChartColors.slice(3, 3 + mockEmployeeAgeDistribution.length),
        borderColor: accentChartBorders.slice(3, 3 + mockEmployeeAgeDistribution.length),
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const ageOptions: ChartOptions<'bar'> = { // Explicitly type ChartOptions
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Employee Age Distribution',
        font: { size: 20, weight: 'bold', family: 'system-ui, sans-serif' },
        color: '#333',
        padding: { top: 10, bottom: 20 }
      },
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        bodyFont: { size: 14 },
        titleFont: { size: 16, weight: 'bold' },
        callbacks: {
          label: (context: TooltipItem<'bar'>) => `${context.dataset.label}: ${context.parsed.y} employees`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Employees',
          font: { size: 14, weight: 'bold' },
          color: '#555'
        },
        ticks: { color: '#666', precision: 0 },
        grid: { color: '#eee' }
      },
      x: {
        title: {
          display: true,
          text: 'Age Range',
          font: { size: 14, weight: 'bold' },
          color: '#555'
        },
        ticks: { color: '#666' },
        grid: { display: false }
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-xl p-8 lg:p-12 border border-gray-100">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4 text-center leading-tight">
          HR Analytics Dashboard
        </h1>
        <p className="text-center text-gray-600 text-lg mb-10 max-w-3xl mx-auto">
          Gain insights into employee performance, departmental trends, and key HR metrics at a glance.
        </p>

        {/* Key Performance Indicators (KPIs) Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <FaChartBar className="mr-3 text-indigo-600" /> Key Metrics Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
              <FaUsers className="text-5xl text-blue-500 mx-auto mb-3" />
              <p className="text-gray-600 text-sm font-medium">Total Employees</p>
              <p className="text-4xl font-extrabold text-gray-800">{totalEmployees}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
              <FaBirthdayCake className="text-5xl text-green-500 mx-auto mb-3" />
              <p className="text-gray-600 text-sm font-medium">Average Employee Age</p>
              <p className="text-4xl font-extrabold text-gray-800">{averageEmployeeAge}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 text-center">
              <FaBookmark className="text-5xl text-purple-500 mx-auto mb-3" />
              <p className="text-gray-600 text-sm font-medium">Total Bookmarks</p>
              <p className="text-4xl font-extrabold text-gray-800">{totalBookmarks}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Department-wise Average Ratings Section */}
          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="h-96 w-full flex justify-center items-center">
              <Bar data={departmentData} options={departmentOptions} />
            </div>
          </section>

          {/* Monthly Bookmark Trends Section */}
          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="h-96 w-full flex justify-center items-center">
              <Line data={bookmarkTrendsData} options={bookmarkTrendsOptions} />
            </div>
          </section>

          {/* Employee Gender Distribution Section */}
          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="h-96 w-full flex justify-center items-center">
              <Pie data={genderData} options={genderOptions} />
            </div>
          </section>

          {/* Employee Age Distribution Section */}
          <section className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="h-96 w-full flex justify-center items-center">
              <Bar data={ageData} options={ageOptions} />
            </div>
          </section>
        </div>

        {/* Back to Dashboard Link */}
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
      </div>
    </div>
  );
}
