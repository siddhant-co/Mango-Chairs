"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CircleUserRound, ShoppingBag, Menu, X } from "lucide-react";
import fetchData from "@/api/fetchdata";

interface NavItem {
  pk: number;
  name: string;
  link: string;
}

interface Category {
  id: number;
  title: string;
  image: string;
}

interface NavbarProps {
  headerEndpoint: string;
  categoryEndpoint: string;
}

const Navbar: React.FC<NavbarProps> = ({
  headerEndpoint,
  categoryEndpoint,
}) => {
  const [navData, setNavData] = useState<NavItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const headerResponse = await fetchData(headerEndpoint);
        setNavData(headerResponse?.headers || []);
      } catch (error) {
        console.error("Error fetching nav:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoryResponse = await fetchData(categoryEndpoint);
        setCategories(categoryResponse?.product_categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchNav();
    fetchCategories();
  }, [headerEndpoint, categoryEndpoint]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderCategoryDropdown = () => (
    <div className="absolute left-1/2 top-full transform -translate-x-1/2 mt-4 z-50 w-[90vw] max-w-5xl bg-white shadow-lg p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
      {categories.map((cat) => {
        const imageSrc = cat.image.startsWith("/")
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${cat.image}`
          : cat.image;
        return (
          <Link
            key={cat.id}
            href={`/category/${cat.id}`}
            className="flex items-center gap-4 hover:text-orange-500"
          >
            <div className="w-16 h-16 relative">
              <Image
                src={imageSrc}
                alt={cat.title}
                fill
                className="rounded-md object-cover"
              />
            </div>
            <p className="text-sm font-semibold">{cat.title}</p>
          </Link>
        );
      })}
    </div>
  );

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/30 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      {/* Mobile and Tablet Top Bar */}
      <div className="flex lg:hidden justify-between items-center px-2 py-3">
        <Link href="/">
          <Image src="/MangoLogo.webp" alt="Logo" width={100} height={30} />
        </Link>
        <div className="flex items-center gap-3 ml-auto mr-2">
          <CircleUserRound className="text-black w-5 h-5" />
          <ShoppingBag className="text-black w-5 h-5" />
          {isMobileMenuOpen ? (
            <X
              className="text-black w-6 h-6 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          ) : (
            <Menu
              className="text-black w-6 h-6 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Mobile and Tablet Search Bar */}
      <div className="lg:hidden px-4 mb-3 flex justify-center">
        <div className="relative w-[90%] max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-full w-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden lg:flex justify-between items-center p-4 md:px-8">
        <Link href="/">
          <Image src="/MangoLogo.webp" alt="Logo" width={160} height={40} />
        </Link>

        <div className="flex gap-10 items-center">
          {navData.map((item, index) => (
            <div key={item.pk} className="relative group">
              <Link
                href={item.link}
                className={`flex items-center hover:text-orange-500 font-medium ${
                  isScrolled ? "text-black" : "text-white"
                }`}
              >
                {item.name}
                {index === 1 && (
                  <span className="ml-2 mt-1 text-sm flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-chevron-down"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                )}
              </Link>

              {index === 1 && categories.length > 0 && renderCategoryDropdown()}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="relative w-52">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className={`w-5 h-5 transition-colors duration-300 ${
                  isScrolled ? "text-gray-600" : "text-white"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              className={`pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 text-sm w-full transition-all duration-300 ${
                isScrolled
                  ? "bg-white border border-gray-300 text-gray-800 placeholder-gray-500 focus:ring-gray-400"
                  : "bg-transparent border border-white text-white placeholder-white focus:ring-white"
              }`}
            />
          </div>

          <CircleUserRound
            className={`transition-colors duration-300 ${
              isScrolled ? "text-gray-800" : "text-white"
            }`}
          />
          <ShoppingBag
            className={`transition-colors duration-300 ${
              isScrolled ? "text-gray-800" : "text-white"
            }`}
          />
        </div>
      </div>

      {/* Mobile Menu Links */}
      {isMobileMenuOpen && (
        <div className="lg:hidden px-4 pb-4">
          <ul className="flex flex-col gap-3 text-sm">
            {navData.map((item) => (
              <li key={item.pk}>
                <Link
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
