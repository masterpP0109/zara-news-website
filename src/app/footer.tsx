import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white text-[#183354] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
          {/* Logo and Description Section */}
          <div className="md:col-span-1">
            <div className="w-20 h-20 mb-4">
              <Image src="/images/logo.png.png" alt="Zaira Logo" width={80} height={80} className="w-full h-full object-contain" />
            </div>
            <p className="text-[#183354] text-[12px] leading-relaxed">
              Browned butter and brown sugar <br />
              caramelly goodness, crispy edges
              <br />
              thick and soft centers and melty
              <br /> little puddles of chocolate
            </p>
          </div>

          {/* Company Section */}
          <div className="md:col-span-1">
            <h1 className="text-[#183354] font-semibold mb-4 text-sm">Company</h1>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  The Test Kitchen
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Podcast
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Events
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Jobs
                </a>
              </li>
            </ul>
          </div>

          {/* Get Help Section */}
          <div className="md:col-span-1">
            <h1 className="text-[#183354] font-semibold mb-4 text-sm">Get Help</h1>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Contact & Faq
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Orders & Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Gift Cards
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Register
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Catalog
                </a>
              </li>
            </ul>
          </div>

          {/* Explore Section */}
          <div className="md:col-span-1">
            <h1 className="text-[#183354] font-semibold mb-4 text-sm">Explore</h1>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  The Shop
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Recipes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Food
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Travel
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Hotline
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div className="md:col-span-1">
            <h1 className="text-[#183354] font-semibold mb-4 text-sm">Follow Us On</h1>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Youtube
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-800 transition-colors">
                  Pinterest
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
      
      </div>
        <div className="max-w-[95vw] mx-auto border-t border-gray-300 mt-8 px-4 sm:px-6 md:px-8 lg:px-[6em] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <a href="#" className="text-[#183354] hover:text-blue-600 transition-colors text-sm">Privacy Policy & Terms</a>
            <a href="#" className="text-[#183354] hover:text-blue-600 transition-colors text-sm">Site Guide</a>
          </div>
          <p className="text-[#183354] text-sm">© 2024 All Rights Reserved</p>
        </div>
    </footer>
  );
};

export default Footer;
