import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/Loader/Loader";
import { fetchUserProfile, updateUserProfile } from "@/Service/Api/api";
import { MdLogout } from "react-icons/md";

export const AccountDetails = () => {
  const { toggleSidebar } = useOutletContext();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [photo, setPhoto] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserProfile();
        setFormData({
          firstName: data.user.FirstName || "",
          lastName: data.user.LastName || "",
          phone: data.user.Phone || "",
          email: data.user.Email || "",
        });
        setPhoto(data.user.Photo || null);
      } catch (error) {
        console.log("Error fetching user data:", error);
        toast.error("Failed to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
    }
  };

  const handleEditClick = async () => {
    if (isEditable) {
      try {
        const updatedFormData = new FormData();
        updatedFormData.append("FirstName", formData.firstName);
        updatedFormData.append("LastName", formData.lastName);
        updatedFormData.append("Phone", formData.phone);
        if (photo) updatedFormData.append("Photo", photo);

        setIsLoading(true);
        const data = await updateUserProfile(updatedFormData);

        setFormData({
          firstName: data.user.FirstName,
          lastName: data.user.LastName,
          phone: data.user.Phone,
        });
        setPhoto(data.user.Photo);
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.log("Error updating profile:", error);
        toast.error("Failed to update profile");
      } finally {
        setIsLoading(false);
      }
    }
    setIsEditable(!isEditable);
    setTimeout(() => setUpdateMessage(""), 3000);
  };

  const handleSignOut = () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        console.error("No auth token found.");
        return;
      }

      // Directly remove the auth token and user data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      toast.success("Logged out successfully!");
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during sign out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-[#fffaf3]">
        <div className=" shadow-md p-4 flex justify-between items-center fixed top-0  w-full z-40 bg-white">
          <button
            onClick={toggleSidebar}
            className="xl:hidden text-[#0B2838] text-2xl p-2 hover:bg-gray-100 rounded"
          >
            <FaBars />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-[#0B2838]">
            Account Details
          </h1>
        </div>

        <div className="mt-32">
          <h1 className="text-center text-xl md:text-2xl font-bold text-[#0b2838]">
            Your Profile
          </h1>
          {updateMessage && (
            <p className="text-center text-green-600 font-semibold mt-2">
              {updateMessage}
            </p>
          )}
        </div>
        <div className="flex justify-center items-start h-full">
          {isLoading ? (
            <div >
              <Loader />
            </div>
          ) : (
            <div className="bg-white  p-6 rounded-2xl shadow-[0_10px_20px_rgba(0,_0,_0,_0.2)] mt-4 mx-4 w-full md:max-w-xl lg:max-w-4xl max-w-3xl flex flex-col lg:flex-row" >

              <div className="flex flex-col items-center lg:w-1/3 p-4">
                <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden flex justify-center items-center border border-gray-300">
                  {photo ? (
                    <img
                      src={
                        typeof photo === "string" ? photo : URL.createObjectURL(photo)
                      }
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <p className="text-gray-500">No Image</p>
                  )}
                </div>
                {isEditable && (
                  <>
                    <input
                      type="file"
                      id="profileImage"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <button
                      className="mt-4 px-4 py-2 bg-gray-200 text-dark font-bold rounded shadow hover:bg-gray-300"
                      onClick={() => document.getElementById("profileImage").click()}
                    >
                      {photo ? "Update Profile" : "Add Photo"}
                    </button>
                  </>
                )}
              </div>
              <div className="lg:w-2/3 p-4">
                <form className="grid grid-cols-1 gap-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex flex-col">
                    <label
                      htmlFor="firstName"
                      className="text-sm text-gray-700 font-bold"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditable}
                      className="mt-1 p-2 border font-medium border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0b2838be]"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="lastName"
                      className="text-sm text-gray-700 font-bold"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditable}
                      className="mt-1 p-2 border font-medium border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0b2838be]"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="text-sm text-gray-700 font-bold"
                    >
                      Phone
                    </label>
                    <input
                      type="number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditable}
                      className="mt-1 p-2 border font-medium border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0b2838be]"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="text-sm text-gray-700 font-bold"
                    >
                      E-mail
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="mt-1 p-2 border font-medium border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#0b2838be]"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-6">
                    <button
                      type="button"
                      onClick={handleEditClick}
                      className="px-4 py-3 bg-gradient-to-r from-[#0B2838] to-[#1a4459] 
      hover:from-[#1a4459] hover:to-[#0B2838] transition-all duration-300 
      ease-in-out transform hover:scale-[1.02] text-white rounded font-bold shadow"
                    >
                      {isEditable ? "Update" : "Edit Profile"}
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white 
      font-bold rounded shadow-md transition-all duration-300 ease-in-out transform 
      hover:scale-[1.05] active:scale-95"
                    >
                      <MdLogout className="text-xl" />
                      Log Out
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        <ToastContainer />
      </div>
    </>
  );
};

export default AccountDetails;
