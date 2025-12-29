import React from "react";

const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-5">
      
      {/* Icon */}
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Icon className="w-5 h-5 text-gray-400" />
      </div>

      {/* Input */}
      <input
        {...props}
        className="
          w-full 
          pl-10 pr-4 py-3
          rounded-xl
          border border-gray-200
          bg-white
          text-gray-800
          placeholder-gray-400
          shadow-sm
          focus:outline-none 
          focus:ring-2 focus:ring-indigo-300
          transition
        "
      />
    </div>
  );
};

export default Input;
