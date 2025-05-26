import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingFooter() {
  return (
    <footer className="bg-[#071825] text-white py-10 px-6 md:px-20">
      {/* Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Features Section */}
        <div>
          <h3 className="font-bold text-[#37B5FF] mb-4">Features</h3>
          <ul className="space-y-2">
            {[
              "Expense Management",
              "Warrenty Trtacking",
              "Expense Reports",
              "Receipt Scanning App",
              "Invoicing",
            ].map((item) => (
              <li key={item}>
                <Link to="/" className="hover:text-[#37B5FF] transition">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources Section */}
        <div>
          <h3 className="font-bold text-[#37B5FF] mb-4">Resources</h3>
          <ul className="space-y-2">
            {["Terms & Condition", "Support", "Privacy Policy"].map(
              (item) => (
                <li key={item}>
                  <Link to="/privacy-policy" className="hover:text-[#37B5FF] transition">
                    {item}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Learn More Section */}
        <div>
          <h3 className="font-bold text-[#37B5FF] mb-4">Learn more</h3>
          <ul className="space-y-2">
            {["About Us", "Investor Relations"].map((item) => (
              <li key={item}>
                <Link to="#" className="hover:text-[#37B5FF] transition">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Get Started Section */}
        <div>
          <h3 className="font-bold text-[#37B5FF] mb-4">Get Started</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/register" className="hover:text-[#37B5FF] transition">
                Create a new account
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-[#37B5FF] transition">
                Log in
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer Text */}
      <div className="text-xs mt-10 text-center ">
        <p>
          The Voranty Visa® Commercial Card is issued by The Bancorp Bank, N.A., pursuant to a license from Visa 
          U.S.A. Inc. and may not be used at all merchants that accept Visa cards. Apple® and the Apple logo® are <br />
          trademarks of Apple Inc., registered in the U.S. and other countries. App Store is a service mark of Apple
          Inc. Google Play and the Google Play logo are trademarks of Google LLC.
        </p>
        <p>© 2024-2025 Voranty Pvt. Ltd. All Rights Reserved</p>
      </div>

      {/* Large Expensify Text */}
      <div className="text-[#37B5FF] text-4xl sm:text-6xl md:text-8xl font-bold mt-10 mb-[-24px] text-center ">
        VORANTY
      </div>
    </footer>
  );
} 