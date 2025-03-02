import React, { useState } from 'react';
import { Send, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';

interface FoodDescriptionFormProps {
  onSubmit: (description: string) => void;
  onCancel: () => void;
  onMisuse: () => void;
  isLoading: boolean;
}

const FoodDescriptionForm: React.FC<FoodDescriptionFormProps> = ({ 
  onSubmit, 
  onCancel, 
  onMisuse,
  isLoading 
}) => {
  const [description, setDescription] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length > 0) {
      // Simple client-side check for obviously non-food content
      const lowerText = description.toLowerCase();
      const obviousNonFoodKeywords = [
        'password', 'login', 'credit card', 'hacker', 'hack', 
        'exploit', 'porn', 'sex', 'adult', 'контрол', 'паролa',
        'admin', 'backdoor', 'script', 'инжекция'
      ];
      
      const containsNonFoodKeyword = obviousNonFoodKeywords.some(keyword => 
        lowerText.includes(keyword)
      );
      
      if (containsNonFoodKeyword) {
        onMisuse();
        return;
      }
      
      onSubmit(description);
    }
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="bg-fl-black-800 p-2 rounded-full mr-3">
            <Utensils className="h-5 w-5 text-fl-yellow" />
          </div>
          <h3 className="text-xl font-bold text-white">Опишете вашата храна</h3>
        </div>
        <p className="text-fl-gray-300 text-sm mb-4">
          Не успяхме да анализираме изображението. Моля, опишете подробно какво сте консумирали (порция, съставки, начин на приготвяне).
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Например: 200г пилешки гърди на скара, 150г кафяв ориз, 100г броколи на пара"
              className="w-full bg-fl-black-900 bg-opacity-50 border border-fl-gray-700 rounded-xl p-4 text-fl-black placeholder-fl-gray-500 focus:border-fl-yellow focus:ring-1 focus:ring-fl-yellow focus:outline-none min-h-[120px] resize-none"
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-fl-gray-400 mt-2">
            Колкото по-точно опишете храната, толкова по-прецизен ще бъде анализът.
          </p>
        </div>

        <div className="flex justify-between mt-6">
          <motion.button
            type="button"
            onClick={onCancel}
            className="text-fl-gray-400 hover:text-white px-4 py-2 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            Отказ
          </motion.button>
          <motion.button
            type="submit"
            className="bg-gradient-to-r from-fl-yellow to-fl-yellow hover:to-yellow-300 text-fl-black font-medium py-2.5 px-6 rounded-full shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(215, 251, 0, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading || description.trim().length === 0}
          >
            {isLoading ? (
              <>
                <motion.div 
                  className="h-4 w-4 border-2 border-fl-black border-opacity-30 border-t-fl-black rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Анализиране...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Анализирай
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default FoodDescriptionForm;