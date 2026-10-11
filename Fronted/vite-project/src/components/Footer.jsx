import React from 'react'
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <div>
            <footer className="bg-[#2b1d16] text-gray-300 pt-16 pb-6 mt-2">

                <div className="max-w-7xl mx-auto px-10 grid md:grid-cols-4 gap-10">

                    {/* ABOUT CAFE */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Smart Cafe
                        </h2>

                        <p className="text-sm leading-relaxed">
                            Experience the perfect blend of taste and technology.
                            Our Smart Cafe offers fresh coffee, delicious meals,
                            and seamless digital ordering for a modern dining experience.
                        </p>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Quick Links
                        </h3>

                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-white cursor-pointer"><Link to="/">Home</Link></li>
                            <li className="hover:text-white cursor-pointer"><Link to="/about">About</Link></li>
                            <li className="hover:text-white cursor-pointer"><Link to="/menu">Menu</Link></li>
                            <li className="hover:text-white cursor-pointer"><Link to="/booking">Table Booking</Link></li>
                            <li className="hover:text-white cursor-pointer"><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Contact
                        </h3>

                        <ul className="space-y-2 text-sm">
                            <li>📍 Ahmedabad, Gujarat</li>
                            <li>📞 +91 98765 43210</li>
                            <li>📧 smartcafe@email.com</li>
                        </ul>
                    </div>

                    {/* OPENING HOURS */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Opening Hours
                        </h3>

                        <ul className="space-y-2 text-sm">
                            <li>Mon - Fri : 9 AM - 10 PM</li>
                            <li>Saturday : 10 AM - 11 PM</li>
                            <li>Sunday : 10 AM - 9 PM</li>
                        </ul>
                    </div>

                </div>

                {/* SOCIAL + COPYRIGHT */}
                <div className="border-t border-gray-700 mt-10 pt-6">

                    <div className="max-w-7xl mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-4">

                        {/* SOCIAL ICONS */}
                        <div className="flex gap-4">

                            <div className="bg-[#3b2a21] p-3 rounded-full hover:bg-[#7B3F00] cursor-pointer transition">
                                <FaFacebookF />
                            </div>

                            <div className="bg-[#3b2a21] p-3 rounded-full hover:bg-[#7B3F00] cursor-pointer transition">
                                <FaInstagram />
                            </div>

                            <div className="bg-[#3b2a21] p-3 rounded-full hover:bg-[#7B3F00] cursor-pointer transition">
                                <FaTwitter />
                            </div>

                        </div>

                        {/* COPYRIGHT */}
                        <p className="text-sm text-gray-400">
                            © 2026 Smart Cafe. All Rights Reserved.
                        </p>

                    </div>

                </div>

            </footer>
        </div>
    )
}

export default Footer