import { useEffect } from 'react';
import { useUserSettings } from '@/hooks/useUserSettings';

/**
 * Apply visual settings (font size, contrast, motion) to document root.
 */
export function useApplySettings() {
  const settings = useUserSettings();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('large-text', settings.largeText);
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('reduce-motion', settings.reducedMotion);
    root.classList.toggle('dyslexia-font', settings.dyslexiaFriendlyFont);
    root.classList.toggle('compact-mode', settings.compactMode);
    root.dataset.fontSize = settings.fontSize;
    root.dataset.colorBlind = settings.colorBlindMode;
  }, [settings]);
}
