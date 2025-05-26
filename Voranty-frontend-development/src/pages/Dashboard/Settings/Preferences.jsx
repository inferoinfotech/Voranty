import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const Preferences = () => {
  const { toggleSidebar } = useOutletContext();
  // State for managing selected time zone
  const [selectedTimeZone, setSelectedTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone // Default to user's current timezone
  );
  const [isAutoTimeZone, setIsAutoTimeZone] = useState(false); // Checkbox state
  
  const timeZones = [
    "Africa/Abidjan",
    "Africa/Accra",
    "Africa/Addis_Ababa",
    "Africa/Algiers",
    "Africa/Asmara",
    "Africa/Bamako",
    "Africa/Bangui",
    "Africa/Banjul",
    "Africa/Bissau",
    "Africa/Blantyre",
    "Africa/Brazzaville",
    "Africa/Bujumbura",
    "Africa/Cairo",
    "Africa/Casablanca",
    "Africa/Ceuta",
    "Africa/Conakry",
    "Africa/Dakar",
    "Africa/Dar_es_Salaam",
    "Africa/Djibouti",
    "Africa/Douala",
    "Africa/El_Aaiun",
    "Africa/Freetown",
    "Africa/Gaborone",
    "Africa/Harare",
    "Africa/Johannesburg",
    "Africa/Juba",
    "Africa/Kampala",
    "Africa/Khartoum",
    "Africa/Kigali",
    "Africa/Kinshasa",
    "Africa/Lagos",
    "Africa/Libreville",
    "Africa/Lome",
    "Africa/Luanda",
    "Africa/Lubumbashi",
    "Africa/Lusaka",
    "Africa/Malabo",
    "Africa/Maputo",
    "Africa/Maseru",
    "Africa/Mbabane",
    "Africa/Mogadishu",
    "Africa/Monrovia",
    "Africa/Nairobi",
    "Africa/Ndjamena",
    "Africa/Niamey",
    "Africa/Nouakchott",
    "Africa/Ouagadougou",
    "Africa/Porto-Novo",
    "Africa/Sao_Tome",
    "Africa/Tripoli",
  ];

  const handleTimeZoneChange = (event) => {
    setSelectedTimeZone(event.target.value);
  };

  const handleAutoTimeZoneChange = (event) => {
    setIsAutoTimeZone(event.target.checked);
    if (event.target.checked) {
      setSelectedTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }
  };

  

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#fffaf3]">
        {/* Header Section */}
        <div className="shadow-md p-4 flex justify-between items-center fixed top-0  w-full z-40 bg-white">
          {/* Sidebar Toggle Button for Small Screens */}
          <button
            onClick={toggleSidebar}
            className="xl:hidden text-[#0B2838] text-2xl p-2 hover:bg-gray-100 rounded"
          >
            <FaBars />
          </button>
          <h1 className="text-xl md:text-3xl font-bold text-[#0B2838]">
            Preferences
          </h1>
        </div>

        {/* Preference Section Start */}
        <div className="mt-16 p-2">
       
          <div className="  md:max-w-3xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl mx-auto mt-10 text-[#002e22]">
            {/* CSV Export Formats Start */}
            <div className="shadow-md rounded-xl">  
            <div className="py-5 px-6 rounded-xl bg-white">
              <h1 className="font-bold text-xl xl:text-2xl text-[#002e22] pb-4  ">
                CSV Export Formats
              </h1>
              <div className="grid grid-cols-2 mt-2 border-b-2">
                <div>
                  <h3 className="font-bold text-[#002e22] py-3">Name</h3>
                </div>
                <div>
                  <h3 className="font-bold text-[#002e22] py-3">Format</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b-2 hover:bg-[#faf8f5]">
                <div>
                  <h3 className="font-semibold text-[#002e22] py-5 text-md lg:text-lg">
                    Default CSV
                  </h3>
                </div>
                <div>
                  <h3 className="font-semibold text-[#002e22] py-5 text-md lg:text-lg">CSV</h3>
                </div>
              </div>
            </div>
            </div>

            {/* Time Zone Section Start */}
            <div className="py-5 px-6 rounded-xl bg-white shadow-md mt-8 mb-8">
              <h1 className="font-bold text-xl xl:text-2xl text-[#002e22] pb-4">
                Time Zone
              </h1>
              <div className="grid grid-cols-1 mt-2 border-b-2 py-3">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isAutoTimeZone}
                      onChange={handleAutoTimeZoneChange}
                      className="mr-2"
                    />
                    <span className="font-semibold text-md lg:text-lg">
                      Set my time zone automatically
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <select
                  value={selectedTimeZone}
                  onChange={handleTimeZoneChange}
                  disabled={isAutoTimeZone}
                  className=" w-full  lg:max-w-lg lg:max-h-11  p-3 border border-gray-300 text-[#002e22]  font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b2838be] bg-white"
                >
                  {timeZones.map((timeZone) => (
                    <option
                      key={timeZone}
                      value={timeZone}
                      className="text-[#002e22] font-semibold "
                    >
                      {timeZone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Preferences Start */}
            <div className="py-5 px-6 rounded-xl bg-white shadow-md mb-8">
              <h1 className="font-bold text-xl xl:text-2xl text-[#002e22] pb-4">
                Contact Preferences
              </h1>
              <p className="font-semibold text-md lg:text-lg py-2">
                Yes, contact me with:
              </p>
              <div className="font-semibold text-md lg:text-lg mt-2 md:mt-0 pb-2">
                <input type="checkbox" />
                <span className="ps-2">
                  Outstanding report tasks or status updates (such as when my
                  reports are rejected){" "}
                </span>
              </div>

              <div className="font-semibold text-md lg:text-lg mt-3 md:mt-0 pb-2">
                <input type="checkbox" />
                <span className="ps-2">
                  {" "}
                  Relevant feature updates, Expensify news, and account check
                  ins{" "}
                </span>
              </div>
            </div>

            {/* SmartScanning Section Start */}
            <div className="py-5 px-6 rounded-xl bg-white shadow-md mb-8">
              <h1 className="font-bold text-xl xl:text-2xl text-[#002e22] pb-4">
                SmartScanning
              </h1>
              <p className="font-semibold text-md lg:text-lg py-2">
                Manual entry? Forget it! SmartScan analyzes your receipts and
                automatically creates an expense with the date, merchant, and
                amount. If you've already imported your credit or bank card into
                your account, SmartScan will auto-match the receipt with the
                associated expense, meaning no extra work for you.{" "}
                <span className="text-blue-800 font-semibold">
                  Learn More...
                </span>
              </p>
              <p className="font-semibold text-md lg:text-lg py-4 md:py-2">
                If enabled, incoming receipts will be SmartScanned on upload.
              </p>
            </div>

            {/* SmartScan Status Section Start*/}
            <div className="py-5 px-6 rounded-xl bg-white shadow-md mb-8">
              <h1 className="font-bold text-xl xl:text-2xl text-[#002e22] pb-4">
                SmartScan Status
              </h1>

              <div className="flex  mt-3">
                
                <div className="font-semibold text-md lg:text-lg pt-1">
                 <span className="bg-yellow-300 ps-2 pe-1 text-center rounded-full me-2"> ! </span> Your account is currently limited to 25 free SmartScans each
                  month.
                </div>
              </div>
              <p className="font-semibold text-md lg:text-lg  py-4 md:py-3">
                Free SmartScans remaining: 25
              </p>
            </div>
          </div>
     
        </div>
      </div>
    </>
  );
};

export default Preferences;
