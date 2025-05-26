import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FiFilter, FiRefreshCcw } from "react-icons/fi";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from "chart.js";
import Loader from "@/components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import expensesImage from "../../../assets/images/background/expenses.svg"; // Import the image
import ExpenseCard from '@/components/Cards/ExpenseCard/ExpenseCard';
import ExpenseFilters from '@/components/ExpenseFilters/ExpenseFilters';
import { fetchInsightsData } from "@/Service/Api/api";
import NoContent from "@/components/NoContentScreen/noContentScreen";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const Insights = () => {
  const { toggleSidebar } = useOutletContext();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    merchant: "",
    category: "",
  });
  const [categories, setCategories] = useState([]);
  const chartSectionRef = React.useRef(null);
  // Fetch expenses and categories dynamically from the API
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewRawDataCategory, setViewRawDataCategory] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle row click to show detailed data
  const handleViewRawData = (category) => {
    if (viewRawDataCategory === category) {
      setViewRawDataCategory(null);
    } else {
      setViewRawDataCategory(category);
    }
  };

  // Filtered data based on filters
  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    if (fromDate && expenseDate < fromDate) return false;
    if (toDate && expenseDate > toDate) return false;
    if (
      filters.merchant &&
      !expense.merchant.toLowerCase().includes(filters.merchant.toLowerCase())
    )
      return false;
    if (filters.category && expense.category !== filters.category) return false;

    return true;
  });

  //FIRST CHART CODE
  // Aggregate data for the chart
  const aggregatedData = categories.map((category) => {
    const totalAmount = filteredExpenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      category,
      totalAmount,
      count: filteredExpenses.filter((e) => e.category === category).length,
    };
  });

  // Chart data
  const chartData = {
    labels: aggregatedData.map((data) => data.category),
    datasets: [
      {
        data: aggregatedData.map((data) => data.totalAmount),
        backgroundColor: [
          "#FFD700", // Gold
          "#32CD32", // Lime Green
          "#1E90FF", // Dodger Blue
          "#FF4500", // Orange Red
          "#800080", // Purple
          "#0B2838", //theme dark color
          "#00CED1", // Dark Turquoise
          "#FF1493", // Deep Pink
          "#ADFF2F", // Green Yellow
          "#FF6347", // Tomato
          "#4682B4", // Steel Blue
        ],
        borderWidth: 1,
      },
    ],
  };

  // Reset Filters Functionality
  const resetFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      merchant: "",
      category: "",
    });
  };

  // const chartOptions = {
  //   responsive: true,
  //   maintainAspectRatio: false,
  //   plugins: {
  //     legend: {
  //       position: window.innerWidth < 768 ? 'bottom' : 'right',
  //       align: 'center',
  //       labels: {
  //         boxWidth: window.innerWidth < 768 ? 12 : 15,
  //         padding: window.innerWidth < 768 ? 8 : 15,
  //         font: {
  //           size: window.innerWidth < 768 ? 11 : 13,
  //           family: "'Inter', sans-serif"
  //         }
  //       }
  //     }
  //   }
  // };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom', // Always show legend at bottom
        align: 'center',
        labels: {
          boxWidth: window.innerWidth < 768 ? 12 : 15,
          padding: window.innerWidth < 768 ? 8 : 15,
          font: {
            size: window.innerWidth < 768 ? 11 : 13,
            family: "'Inter', sans-serif"
          }
        }
      }
    }
  };

  const handleBackClick = () => {
    setViewRawDataCategory(null);
    // Scroll to the Pie Chart section
    if (chartSectionRef.current) {
      chartSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const expenses = await fetchInsightsData();
      setExpenses(expenses);

      // Extract unique categories from fetched expenses
      const uniqueCategories = [...new Set(expenses.map((expense) => expense.category))];
      setCategories(uniqueCategories);

      // Optionally, store categories in localStorage
      localStorage.setItem("expenseCategories", JSON.stringify(uniqueCategories));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // Add this function to process monthly data
  const getMonthlyData = () => {
    const monthlyTotals = {};

    filteredExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      monthlyTotals[monthYear] = (monthlyTotals[monthYear] || 0) + expense.amount;
    });

    return {
      labels: Object.keys(monthlyTotals),
      data: Object.values(monthlyTotals),
    };
  };

  // Add bar chart data configuration
  const monthlyData = getMonthlyData();

  // Professional gradient colors
  const createGradient = (ctx, color1, color2) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
  };

  // Update the bar chart data configuration
  const barChartData = {
    labels: monthlyData.labels,
    datasets: [{
      label: 'Monthly Expenses',
      data: monthlyData.data,
      backgroundColor: function (context) {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) {
          return null;
        }
        return createGradient(
          ctx,
          'rgba(53, 162, 235, 0.9)',
          'rgba(53, 162, 235, 0.4)'
        );
      },
      borderWidth: 0,
      borderRadius: {
        topLeft: 4,
        topRight: 4,
      },
    }]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        titleFont: {
          size: 14,
          weight: '600',
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif",
        },
        padding: 16,
        boxPadding: 8,
        usePointStyle: true,
        borderColor: 'rgba(226, 232, 240, 1)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: (context) => {
            return [
              'Total Expenses:',
              `₹${context.parsed.y.toLocaleString('en-IN', {
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              })}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(226, 232, 240, 0.6)',
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          callback: (value) => {
            return '₹' + value.toLocaleString('en-IN', {
              maximumFractionDigits: 0,
              style: 'decimal',
            });
          },
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
            family: "'Inter', sans-serif",
            weight: '500',
          },
          color: '#64748b',
          padding: 12,
        },
        maxTicksLimit: window.innerWidth < 768 ? 5 : 8,
      },
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: window.innerWidth <= 575 ? 10 : 12,
            family: "'Inter', sans-serif",
          },
          color: '#64748b',
          padding: 8,
        },
        maxRotation: window.innerWidth <= 575 ? 45 : 0,
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart',
    },
    layout: {
      padding: {
        top: window.innerWidth <= 575 ? 5 : 24,
        right: window.innerWidth <= 575 ? 5 : 24,
        bottom: window.innerWidth <= 575 ? 5 : 24,
        left: window.innerWidth <= 575 ? 5 : 24
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFAF3]">
      {/* Header Section */}
      <div className="shadow-md px-3 py-2 md:p-4 flex justify-between items-center fixed top-0 w-full z-40 bg-white">
        <button
          onClick={toggleSidebar}
          className="xl:hidden text-[#0B2838] text-2xl p-2 hover:bg-gray-100 rounded"
        >
          <FaBars />
        </button>
        <h1 className="text-xl md:text-3xl font-bold text-[#0B2838]">
          Insights
        </h1>
      </div>

      {/* Replace the old filters section with ExpenseFilters component */}
      <ExpenseFilters
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        categories={categories}
      />



      {/* Main Content Section with better padding and spacing */}
      <div className="flex-1 p-2 md:p-6 "> {/* Adjusted top margin for fixed header */}
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader />
          </div>
        ) : filteredExpenses.length > 0 ? (
          <>
            {/* Only show charts and tables if no raw data category is selected */}
            {!viewRawDataCategory && (
              <div ref={chartSectionRef} className="space-y-6">
                <div className="bg-white rounded-2xl shadow-md p-3 md:p-6">
                  {/* Charts Container */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                    {/* Pie Chart */}
                    <div className="bg-white p-4 order-2 border rounded-xl">
                      <h2 className="text-base md:text-lg font-bold mb-2 text-[#0B2838]">
                        Categories
                      </h2>
                      <div className="h-[350px] max-[375px]:h-[296px] mt-16 sm:h-[320px] md:h-[400px]">
                        <Pie data={chartData} options={chartOptions} />
                      </div>
                    </div>
                    {/* Bar Chart */}
                    <div className="bg-white p-4 order-1 border rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg md:text-xl font-bold text-[#0B2838]">
                          Monthly Expenses
                        </h2>
                        <div className="text-sm font-medium text-slate-500">
                          {new Date().getFullYear()}
                        </div>
                      </div>

                      {/* Stats Summary - More responsive grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                        {/* Stats cards with better mobile layout */}
                        <div className="bg-slate-50 p-3 md:p-4 rounded-lg">
                          <div className="text-xs md:text-sm font-medium text-slate-600">
                            Total Expenses
                          </div>
                          <div className="text-sm md:text-base lg:text-lg font-semibold text-slate-800 mt-1">
                            ₹{monthlyData.data.reduce((a, b) => a + b, 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="bg-slate-50 p-3 md:p-4 rounded-lg">
                          <div className="text-xs md:text-sm font-medium text-slate-600">Average Month</div>
                          <div className="text-sm md:text-base lg:text-lg font-semibold text-slate-800 mt-1">
                            ₹{Math.round(monthlyData.data.reduce((a, b) => a + b, 0) / monthlyData.data.length).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="bg-slate-50 p-3 md:p-4 rounded-lg">
                          <div className="text-xs md:text-sm font-medium text-slate-600">Highest Month</div>
                          <div className="text-sm md:text-base lg:text-lg font-semibold text-slate-800 mt-1">
                            ₹{Math.max(...monthlyData.data).toLocaleString('en-IN')}
                          </div>
                        </div>
                        <div className="bg-slate-50 p-3 md:p-4 rounded-lg">
                          <div className="text-xs md:text-sm font-medium text-slate-600">Lowest Month</div>
                          <div className="text-sm md:text-base lg:text-lg font-semibold text-slate-800 mt-1">
                            ₹{Math.min(...monthlyData.data).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      <div className="max-[375px] sm:h-[320px] md:h-[400px] w-[calc(100vw-32px)] sm:w-full ">
                        <Bar data={barChartData} options={barChartOptions} />
                      </div>
                    </div>
                  </div>

                
                </div>
                  {/* Responsive Table */}
                  <div className="bg-white p-4 order-1 border rounded-xl">
                  <div className="overflow-x-auto -mx-2 md:mx-0 pt-8">
                    <table className="w-full text-left ">
                      <thead className="bg-gradient-to-r from-[#0B2838] to-[#1a4459]  transform  rounded-xl text-white p-3" >
                        <tr>
                          <th className="p-2 md:p-4 text-xs md:text-sm font-bold rounded-tl-xl">CATEGORY</th>
                          <th className="p-2 md:p-4 text-xs md:text-sm font-bold">TOTAL</th>
                          <th className="p-2 md:p-4 text-xs md:text-sm font-bold"># OF EXPENSES</th>
                          <th className="p-2 md:p-4 text-xs md:text-sm font-bold">AVERAGE</th>
                          <th className="p-2 md:p-4 text-xs md:text-sm font-bold rounded-tr-xl">VIEW</th>
                        </tr>
                      </thead>
                      <tbody>
                        {aggregatedData.map((data) => (
                          <tr
                            key={data.category}
                            className="border-b text-[11px] md:text-sm hover:bg-gray-50 font-semibold"
                          >
                            <td className="p-2 md:p-3 whitespace-nowrap">{data.category}</td>
                            <td className="p-2 md:p-3 whitespace-nowrap">
                              ₹{data.totalAmount.toFixed(2)}
                            </td>
                            <td className="p-2 md:p-3 whitespace-nowrap ">{data.count}</td>
                            <td className="p-2 md:p-3 whitespace-nowrap">
                              ₹{(data.totalAmount / data.count).toFixed(2)}
                            </td>
                            <td className="p-2 md:p-3">
                              <button
                                className="text-[#2095d9] hover:text-blue-700 p-1"
                                onClick={() => handleViewRawData(data.category)}
                              >
                                <FaBars className="text-xs md:text-sm" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  </div>
              </div>
            )}

            {/* Expense Cards Grid */}
            {viewRawDataCategory && (
              <div className="p-2 ">
                <div
                  className="mb-4 flex items-center space-x-2 cursor-pointer w-20 bg-gradient-to-r from-[#0B2838] to-[#1a4459] hover:from-[#1a4459] hover:to-[#0B2838] transition-all duration-300 ease-in-out transform hover:scale-[1.02] rounded text-white p-3"
                  onClick={handleBackClick}
                >
                  <FaArrowLeft className="text-sm md:text-base" />
                  <span className="text-xs md:text-sm font-medium">Back</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 gap-4">
                  {expenses
                    .filter((expense) => expense.category === viewRawDataCategory)
                    .map((expense) => (
                      <ExpenseCard
                        key={expense._id}
                        expense={expense}
                        isSelected={false}
                      />
                    ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <NoContent />
        )}
      </div>
    </div>
  );
};

export default Insights;
