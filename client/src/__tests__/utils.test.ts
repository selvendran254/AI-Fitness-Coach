import { describe, it, expect } from 'vitest';
import { calculateBmi } from '@ai-fitness-coach/shared';

describe('shared utils', () => {
  it('calculates BMI correctly', () => {
    expect(calculateBmi(70, 175)).toBe(22.9);
  });
});
