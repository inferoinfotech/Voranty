import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseUrl = import.meta.env.VITE_BASE_URL;

// Registration
export const UserDataRegistration = (
  registrationData,
  setRegistrationError,
  reset,
  navigate
) => {
  axios
    .post(`${baseUrl}/auth/register`, registrationData)
    .then((res) => {
      if (res.data) {
        toast.success("Registration successful!");
        reset();
        setTimeout(() => {
          navigate("/login");
        }, 2000); 
      } else {
        setRegistrationError("Registration failed.");
        toast.error("Registration failed."); 
      }
    })
    .catch((error) => {
     
      setRegistrationError("Registration failed. Please try again later.");
      toast.error("Registration failed. Please try again later."); 
    });
};



// Login
export const userLogin = (loginData, setLoginError, navigate) => {
  axios
    .post(`${baseUrl}/auth/login`, loginData)
    .then((res) => {
      const { token, user } = res.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful! Welcome back.");

      setTimeout(() => {
        navigate("/home");
      }, 2000); 
    })
    .catch((error) => {

      toast.error(
        error.response?.data?.msg || "Login failed. Please try again."
      );
    });
};

// Send OTP
export const sendOtp = async (email) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/sendOtp`, {
      email,
    });

    return response.data;
  } catch (error) {
    console.log(
      "Error sending OTP:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

export const sendRegisterOtp = async (email) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/sendRegisterOTP`, {
      email,
    });

    return response.data;
  } catch (error) {
    console.log(
      "Error sending OTP:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

// Verify OTP
export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/verifyOtp`, {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    console.log(
      "Error verifying OTP:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const verifyRegisterOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/verifyRegisterOtp`, {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    console.log(
      "Error verifying OTP:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};


// Reset Password
export const resetPassword = async (userId, password) => {
  try {
    if (!userId || !password) {
      throw new Error("User ID and password are required");
    }

    const response = await axios.post(
      `${baseUrl}/auth/resetPassword`,
      {
        userId,
        newPassword: password,
      }
    );

    if (response.data && response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Password reset failed");
    }
  } catch (error) {
    console.log(
      "Error resetting password:",
      error.response?.data || error.message || error
    );
    throw error;
  }
};
export const getUserDetails = async (userId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/auth/user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.log("Error fetching user details:", error);
    throw error;
  }
};


// Create a single expense
export const createExpense = async (expenseData, file) => {
  try {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }

    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      formData.append("userId", userData.id);
    }

    Object.entries(expenseData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await axios.post(`${baseUrl}/users/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error creating expense:", error.response?.data || error.message);
    toast.error("Error creating expense, please try again.");
    throw error;
  }
};

// Create multiple expenses
export const createMultipleExpenses = async (expenses) => {
  try {
    const formData = new FormData();
    expenses.forEach((expense, index) => {
      const { file, ...rest } = expense;
      if (file) {
        formData.append(`file_${index}`, file);
      }
      formData.append("expenses", JSON.stringify(rest));
    });

    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${baseUrl}/users/multiCreate`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Expenses created successfully!");
    return response.data;
  } catch (error) {
    console.log("Error creating multiple expenses:", error.response?.data || error.message);
    toast.error("Error creating multiple expenses.");
    throw error;
  }
};

// Fetch all expenses
export const fetchAllExpenses = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${baseUrl}/users/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.expenses;
  } catch (error) {
    console.log("Error fetching expenses:", error.message);
    throw error;
  }
};

// Update expense
export const updateExpense = async (expenseId, formData) => {
  try {
    const response = await axios.put(
      `${baseUrl}/users/update/${expenseId}`,
      formData
    );
    toast.success("Expense Updated Successfully");
    return response.data;
  } catch (error) {
    console.log("Error updating expense:", error.message);
    toast.error("Error updating expense");
    throw error;
  }
};

// Delete expense
export const deleteExpense = async (expenseId) => {
  try {
    const response = await axios.delete(
      `${baseUrl}/users/delete/${expenseId}`
    );
    toast.success("Expense Deleted Successfully");
    return response.data;
  } catch (error) {
    console.log("Error deleting expense:", error.message);
    toast.error("Error deleting expense");
    throw error;
  }
};

// Delete multiple expenses
export const deleteMultipleExpenses = async (expenseIds) => {
  try {
    const response = await axios.post(
      `${baseUrl}/users/deleteMultipleExpenses`,
      { ids: expenseIds },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    console.log("Error deleting expenses:", error.message);
    toast.error("Failed to delete expenses");
    throw error;
  }
};

export const fetchExpenseById = async (expenseId) => {
  try {
    const response = await axios.get(
      `${baseUrl}/users/get/${expenseId}`
    );
    return response.data.expense;
  } catch (error) {
    console.log(
      "Error fetching expense:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};

// Fetch all reports
export const fetchAllReports = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${baseUrl}/users/allget`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Failed to fetch reports:", error);
    toast.error("Failed to fetch reports");
    throw error;
  }
};

// Fetch report details by ID
export const fetchReportDetails = async (reportId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${baseUrl}/users/getbyid/${reportId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Failed to fetch report details:", error);
    toast.error("Failed to fetch report details");
    throw error;
  }
};

// Add comment to report
export const addCommentToReport = async (reportId, comment, createdAt) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(
      `${baseUrl}/users/addcomment/${reportId}`,
      {
        comment,
        createdAt,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Failed to add comment:", error);
    toast.error("Failed to add comment");
    throw error;
  }
};

// Fetch due date reminders
export const fetchDueDateReminders = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.Email || !user.Phone) {
      throw new Error("User data is missing or incomplete in localStorage.");
    }

    const response = await axios.post(
      `${baseUrl}/users/DueDateReminderExpense`,
      { 
        email: user.Email, 
        phoneNumber: user.Phone 
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("Failed to fetch reminders:", error);
    throw error;
  }
};

// Fetch insights data
export const fetchInsightsData = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${baseUrl}/users/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.expenses;
  } catch (error) {
 
    throw error;
  }
};

// Fetch user profile
export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Auth token not found");

    const response = await axios.get(`${baseUrl}/auth/getUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching user data:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (formData) => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Auth token not found");

    const response = await axios.put(
      `${baseUrl}/auth/updateUserProfile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error updating profile:", error);
    throw error;
  }
};

// Fetch all expense rules
export const fetchAllRules = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${baseUrl}/users/getallrule`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error fetching rules:", error.response?.data || error.message);
    throw error;
  }
};

// Create expense rule
export const createRule = async (ruleData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.post(`${baseUrl}/users/createrule`, ruleData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Rule added successfully!");
    return response.data;
  } catch (error) {
    console.log("Error creating rule:", error.response?.data || error.message);
    toast.error("Failed to save the rule!");
    throw error;
  }
};

// Update expense rule
export const updateRule = async (ruleId, ruleData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.put(
      `${baseUrl}/users/updaterule/${ruleId}`,
      ruleData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success("Rule updated successfully!");
    return response.data;
  } catch (error) {
    console.log("Error updating rule:", error.response?.data || error.message);
    toast.error("Failed to update the rule!");
    throw error;
  }
};

// Delete expense rule
export const deleteRule = async (ruleId) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.delete(`${baseUrl}/users/deleterule/${ruleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Rule deleted successfully!");
    return response.data;
  } catch (error) {
    console.log("Error deleting rule:", error.response?.data || error.message);
    toast.error("Failed to delete the rule!");
    throw error;
  }
};

// Fetch sidebar user data
export const fetchSidebarUserData = async () => {
  try {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      throw new Error("Auth token not found");
    }


    const response = await axios.get(`${baseUrl}/auth/getUser`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.data || !response.data.user) {
      throw new Error("User data not found in response");
    }

    return {
      firstName: response.data.user.FirstName,
      lastName: response.data.user.LastName,
      photo: response.data.user.Photo || null,
    };
  } catch (error) {
    console.log("Error fetching user data:", error);
    throw error;
  }
};

