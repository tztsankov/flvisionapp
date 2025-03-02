import React from 'react';
import { ShieldAlert, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import flvisionImage from '../flvision.png';

interface MisuseWarningProps {
  onReturn: () => void;
}

const MisuseWarning: React.FC<MisuseWarningProps> = ({ onReturn }) => {
  return (
    <motion.div
      className="w-full bg-gradient-to-br from-fl-black to-fl-black-800 rounded-xl shadow-xl p-6 md:p-10 border border-fl-gray-800 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500 opacity-5 rounded-full blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-500 opacity-5 rounded-full blur-xl"></div>
      
      <div className="flex flex-col items-center text-center">
        <motion.div 
          className="w-full max-w-md mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src={flvisionImage} 
            alt="FL Vision Logo" 
            className="w-full h-auto rounded-xl shadow-lg border border-fl-gray-800"
          />
        </motion.div>
        
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
          className="bg-red-500 bg-opacity-10 p-5 rounded-full mb-6"
        >
          <ShieldAlert className="h-12 w-12 text-red-500" />
        </motion.div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Моля, използвайте приложението само по предназначение
        </h2>
        
        <p className="text-fl-gray-300 mb-8 max-w-2xl">
          FL Vision е проектиран за анализ на храна и хранителни стойности. 
          Моля, описвайте само храни, които сте консумирали или планирате да консумирате.
        </p>
        
        <motion.button
          onClick={onReturn}
          className="bg-gradient-to-r from-fl-yellow to-fl-yellow hover:to-yellow-300 text-fl-black font-medium py-3 px-8 rounded-full shadow-xl inline-flex items-center"
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(215, 251, 0, 0.2)" }}
          whileTap={{ scale: 0.95 }}
        >
          <Home className="h-5 w-5 mr-2" />
          Обратно към приложението
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MisuseWarning;