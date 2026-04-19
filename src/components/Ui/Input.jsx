import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaUser, FaCheck, FaSpinner, FaUserSecret } from 'react-icons/fa';
import { useToast } from './ToastProvider';

function Input({ name, setName, handleStartLogin }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState('name'); // 'name' or 'guest'
  const { showToast } = useToast();

  const validateName = (name) => {
    if (!name.trim()) {
      showToast('Please enter your name!', 'error');
      return false;
    }

    if (/[^\u0600-\u06FFa-zA-Z\s]/.test(name)) {
      showToast('Name can only contain Arabic or English letters and spaces!', 'error');
      return false;
    }

    if (name.trim().length < 3) {
      showToast('Name must be at least 3 characters long!', 'error');
      return false;
    }

    return true;
  };

  const isNameValid = (name) => {
    const trimmed = name.trim();
    return trimmed.length >= 3 && /^[\u0600-\u06FFa-zA-Z\s]+$/.test(trimmed);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Allow letters (English and Arabic), spaces, and some common characters
    if (/^[\u0600-\u06FFa-zA-Z\s]*$/.test(value)) {
      setName(value);
    }
    // If invalid characters are entered, don't update the state
  };

  const handleSubmit = () => {
    if (!validateName(name)) return; 

    setIsLoading(true);

    setTimeout(() => {
      showToast(`Welcome ${name.trim()}! Let's get productive!`, 'success');
      handleStartLogin();
      setIsLoading(false);
    }, 1200);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setName('Guest');
    showToast('Welcome Guest! You are now logged in.', 'success');
    setTimeout(() => {
      handleStartLogin();
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && loginMode === 'name') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-950 to-indigo-900 relative overflow-hidden px-4">

      {/* background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
        />

        <motion.div
          animate={{ rotate: [360, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* card */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative z-10 bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl w-full max-w-md border border-white/20"
      >

        {/* header */}
        <div className="text-center mb-8">
          <FaUser className="text-5xl text-purple-400 mx-auto mb-3" />
          <h1 className="text-white text-3xl font-bold">Welcome!</h1>
          <p className="text-gray-300 text-sm">Get started with TaskFlow</p>
        </div>

        {/* Login Mode Tabs */}
        <div className="flex gap-3 mb-6 bg-white/5 p-2 rounded-xl">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setLoginMode('name')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm md:text-base ${
              loginMode === 'name'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <FaUser className="text-lg" />
            Sign In
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setLoginMode('guest')}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 text-sm md:text-base ${
              loginMode === 'guest'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            <FaUserSecret className="text-lg" />
            Guest
          </motion.button>
        </div>

        {/* Name Input Mode */}
        {loginMode === 'name' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Enter your name..."
                value={name}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="w-full p-4 rounded-2xl bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:border-purple-400 text-sm md:text-base"
                disabled={isLoading}
              />

              {isNameValid(name) && (
                <FaCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400" />
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-75 text-sm md:text-base"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FaSpinner className="w-4 h-4" />
                  </motion.div>
                  Loading...
                </>
              ) : (
                <>
                  Start Journey
                  <FaRocket className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Guest Mode */}
        {loginMode === 'guest' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-2xl p-4 mb-6">
              <p className="text-gray-300 text-sm text-center">
                👋 Welcome as a <span className="font-bold text-purple-300">Guest</span>
              </p>
              <p className="text-gray-400 text-xs text-center mt-2">
                You can use all features without logging in
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-75 text-sm md:text-base"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <FaSpinner className="w-4 h-4" />
                  </motion.div>
                  Loading...
                </>
              ) : (
                <>
                  Continue as Guest
                  <FaRocket className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* footer */}
        <p className="text-center text-white/40 text-xs md:text-sm mt-6">
         Enjoy a unique experience ✨
        </p>
      </motion.div>
    </div>
  );
}

export default Input;