import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Camera, Plus, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import NutritionCard from './components/NutritionCard';
import NutritionSummary from './components/NutritionSummary';
import ResetConfirmation from './components/ResetConfirmation';
import FoodDescriptionForm from './components/FoodDescriptionForm';
import MisuseWarning from './components/MisuseWarning';
import { analyzeImage, analyzeTextDescription, checkIsFoodRelated } from './utils/openai';
import { 
  saveNutritionData, 
  getNutritionData, 
  deleteNutritionData,
  resetDailyData,
  getLastResetDate,
  checkAndResetAtMidnight
} from './utils/storage';
import { NutritionData, NutritionAnalysis } from './types';

function App() {
  const [nutritionItems, setNutritionItems] = useState<NutritionData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [lastResetDate, setLastResetDate] = useState<string | null>(null);
  const [showTextForm, setShowTextForm] = useState(false);
  const [showMisuseWarning, setShowMisuseWarning] = useState(false);

  useEffect(() => {
    // Проверка дали API ключът е зададен
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      setApiKeyMissing(true);
    }
    
    // Зареждане на запазените данни за храненето
    const savedData = getNutritionData();
    setNutritionItems(savedData);
    
    // Зареждане на датата на последно нулиране
    const lastReset = getLastResetDate();
    setLastResetDate(lastReset);
    
    // Проверка за автоматично нулиране в полунощ
    const wasReset = checkAndResetAtMidnight();
    if (wasReset) {
      setNutritionItems(getNutritionData());
      setLastResetDate(getLastResetDate());
    }
  }, []);

  const handleImageCapture = async (base64Image: string) => {
    setCurrentImage(base64Image);
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const nutritionData = await analyzeImage(base64Image);
      
      // Създаване на нов елемент за хранене
      const newItem: NutritionData = {
        id: uuidv4(),
        name: nutritionData.name,
        calories: nutritionData.calories,
        protein: nutritionData.protein,
        carbs: nutritionData.carbs,
        fat: nutritionData.fat,
        imageUrl: `data:image/jpeg;base64,${base64Image}`,
        date: new Date().toISOString()
      };
      
      // Запазване в локалното хранилище и актуализиране на състоянието
      saveNutritionData(newItem);
      setNutritionItems(prev => [newItem, ...prev]);
      
      // Нулиране на UI
      setShowUploader(false);
      setCurrentImage(null);
    } catch (err) {
      console.error('Грешка при анализиране на изображението:', err);
      setError('Неуспешен анализ на изображението. Моля, опитайте отново или опишете храната с текст.');
      setShowTextForm(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextDescription = async (description: string) => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Проверка дали текстът е свързан с храна
      const isFoodRelated = await checkIsFoodRelated(description);
      
      if (!isFoodRelated) {
        setShowMisuseWarning(true);
        setShowTextForm(false);
        return;
      }
      
      const nutritionData = await analyzeTextDescription(description);
      
      // Създаване на нов елемент за хранене
      const newItem: NutritionData = {
        id: uuidv4(),
        name: nutritionData.name,
        calories: nutritionData.calories,
        protein: nutritionData.protein,
        carbs: nutritionData.carbs,
        fat: nutritionData.fat,
        // Без imageUrl при текстово описание
        date: new Date().toISOString()
      };
      
      // Запазване в локалното хранилище и актуализиране на състоянието
      saveNutritionData(newItem);
      setNutritionItems(prev => [newItem, ...prev]);
      
      // Нулиране на UI
      setShowUploader(false);
      setShowTextForm(false);
      setCurrentImage(null);
    } catch (err) {
      console.error('Грешка при анализиране на текстовото описание:', err);
      setError('Неуспешен анализ на текстовото описание. Моля, опитайте отново с по-подробно описание.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCancelTextForm = () => {
    setShowTextForm(false);
    setError(null);
  };
  
  const handleMisuse = () => {
    setShowMisuseWarning(true);
    setShowTextForm(false);
  };
  
  const handleReturnFromMisuse = () => {
    setShowMisuseWarning(false);
    setShowUploader(false);
  };

  const handleDeleteItem = (id: string) => {
    deleteNutritionData(id);
    setNutritionItems(prev => prev.filter(item => item.id !== id));
  };
  
  const handleNewDay = () => {
    resetDailyData();
    setNutritionItems(getNutritionData());
    setLastResetDate(getLastResetDate());
    setShowResetConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-fl-gray-900 to-fl-black text-white">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-fl-yellow opacity-[0.03] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-fl-yellow opacity-[0.03] rounded-full blur-3xl"></div>
      </div>
      
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 py-8 pb-24 max-w-5xl relative z-10">
        {apiKeyMissing ? (
          <motion.div 
            className="bg-gradient-to-r from-fl-black to-fl-black-800 border-l-4 border-fl-yellow p-5 mb-8 rounded-r-xl shadow-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-fl-yellow mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold mb-1">Липсва OpenAI API ключ</p>
                <p className="text-sm text-fl-gray-300">
                  Моля, добавете вашия OpenAI API ключ към .env файла като VITE_OPENAI_API_KEY, за да активирате анализа на изображения.
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
        
        {nutritionItems.length > 0 && !showMisuseWarning && (
          <section className="mb-8">
            <NutritionSummary 
              data={nutritionItems} 
              onNewDay={handleNewDay}
              lastReset={lastResetDate}
            />
          </section>
        )}
        
        <AnimatePresence mode="wait">
          {showMisuseWarning ? (
            <MisuseWarning onReturn={handleReturnFromMisuse} />
          ) : showUploader && !showTextForm ? (
            <motion.section 
              className="bg-gradient-to-br from-fl-black to-fl-black-800 rounded-xl shadow-xl p-6 mb-8 border border-fl-gray-800 relative overflow-hidden"
              key="uploader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-fl-yellow opacity-5 rounded-full blur-xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-fl-yellow opacity-5 rounded-full blur-xl"></div>
              
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Camera className="h-6 w-6 mr-2 text-fl-yellow" />
                Анализирайте снимка на храна
              </h2>
              
              <ImageUploader onImageCapture={handleImageCapture} isLoading={isAnalyzing} />
              
              {error && !showTextForm && (
                <motion.div 
                  className="mt-6 p-4 bg-red-900 bg-opacity-30 text-red-200 rounded-xl border border-red-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    {error}
                  </p>
                </motion.div>
              )}
              
              <div className="mt-6 flex justify-end">
                <motion.button 
                  onClick={() => setShowUploader(false)}
                  className="text-fl-gray-400 hover:text-white mr-3 px-4 py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Отказ
                </motion.button>
              </div>
            </motion.section>
          ) : showTextForm ? (
            <motion.section 
              className="bg-gradient-to-br from-fl-black to-fl-black-800 rounded-xl shadow-xl p-6 mb-8 border border-fl-gray-800 relative overflow-hidden"
              key="text-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-fl-yellow opacity-5 rounded-full blur-xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-fl-yellow opacity-5 rounded-full blur-xl"></div>
              
              <FoodDescriptionForm 
                onSubmit={handleTextDescription} 
                onCancel={handleCancelTextForm}
                onMisuse={handleMisuse}
                isLoading={isAnalyzing}
              />
              
              {error && (
                <motion.div 
                  className="mt-6 p-4 bg-red-900 bg-opacity-30 text-red-200 rounded-xl border border-red-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    {error}
                  </p>
                </motion.div>
              )}
            </motion.section>
          ) : (
            <></>
          )}
        </AnimatePresence>

        {/* Plus button - moved outside AnimatePresence and positioned with higher z-index */}
        {!showUploader && !showTextForm && !showMisuseWarning && (
          <motion.button 
            onClick={() => setShowUploader(true)}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-fl-yellow to-fl-yellow hover:to-yellow-300 text-fl-black rounded-full p-4 shadow-xl flex items-center justify-center transition-all z-50"
            whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(215, 251, 0, 0.3)" }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Plus className="h-6 w-6" />
          </motion.button>
        )}
        
        {nutritionItems.length === 0 && !showUploader && !showTextForm && !showMisuseWarning ? (
          <motion.div 
            className="text-center py-20 bg-gradient-to-br from-fl-black to-fl-black-800 rounded-xl shadow-xl border border-fl-gray-800 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-fl-yellow opacity-5 rounded-full blur-xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-fl-yellow opacity-5 rounded-full blur-xl"></div>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-fl-black-900 bg-opacity-40 w-20 h-20 flex items-center justify-center rounded-full mx-auto mb-6"
            >
              <Camera className="h-10 w-10 text-fl-yellow" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-3">Все още няма данни за храненето</h2>
            <p className="text-fl-gray-300 mb-8 max-w-md mx-auto">Качете снимка на храна, за да започнете да проследявате храненето си</p>
            <motion.button 
              onClick={() => setShowUploader(true)}
              className="bg-gradient-to-r from-fl-yellow to-fl-yellow hover:to-yellow-300 text-fl-black font-medium py-3 px-8 rounded-full shadow-xl transition-all inline-flex items-center"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(215, 251, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="h-5 w-5 mr-2" />
              Добавете храна
            </motion.button>
          </motion.div>
        ) : (
          !showMisuseWarning && (
            <motion.section 
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {nutritionItems.map((item) => (
                <NutritionCard 
                  key={item.id} 
                  item={item} 
                  onDelete={handleDeleteItem} 
                />
              ))}
            </motion.section>
          )
        )}
      </main>
      
      <ResetConfirmation 
        visible={showResetConfirmation} 
        onClose={() => setShowResetConfirmation(false)} 
      />
    </div>
  );
}

export default App;