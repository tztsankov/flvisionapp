import React, { useState } from 'react';
import { Upload, X, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImageUploaderProps {
  onImageCapture: (base64Image: string) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageCapture, isLoading }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1]; // Премахване на префикса на URL данните
      setPreviewUrl(base64String);
      onImageCapture(base64Data);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreviewUrl(null);
  };

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {!previewUrl ? (
        <motion.div 
          className="border-2 border-dashed border-fl-gray-700 rounded-lg p-8 flex flex-col items-center justify-center bg-fl-black-900 bg-opacity-40 relative overflow-hidden"
          whileHover={{ scale: 1.01, borderColor: "#D7FB00" }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-fl-yellow opacity-5 rounded-full blur-2xl"></div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-fl-black-800 p-4 rounded-full mb-4 relative"
          >
            <motion.div 
              className="absolute inset-0 bg-fl-yellow opacity-10 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1] 
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <Camera className="h-10 w-10 text-fl-yellow relative z-10" />
          </motion.div>
          
          <p className="text-md text-white font-medium mb-2">Анализирайте вашата храна</p>
          <p className="text-sm text-fl-gray-400 mb-6 text-center max-w-xs">
            Качете снимка на храна за автоматичен анализ на калории и макронутриенти
          </p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="bg-gradient-to-r from-fl-yellow to-fl-yellow hover:to-yellow-300 text-fl-black font-medium py-2.5 px-6 rounded-full cursor-pointer shadow-lg flex items-center justify-center">
              <Upload className="h-4 w-4 mr-2" />
              Изберете изображение
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </label>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          className="relative rounded-lg overflow-hidden border border-fl-gray-800 shadow-xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <img 
            src={previewUrl} 
            alt="Преглед на храна" 
            className="w-full h-80 object-cover"
          />
          {!isLoading && (
            <motion.button 
              onClick={clearImage}
              className="absolute top-3 right-3 bg-fl-black bg-opacity-70 text-white p-2 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </motion.button>
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-fl-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg">
              <motion.div 
                className="h-16 w-16 border-4 border-fl-yellow border-opacity-30 border-t-fl-yellow rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-white mt-4 font-medium text-lg">Анализиране...</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ImageUploader;