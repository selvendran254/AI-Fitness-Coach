import OpenAI from 'openai';
import { env } from '../config/env';
import { logger } from '../config/logger';
import type { UserSettings } from '@ai-fitness-coach/shared';

const openai = env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: env.OPENAI_API_KEY })
  : null;

const SYSTEM_PROMPT_BASE = `You are an expert AI fitness coach specializing in safe exercise and nutrition
for people with diabetes and hypertension. Always prioritize safety, gradual progression,
blood sugar awareness, and blood pressure management. Provide practical, culturally sensitive advice.
Respond in the user's preferred language when specified.`;

/**
 * Build personalized system prompt from user health context and settings.
 */
function buildSystemPrompt(settings?: Partial<UserSettings>, language?: string): string {
  let prompt = SYSTEM_PROMPT_BASE;

  if (language === 'ta') {
    prompt += '\nRespond primarily in Tamil (தமிழ்) unless the user writes in English.';
  }

  if (settings?.healthConditions?.length) {
    prompt += `\nUser health conditions: ${settings.healthConditions.join(', ')}.`;
  }
  if (settings?.insulinDependent) {
    prompt += '\nUser is insulin-dependent — emphasize glucose monitoring around exercise.';
  }
  if (settings?.avoidHighIntensityCardio) {
    prompt += '\nAvoid recommending high-intensity cardio; prefer moderate activity.';
  }
  if (settings?.maxDailySodiumMg) {
    prompt += `\nDaily sodium limit: ${settings.maxDailySodiumMg}mg.`;
  }
  if (settings?.maxCarbsPerMealG) {
    prompt += `\nMax carbs per meal: ${settings.maxCarbsPerMealG}g.`;
  }
  if (settings?.aiCoachTone) {
    prompt += `\nCommunication tone: ${settings.aiCoachTone}.`;
  }

  return prompt;
}

/**
 * Send a chat message to GPT-4o fitness coach.
 */
export async function chatWithCoach(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  settings?: Partial<UserSettings>,
  language?: string
): Promise<string> {
  if (!openai) {
    logger.warn('OpenAI not configured — returning mock response');
    return 'AI coach is not configured. Please set OPENAI_API_KEY in your environment.';
  }

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      { role: 'system', content: buildSystemPrompt(settings, language) },
      ...messages,
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  return response.choices[0]?.message?.content ?? 'No response generated.';
}

/**
 * Generate a personalized workout plan via GPT-4o.
 */
export async function generateWorkoutPlan(params: {
  fitnessLevel: string;
  healthConditions: string[];
  durationMinutes: number;
  equipment: string[];
  goals: string;
  language?: string;
  settings?: Partial<UserSettings>;
}): Promise<object> {
  if (!openai) {
    return getMockWorkoutPlan(params.durationMinutes);
  }

  const prompt = `Generate a safe workout plan as JSON with this structure:
{
  "title": string,
  "description": string,
  "durationMinutes": number,
  "intensity": "LOW"|"MODERATE"|"HIGH",
  "suitableForDiabetes": boolean,
  "suitableForHypertension": boolean,
  "exercises": [{ "name": string, "category": string, "sets": [{ "reps"?: number, "durationSeconds"?: number }] }]
}
Fitness level: ${params.fitnessLevel}
Health conditions: ${params.healthConditions.join(', ') || 'none'}
Duration: ${params.durationMinutes} minutes
Equipment: ${params.equipment.join(', ') || 'bodyweight only'}
Goals: ${params.goals}
Language for exercise names: ${params.language === 'ta' ? 'Tamil and English' : 'English'}`;

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      { role: 'system', content: buildSystemPrompt(params.settings, params.language) },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.6,
  });

  const content = response.choices[0]?.message?.content ?? '{}';
  return JSON.parse(content);
}

/**
 * Analyze food description or base64 image for calorie/macro estimation.
 */
export async function analyzeFood(input: {
  description?: string;
  imageBase64?: string;
  language?: string;
}): Promise<object> {
  if (!openai) {
    return {
      items: [{ name: 'Sample meal', quantity: '1 serving', macros: { calories: 400, proteinG: 20, carbsG: 45, fatG: 12 } }],
      totalMacros: { calories: 400, proteinG: 20, carbsG: 45, fatG: 12 },
      notes: 'Mock analysis — configure OPENAI_API_KEY for real results.',
    };
  }

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `${buildSystemPrompt(undefined, input.language)}
Return JSON: { "items": [{ "name", "quantity", "macros": { "calories", "proteinG", "carbsG", "fatG", "fiberG?", "sugarG?", "sodiumMg?" } }], "totalMacros": {...}, "diabeticNotes": string, "sodiumMg": number }`,
    },
  ];

  if (input.imageBase64) {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: input.description ?? 'Analyze this food photo for calories and macros.' },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${input.imageBase64}` } },
      ],
    });
  } else {
    messages.push({
      role: 'user',
      content: `Analyze this meal: ${input.description}`,
    });
  }

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages,
    response_format: { type: 'json_object' },
    max_tokens: 1200,
  });

  return JSON.parse(response.choices[0]?.message?.content ?? '{}');
}

/**
 * Generate a diabetic/BP-friendly meal plan.
 */
export async function generateMealPlan(params: {
  calorieTarget: number;
  healthConditions: string[];
  dietaryRestrictions: string[];
  days: number;
  language?: string;
}): Promise<object> {
  if (!openai) {
    return { title: 'Sample Meal Plan', days: [], diabeticFriendly: true, lowSodium: true };
  }

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      { role: 'system', content: buildSystemPrompt(undefined, params.language) },
      {
        role: 'user',
        content: `Generate a ${params.days}-day meal plan as JSON. Daily calories ~${params.calorieTarget}.
Conditions: ${params.healthConditions.join(', ')}. Restrictions: ${params.dietaryRestrictions.join(', ') || 'none'}.
Include breakfast, lunch, dinner, snack per day with macros.`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.6,
  });

  return JSON.parse(response.choices[0]?.message?.content ?? '{}');
}

function getMockWorkoutPlan(durationMinutes: number) {
  return {
    title: 'Gentle Health Walk & Stretch',
    description: 'Low-impact routine safe for diabetes and hypertension',
    durationMinutes,
    intensity: 'LOW',
    suitableForDiabetes: true,
    suitableForHypertension: true,
    exercises: [
      { name: 'Warm-up march', category: 'CARDIO', sets: [{ durationSeconds: 300 }] },
      { name: 'Brisk walk', category: 'CARDIO', sets: [{ durationSeconds: 1200 }] },
      { name: 'Standing stretches', category: 'FLEXIBILITY', sets: [{ durationSeconds: 300 }] },
    ],
  };
}
