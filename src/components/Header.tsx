import React from 'react';
import { Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  return (
    <motion.header 
      className="bg-gradient-to-r from-fl-black to-fl-black-800 text-white py-6 px-6 shadow-lg border-b border-fl-gray-800"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-2 md:mb-0">
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative"
          >
            <motion.div 
              className="absolute inset-0 bg-fl-yellow rounded-full blur-md opacity-30"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3] 
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <Eye className="h-10 w-10 mr-4 text-fl-yellow relative z-10" />
          </motion.div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              <span className="text-white">FL</span>
              <span className="text-fl-yellow"> Vision</span>
            </h1>
            <p className="text-xs md:text-sm text-fl-gray-300 tracking-wide">Бъдещето на здравословното проследяване</p>
          </div>
        </div>
        <motion.div 
          className="hidden md:flex items-center bg-fl-black-800 px-4 py-2 rounded-full border border-fl-gray-800"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-2 h-2 bg-fl-yellow rounded-full mr-2 animate-pulse"></div>
          <p className="text-sm font-medium text-fl-gray-200">Премиум статистика и анализ</p>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;