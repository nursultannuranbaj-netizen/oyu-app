import AsyncStorage from '@react-native-async-storage/async-storage';
import { freshProgress, type Progress } from './progress';

const KEY = 'oyu.progress.v1';

export async function loadProgress(): Promise<Progress> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) return { ...freshProgress(), ...JSON.parse(raw) };
  } catch {
    // corrupted or unavailable storage: start fresh
  }
  return freshProgress();
}

export async function saveProgress(p: Progress): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // keep going; progress stays in memory
  }
}
