/**
 * Convert kilograms to pounds.
 */
export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

/**
 * Convert pounds to kilograms.
 */
export function lbsToKg(lbs: number): number {
  return Math.round((lbs / 2.20462) * 10) / 10;
}

/**
 * Calculate BMI from weight (kg) and height (cm).
 */
export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Convert centimeters to feet/inches display string.
 */
export function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
}

/**
 * Convert mg/dL glucose to mmol/L.
 */
export function glucoseMgDlToMmol(mgDl: number): number {
  return Math.round((mgDl / 18.0182) * 10) / 10;
}
