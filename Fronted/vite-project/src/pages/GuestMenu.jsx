


// import { useNavigate } from "react-router-dom";

// function GuestMenu() {

//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#F5ECE3] px-6">

//       <div className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-md w-full">

//         {/* Title */}
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//           Smart Cafe Menu
//         </h1>

//         <p className="text-gray-500 mb-6">
//           Scan the QR code to explore our menu and place your order ☕
//         </p>

//         {/* QR Code */}
//         <div className="flex justify-center mb-6">
//           <img
//             src="/qr.png"
//             alt="QR Code"
//             className="w-48 h-48 border rounded-xl p-2"
//           />
//         </div>

//         {/* Button */}
//         <button
//           onClick={() => navigate("/register")}
//           className="bg-[#7B3F00] text-white px-6 py-3 rounded-full 
//           hover:bg-[#5a2e00] transition w-full"
//         >
//           Continue to Order
//         </button>

//         {/* Login Link */}
//         <p className="mt-4 text-sm">
//           Already registered?{" "}
//           <span
//             onClick={() => navigate("/login")}
//             className="text-[#7B3F00] font-semibold cursor-pointer"
//           >
//             Login
//           </span>
//         </p>

//       </div>

//     </div>
//   );
// }

// export default GuestMenu;



import { useNavigate } from "react-router-dom";

function GuestMenu() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1509042239860-f550ce710b93')] bg-cover bg-center flex items-center justify-center">

      {/* overlay */}
      <div className="bg-black/60 absolute inset-0"></div>

      <div className="relative bg-white/95 backdrop-blur-md shadow-2xl rounded-3xl p-10 text-center max-w-md w-full">

        {/* Logo / Title */}
        <h1 className="text-4xl font-bold text-[#7B3F00] mb-2">
          ☕ Smart Cafe
        </h1>

        <p className="text-gray-600 mb-6">
          Welcome to our digital menu.  
          Scan the QR code and start ordering instantly.
        </p>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="border-4 border-[#7B3F00] rounded-2xl p-3">
            <img
              src="/new.png"
              alt="QR Code"
              className="w-44 h-44"
            />
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => navigate("/register")}
          className="bg-[#7B3F00] text-white px-6 py-3 rounded-full w-full 
          hover:bg-[#5a2e00] transition duration-300 font-semibold shadow-md"
        >
          Start Ordering
        </button>

        {/* Login */}
        <p className="mt-5 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#7B3F00] font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>

    </div>
  );
}

export default GuestMenu;