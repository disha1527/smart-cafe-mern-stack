import { Link } from "react-router-dom";

function Hero() {
  return (
    <section
      className="h-screen bg-cover bg-center flex items-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1509042239860-f550ce710b93')",
      }}
    >
      <div className="ml-20 text-white">
        <h2 className="text-5xl font-bold mb-4">
          Welcome to Smart Cafe
        </h2>

        <p className="text-xl mb-6">
          Where every cup tells a story
        </p>

        <div className="space-x-4">
          <Link
            to="/menu"
            className="bg-orange-500 px-6 py-3 rounded-full text-white font-semibold"
          >
            View Menu
          </Link>

          <Link
            to="/booking"
            className="bg-white text-black px-6 py-3 rounded-full font-semibold"
          >
            Book a Table
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;