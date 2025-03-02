import React from 'react';
import { NutritionData } from '../types';
import { BarChart, Utensils, Calendar, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface NutritionSummaryProps {
  data: NutritionData[];
  onNewDay: () => void;
  lastReset: string | null;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ data, onNewDay, lastReset }) => {
  // Изчисляване на общите стойности за днес
  const today = new Date().toISOString().split('T')[0];
  const todayItems = data.filter(item => item.date.startsWith(today));
  
  const todayStats = todayItems.reduce(
    (acc, item) => {
      acc.calories += item.calories;
      acc.protein += item.protein;
      acc.carbs += item.carbs;
      acc.fat += item.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Изчисляване на процентите на макронутриентите
  const totalMacros = todayStats.protein + todayStats.carbs + todayStats.fat;
  const proteinPercentage = totalMacros > 0 ? Math.round((todayStats.protein / totalMacros) * 100) : 0;
  const carbsPercentage = totalMacros > 0 ? Math.round((todayStats.carbs / totalMacros) * 100) : 0;
  const fatPercentage = totalMacros > 0 ? Math.round((todayStats.fat / totalMacros) * 100) : 0;

  // Форматиране на датата на последно нулиране
  const formatLastReset = () => {
    if (!lastReset) return 'Никога';
    
    const date = new Date(lastReset);
    return date.toLocaleDateString('bg-BG', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '.');
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-fl-black to-fl-black-800 rounded-xl shadow-xl p-6 border border-fl-gray-800 relative overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-fl-yellow opacity-5 rounded-full blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-fl-yellow opacity-5 rounded-full blur-xl"></div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 relative z-10">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Award className="h-6 w-6 mr-2 text-fl-yellow" />
            <span>Дневна статистика</span>
          </h2>
          <p className="text-sm text-fl-gray-300 mt-1">Анализ на хранителните стойности</p>
        </div>
        <div className="flex items-center text-fl-gray-300 bg-fl-black-900 bg-opacity-60 py-2 px-4 rounded-full">
          <Utensils className="mr-2" size={18} />
          <span className="text-fl-gray-200 font-medium">{todayItems.length}</span>
          <span className="ml-1 mr-2">храни</span>
          <div className="w-1 h-1 bg-fl-gray-600 rounded-full mx-2"></div>
          <Calendar className="mr-2" size={16} />
          <span className="text-xs">{new Date().toLocaleDateString('bg-BG').replace(/\//g, '.')}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div 
          className="bg-fl-black-900 bg-opacity-50 rounded-xl p-4 border border-fl-gray-800"
          whileHover={{ scale: 1.03, borderColor: "#D7FB00" }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm font-medium text-fl-gray-300 mb-1">Калории</p>
          <p className="text-3xl font-bold text-white">{todayStats.calories}</p>
          <div className="mt-2 bg-fl-gray-800 bg-opacity-40 h-1 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(todayStats.calories / 25, 100)}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-fl-black-900 bg-opacity-50 rounded-xl p-4 border border-fl-gray-800"
          whileHover={{ scale: 1.03, borderColor: "#D7FB00" }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm font-medium text-fl-gray-300 mb-1">Протеин</p>
          <p className="text-3xl font-bold text-fl-yellow">{todayStats.protein}г</p>
          <div className="mt-2 bg-fl-gray-800 bg-opacity-40 h-1 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-fl-yellow"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(todayStats.protein * 3, 100)}%` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-fl-black-900 bg-opacity-50 rounded-xl p-4 border border-fl-gray-800"
          whileHover={{ scale: 1.03, borderColor: "#D7FB00" }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm font-medium text-fl-gray-300 mb-1">Въглехидрати</p>
          <p className="text-3xl font-bold text-fl-yellow">{todayStats.carbs}г</p>
          <div className="mt-2 bg-fl-gray-800 bg-opacity-40 h-1 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-fl-yellow opacity-70"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(todayStats.carbs * 3, 100)}%` }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-fl-black-900 bg-opacity-50 rounded-xl p-4 border border-fl-gray-800"
          whileHover={{ scale: 1.03, borderColor: "#D7FB00" }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm font-medium text-fl-gray-300 mb-1">Мазнини</p>
          <p className="text-3xl font-bold text-fl-yellow">{todayStats.fat}г</p>
          <div className="mt-2 bg-fl-gray-800 bg-opacity-40 h-1 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-fl-yellow opacity-40"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(todayStats.fat * 3, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </motion.div>
      </div>

      <div className="mb-4 flex items-center">
        <BarChart size={20} className="mr-3 text-fl-yellow" />
        <h3 className="text-lg font-semibold text-white">Съотношение на макронутриенти</h3>
      </div>

      <div className="w-full h-8 bg-fl-black-900 bg-opacity-50 rounded-lg overflow-hidden mb-3 relative">
        <motion.div 
          className="flex h-full"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            className="bg-gradient-to-r from-fl-yellow to-fl-yellow h-full flex items-center justify-center text-xs font-medium text-fl-black px-2" 
            style={{ width: `${proteinPercentage}%` }}
            title={`Протеин: ${proteinPercentage}%`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {proteinPercentage > 10 && `${proteinPercentage}%`}
          </motion.div>
          <motion.div 
            className="bg-gradient-to-r from-fl-yellow to-fl-yellow bg-opacity-70 h-full flex items-center justify-center text-xs font-medium text-fl-black px-2" 
            style={{ width: `${carbsPercentage}%`, opacity: 0.7 }}
            title={`Въглехидрати: ${carbsPercentage}%`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {carbsPercentage > 10 && `${carbsPercentage}%`}
          </motion.div>
          <motion.div 
            className="bg-gradient-to-r from-fl-yellow to-fl-yellow bg-opacity-40 h-full flex items-center justify-center text-xs font-medium text-fl-black px-2" 
            style={{ width: `${fatPercentage}%`, opacity: 0.4 }}
            title={`Мазнини: ${fatPercentage}%`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {fatPercentage > 10 && `${fatPercentage}%`}
          </motion.div>
        </motion.div>
      </div>
      
      <div className="flex flex-wrap justify-between text-xs mb-8 text-fl-gray-300">
        <div className="flex items-center mr-4 mb-2">
          <div className="w-3 h-3 bg-fl-yellow rounded-full mr-2"></div>
          <span>Протеин {proteinPercentage}%</span>
        </div>
        <div className="flex items-center mr-4 mb-2">
          <div className="w-3 h-3 bg-fl-yellow bg-opacity-70 rounded-full mr-2"></div>
          <span>Въглехидрати {carbsPercentage}%</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 bg-fl-yellow bg-opacity-40 rounded-full mr-2"></div>
          <span>Мазнини {fatPercentage}%</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center border-t border-fl-gray-800 pt-5">
        <div className="text-xs text-fl-gray-400 mb-4 sm:mb-0">
          <p className="flex items-center">
            <Calendar size={14} className="mr-2" />
            Последно нулиране: <span className="text-fl-gray-300 ml-1">{formatLastReset()}</span>
          </p>
        </div>
        <motion.button
          onClick={onNewDay}
          className="bg-gradient-to-r from-fl-yellow to-fl-yellow hover:from-fl-yellow hover:to-yellow-300 text-fl-black font-medium py-2.5 px-6 rounded-full shadow-lg transition-colors flex items-center"
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(215, 251, 0, 0.2)" }}
          whileTap={{ scale: 0.95 }}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Нов Ден
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NutritionSummary;