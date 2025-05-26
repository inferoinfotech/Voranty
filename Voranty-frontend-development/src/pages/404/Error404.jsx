import React from 'react';
import { Link } from 'react-router-dom';

const Error404 = () => {
    return (
        <section className="page_404 font-serif min-h-screen flex items-center justify-center bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center">
                    {/* Image Section */}
                    <div
                        className="bg-cover bg-center w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl  h-80 sm:h-60 md:h-80 lg:h-96 mx-auto"
                        style={{
                            backgroundImage: "url('https://cdn.dribbble.com/users/722246/screenshots/3066818/404-page.gif')",
                        }}
                    ></div>

                    {/* Text Section */}
                    <div className="mt-8">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-sans mb-4 text-[#0B2838]">
                            Looks like you're lost
                        </h3>
                        <p className="text-sm sm:text-base md:text-2xl mb-6 text-gray-600">
                            The page you are looking for is not available!
                        </p>
                        <Link
                            to="/login"
                            className="bg-[#0B2838] text-white px-6 py-2  font-sans rounded hover:bg-[#08212D] transition duration-300 text-sm sm:text-base"
                        >
                            Go to Home
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Error404;
