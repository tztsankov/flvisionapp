import React from 'react';
import { CheckCircle, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResetConfirmationProps {
  visible: boolean;
  onClose: () => void;
}

const ResetConfirmation: React.FC<ResetConfirmationProps> = ({ visible, onClose }) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-fl-black bg-opacity-80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="bg-gradient-to-b from-fl-black-800 to-fl-black p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-fl-gray-800 relative overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-fl-yellow opacity-5 rounded-full blur-xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-fl-yellow opacity-5 rounded-full blur-xl"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="flex items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="bg-fl-yellow bg-opacity-10 p-3 rounded-full mr-4"
                >
                  <CheckCircle className="h-8 w-8 text-fl-yellow" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Успешно нулиране</h3>
                  <p className="text-fl-gray-300 text-sm">Готови сте за нов ден!</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-fl-gray-400 hover:text-white p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="bg-fl-black-900 bg-opacity-50 rounded-xl p-4 mb-6 border border-fl-gray-800">
              <p className="text-fl-gray-200">
                Всички хранителни стойности за деня бяха успешно нулирани. Започнете нов ден с чисто проследяване.
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-fl-gray-400 text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{new Date().toLocaleDateString('bg-BG').replace(/\//g, '.')}</span>
              </div>
              <motion.button
                onClick={onClose}
                className="bg-gradient-to-r from-fl-yellow to-fl-yellow hover:to-yellow-300 text-fl-black font-medium py-2.5 px-6 rounded-full"
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(215, 251, 0, 0.15)" }}
                whileTap={{ scale: 0.95 }}
              >
                Разбрах
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResetConfirmation;