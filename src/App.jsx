import React, { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./features/authSlice";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 font-bold text-indigo-900 text-xl"
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-5a1 1 0 00-.293-.707l-4-4A1 1 0 0016 4H3z" />
                </svg>
              </motion.div>
              <span className="hidden sm:block">BusBooking</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-indigo-100 rounded-full py-1 px-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-indigo-900">{user.name}</p>
                        <p className="text-xs text-indigo-600 capitalize">{role}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Logout
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      to="/login" 
                      className="text-indigo-900 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      to="/register" 
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Register
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-indigo-900 hover:text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-indigo-100"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {user ? (
                  <>
                    <div className="flex items-center px-3 py-2">
                      <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium mr-3">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-indigo-900">{user.name}</p>
                        <p className="text-xs text-indigo-600 capitalize">{role}</p>
                      </div>
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.div whileTap={{ scale: 0.95 }} className="block px-3 py-2 rounded-md text-base font-medium text-indigo-900 hover:bg-indigo-100">
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Login
                      </Link>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.95 }} className="block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                      <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        Register
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-indigo-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-5a1 1 0 00-.293-.707l-4-4A1 1 0 0016 4H3z" />
                </svg>
                <span className="text-xl font-bold">BusBooking</span>
              </div>
              <p className="text-indigo-200 mb-4 max-w-md">
                Your trusted partner for comfortable and reliable bus travel. Book your next journey with us and experience the difference.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-indigo-300 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-indigo-300 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-indigo-300 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-indigo-300 hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/buses" className="text-indigo-300 hover:text-white transition-colors">Browse Buses</Link>
                </li>
                <li>
                  <Link to="/about" className="text-indigo-300 hover:text-white transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-indigo-300 hover:text-white transition-colors">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-indigo-300">123 Bus Street, Transport City</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-indigo-300">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-indigo-300">support@busbooking.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-indigo-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-indigo-300 text-sm">© {new Date().getFullYear()} BusBooking. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-indigo-300 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-indigo-300 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-indigo-300 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;