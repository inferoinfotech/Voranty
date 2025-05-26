import React from 'react';
// import expensesImage from "../../assets/images/background/expenses.svg";
import expensesImage from "../../assets/images/background/reminder.png";


const NoContent = () => {
  return (
    <div className="flex flex-col mt-24 text-center">
      <div >
        <img
          src={expensesImage}
          alt="No expenses"
          className="mx-auto w-64 h-64 object-contain"
        />
      </div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">
        No matching content found!
      </h1>
      <p className="text-gray-600 text-lg">
        Try adjusting your filters or clear them to see all expenses.
      </p>
    </div>
  );
};

export default NoContent; 