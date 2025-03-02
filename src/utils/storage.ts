import { NutritionData } from '../types';

const STORAGE_KEY = 'fl-vision-nutrition-data';
const DAILY_RESET_KEY = 'fl-vision-last-reset';

export const saveNutritionData = (data: NutritionData): void => {
  const existingData = getNutritionData();
  const updatedData = [data, ...existingData];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
};

export const getNutritionData = (): NutritionData[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const deleteNutritionData = (id: string): void => {
  const existingData = getNutritionData();
  const updatedData = existingData.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
};

export const clearAllNutritionData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const resetDailyData = (): void => {
  // Запазваме само данните, които не са от днес
  const today = new Date().toISOString().split('T')[0];
  const allData = getNutritionData();
  const oldData = allData.filter(item => !item.date.startsWith(today));
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(oldData));
  localStorage.setItem(DAILY_RESET_KEY, new Date().toISOString());
  
  return oldData;
};

export const getLastResetDate = (): string | null => {
  return localStorage.getItem(DAILY_RESET_KEY);
};

// Проверка дали е необходимо автоматично нулиране в полунощ
export const checkAndResetAtMidnight = (): boolean => {
  const lastReset = getLastResetDate();
  if (!lastReset) return false;
  
  const lastResetDate = new Date(lastReset);
  const now = new Date();
  
  // Ако последното нулиране е било вчера или по-рано
  if (lastResetDate.toDateString() !== now.toDateString()) {
    resetDailyData();
    return true;
  }
  
  return false;
};