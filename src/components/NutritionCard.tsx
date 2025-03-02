import React from 'react';
import { Trash2, Clock } from 'lucide-react';
import { NutritionData } from '../types';
import { motion } from 'framer-motion';

interface NutritionCardProps {
  item: NutritionData;
  onDelete: (id: string) => void;
}

const NutritionCard: React.FC<NutritionCardProps> = ({ item, onDelete }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bg-BG', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '.');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    onDelete(item.id);
  };

  return (
    <motion.div 
      className="bg-gradient-to-br from-fl-black to-fl-black-800 rounded-xl shadow-xl overflow-hidden border border-fl-gray-800 relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button 
          onClick={handleDelete}
          className="bg-fl-black bg-opacity-70 p-2 rounded-full text-fl-gray-400 hover:text-fl-yellow transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={16} />
        </motion.button>
      </div>
      
      {item.imageUrl && (
        <div className="h-56 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-fl-black to-transparent opacity-60 z-10"></div>
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
          />
          <div className="absolute bottom-4 left-4 z-20">
            <h3 className="text-xl font-bold text-white drop-shadow-md">{item.name}</h3>
            <div className="flex items-center text-xs text-fl-gray-300 mt-1">
              <Clock size={12} className="mr-1" />
              <p>{formatDate(item.date)}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-5 text-white">
        {!item.imageUrl && (
          <>
            <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
            <p className="text-xs text-fl-gray-400 mb-3">{formatDate(item.date)}</p>
          </>
        )}
        
        <div className="grid grid-cols-4 gap-2 mt-2">
          <div className="rounded-lg p-3 bg-fl-black-900 bg-opacity-40">
            <p className="text-xs font-medium text-fl-gray-300 mb-1">Калории</p>
            <p className="text-lg font-bold text-white">{item.calories}</p>
          </div>
          <div className="rounded-lg p-3 bg-fl-black-900 bg-opacity-40">
            <p className="text-xs font-medium text-fl-gray-300 mb-1">Протеин</p>
            <p className="text-lg font-bold text-fl-yellow">{item.protein}г</p>
          </div>
          <div className="rounded-lg p-3 bg-fl-black-900 bg-opacity-40">
            <p className="text-xs font-medium text-fl-gray-300 mb-1">Въгл.</p>
            <p className="text-lg font-bold text-fl-yellow">{item.carbs}г</p>
          </div>
          <div className="rounded-lg p-3 bg-fl-black-900 bg-opacity-40">
            <p className="text-xs font-medium text-fl-gray-300 mb-1">Мазнини</p>
            <p className="text-lg font-bold text-fl-yellow">{item.fat}г</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NutritionCard;