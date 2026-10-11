import { FaCoffee, FaHeart, FaAward, FaStar } from "react-icons/fa";
function About() {
  return (
    <div className="mt-20 bg-[#F3EDE4] text-[#3F3F46]">

      {/* HERO SECTION */}

      <div
        className="h-[400px] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black/50 w-full h-full flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold mb-3">About Smart Cafe</h1>
          <p className="text-lg text-yellow-300">
            Your perfect coffee destination
          </p>
        </div>
      </div>

      {/* OUR STORY */}

      <div className="max-w-4xl mx-auto text-center py-16 px-6">

        <h2 className="text-3xl font-bold text-[#8B4513] mb-6">
          Our Story
        </h2>

        <p className="text-gray-600 leading-7">
          Founded in 2015, Smart Cafe began as a small neighborhood coffee
          shop with a big dream: to create a space where quality coffee meets
          exceptional service. Today we are proud to be a gathering place for
          coffee lovers, remote workers, and friends catching up.
        </p>

      </div>

      {/* FEATURES */}

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 px-6 pb-16">

  <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition">

    <FaCoffee className="text-4xl text-orange-500 mx-auto mb-4" />

    <h3 className="font-bold text-lg text-[#8B4513]">
      Quality First
    </h3>

    <p className="text-sm text-gray-600 mt-2">
      Finest coffee beans and premium ingredients.
    </p>

  </div>


  <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition">

    <FaHeart className="text-4xl text-orange-500 mx-auto mb-4" />

    <h3 className="font-bold text-lg text-[#8B4513]">
      Made with Love
    </h3>

    <p className="text-sm text-gray-600 mt-2">
      Every drink crafted with passion and care.
    </p>

  </div>


  <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition">

    <FaAward className="text-4xl text-orange-500 mx-auto mb-4" />

    <h3 className="font-bold text-lg text-[#8B4513]">
      Award Winning
    </h3>

    <p className="text-sm text-gray-600 mt-2">
      Recognized for excellence and service.
    </p>

  </div>


  <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-xl transition">

    <FaStar className="text-4xl text-orange-500 mx-auto mb-4" />

    <h3 className="font-bold text-lg text-[#8B4513]">
      Fresh Daily
    </h3>

    <p className="text-sm text-gray-600 mt-2">
      Fresh food and bakery items everyday.
    </p>

  </div>

</div>

      {/* CAFE GALLERY */}

      <div className="max-w-6xl mx-auto px-6 pb-20">

        <h2 className="text-3xl font-bold text-center text-[#8B4513] mb-10">
          Our Cafe
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <img
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93"
            className="rounded-xl shadow hover:scale-105 transition"
          />

          <img
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348"
            className="rounded-xl shadow hover:scale-105 transition"
          />

          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
            className="rounded-xl shadow hover:scale-105 transition"
          />

          <img
            src="https://images.unsplash.com/photo-1481833761820-0509d3217039"
            className="rounded-xl shadow hover:scale-105 transition"
          />

          <img
            src="https://images.unsplash.com/photo-1565958011703-44f9829ba187"
            className="rounded-xl shadow hover:scale-105 transition"
          />

          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb"
            className="rounded-xl shadow hover:scale-105 transition"
          />

        </div>

      </div>

    
    

    </div>
  );
}

export default About;