import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white text-[#183354] ">
      <div className="flex items-center max-w-6xl mx-auto px-4 justify-between  ">
          <div
          className="flex items-center w-full mx-auto px-4 justify-between  "
          >
        <div>
          <div className="w-20 h-20 items-center">
            <Image src="/images/logo.png.png" alt="Zaira Logo" width={80} height={80} className="w-full h-full object-contain" />
          </div>

          <p className="text-[#183354] text-[12px] text-wrap">
            Browned butter and brown sugar <br />
            caramelly goodness, crispy edges
            <br />
            thick and soft centers and melty
            <br /> little puddles of chocolate
          </p>
        </div>

        <div>
          <div>
            <h1>Company</h1>
            <span>
              {/*  <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our team</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul> */}
            </span>
          </div>
          <ul className="space-y-2 text-sm text-blue/70">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                The Test Kitchen
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Podcast
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Events
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Events
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Jobs
              </a>
            </li>
          </ul>
        </div>

        <div>
          <div>
            <h1>Get Help</h1>
            <span>
              {/*  <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our team</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul> */}
            </span>
          </div>
          <ul className="space-y-2 text-sm text-blue/70">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Contact & Faq
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Oders & Returns
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Gift Cards
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Register
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Catalog
              </a>
            </li>
          </ul>
        </div>

          <div>
          <div>
            <h1>Explore</h1>
            <span>
              {/*  <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our team</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul> */}
            </span>
          </div>
          <ul className="space-y-2 text-sm text-blue/70">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                The Shop
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Recipes
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Food
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Travel
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Hotline
              </a>
            </li>
          </ul>
        </div>

         <div>
          <div>
            <h1>Follow Us On</h1>
            <span>
              {/*  <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our team</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul> */}
            </span>
          </div>
          <ul className="space-y-2 text-sm text-blue/70">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Facebook
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Instagram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Youtube
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Pinteerest
              </a>
            </li>
          </ul>
        </div>

      

      

        </div>
       
      </div>
       <div className="border-t border-gray-500 mt-8 pt-8 flex flex-col md:flex-row justify-center items-center">
         <div className="flex items-center gap-4">
           <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy & Terms</a>
           <a href="#" className="hover:text-gray-600 transition-colors">Site Guide</a>
         </div>
         <p>© 2024 All Rights Reserved</p>
       </div>
    </footer>
  );
};

export default Footer;
