import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Coffee, Clock, Users, Award } from "lucide-react";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleProtectedNavigation = (path) => {
    if (!user) {
      navigate("/register");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="mt-20 font-sans bg-[#F8F5F2] text-ce">
      {/* ================= PROFESSIONAL HERO ================= */}
      <section
        className="relative min-h-screen flex items-center justify-center text-center px-6 text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#3B1F0E]/75 to-[#8B4513]/70"></div>

        {/* Content */}
        <div className="relative max-w-4xl mx-auto">
          <p className="mb-4 text-sm tracking-widest uppercase text-yellow-400">
            Premium Coffee Experience
          </p>

          <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-6">
            Discover Art of <br /> Perfect Coffee.
          </h1>

          <p className="max-w-2xl mx-auto text-gray-200 mb-10 leading-relaxed">
            Experience the difference as we meticulously select and roast the
            finest beans to create a truly unforgettable cup of coffee. Join us
            on a journey of taste and awaken your senses.
          </p>

          <div className="flex justify-center gap-6 mb-14">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-full font-semibold shadow-lg transition duration-300 hover:scale-105">
              Table Booking
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-12 text-lg">
            <div>
              <h3 className="text-3xl font-bold text-yellow-400">50+</h3>
              <p className="text-gray-300">Items of Coffee</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-yellow-400">25+</h3>
              <p className="text-gray-300">Orders Running</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-yellow-400">100+</h3>
              <p className="text-gray-300">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}

      <section className="relative bg-gradient-to-r from-[#D6CCC2] to-[#EDE0D4] py-20 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 items-center">
          {/* IMAGES */}
          <div className="flex justify-center md:justify-start">
            <div className="flex gap-6">
              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-6">
                <img
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
                  alt="coffee"
                  className="w-40 md:w-56 h-48 md:h-64 object-cover rounded-xl shadow-xl 
            hover:scale-105 transition duration-500"
                />

                <img
                  src="https://images.unsplash.com/photo-1511920170033-f8396924c348"
                  alt="latte"
                  className="w-40 md:w-56 h-48 md:h-64 object-cover rounded-xl shadow-xl 
            hover:scale-105 transition duration-500"
                />
              </div>

              {/* RIGHT IMAGE */}
              <img
                src="https://images.unsplash.com/photo-1544145945-f90425340c7e"
                alt="dessert"
                className="w-44 md:w-64 h-60 md:h-80 object-cover rounded-xl shadow-xl 
          mt-10 md:mt-16 hover:scale-105 transition duration-500"
              />
            </div>
          </div>

          {/* ABOUT CONTENT */}
          <div
            className="bg-white/95 backdrop-blur-md p-8 md:p-12 rounded-xl 
    shadow-2xl border-l-4 border-[#7B3F00]"
          >
            <p className="text-[#7B3F00] text-sm font-semibold uppercase tracking-widest mb-2">
              Welcome
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              About Our Smart Cafe
            </h2>

            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Welcome to our Smart Cafe, where technology meets taste. We serve
              freshly brewed coffee and delicious dishes in a warm and modern
              atmosphere designed for comfort and convenience.
            </p>

            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Our digital ordering system allows customers to browse the menu,
              order instantly, and enjoy a smooth cafe experience without
              waiting.
            </p>

            <button
              className="bg-[#7B3F00] text-white px-6 py-3 rounded-full
      shadow-md hover:bg-[#5a2e00] hover:scale-105 transition duration-300"
            >
              Explore Menu
            </button>
          </div>
        </div>

        {/* Decorative Beans */}
        <img
          src="https://pngimg.com/uploads/coffee_beans/coffee_beans_PNG9298.png"
          className="hidden md:block absolute top-20 left-20 w-14 opacity-60 rotate-12"
        />

        <img
          src="https://pngimg.com/uploads/coffee_beans/coffee_beans_PNG9298.png"
          className="hidden md:block absolute bottom-20 right-20 w-16 opacity-60 -rotate-12"
        />
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="bg-[#F3ECE3] py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-4xl font-bold text-[#7B3F00] mb-4">
            Why Choose Smart Cafe?
          </h2>

          <p className="text-lg text-[#C05600] mb-14">
            Experience the perfect blend of quality, ambiance, and service
          </p>

          {/* Cards */}
          <div className="grid md:grid-cols-4 gap-10">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F6E3C5] flex items-center justify-center">
                <Coffee size={28} className="text-[#C05600]" />
              </div>
              <h3 className="text-xl font-semibold text-[#7B3F00] mb-3">
                Premium Coffee
              </h3>
              <p className="text-gray-600">
                Sourced from the finest beans around the world
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F6E3C5] flex items-center justify-center">
                <Clock size={28} className="text-[#C05600]" />
              </div>
              <h3 className="text-xl font-semibold text-[#7B3F00] mb-3">
                Quick Service
              </h3>
              <p className="text-gray-600">
                Fast and friendly service without compromise
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F6E3C5] flex items-center justify-center">
                <Users size={28} className="text-[#C05600]" />
              </div>
              <h3 className="text-xl font-semibold text-[#7B3F00] mb-3">
                Cozy Atmosphere
              </h3>
              <p className="text-gray-600">
                Perfect space for work, meetings, or relaxation
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#F6E3C5] flex items-center justify-center">
                <Award size={28} className="text-[#C05600]" />
              </div>
              <h3 className="text-xl font-semibold text-[#7B3F00] mb-3">
                Award Winning
              </h3>
              <p className="text-gray-600">
                Recognized for excellence in quality and service
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
