export interface ExerciseVideo {
  id: string;
  name: string;
  nameTa: string;
  durationMin: number;
  safeForDiabetes: boolean;
  safeForBp: boolean;
  videoUrl: string;
  thumbnail: string;
}

/** Safe beginner exercises — use royalty-free sample URLs */
export const EXERCISE_VIDEOS: ExerciseVideo[] = [
  {
    id: 'walk',
    name: 'Brisk walking',
    nameTa: 'வேகமான நடை',
    durationMin: 15,
    safeForDiabetes: true,
    safeForBp: true,
    videoUrl: 'https://www.youtube.com/embed/nIjVuRTmPuc',
    thumbnail: '/devices/watch-sport.jpg',
  },
  {
    id: 'stretch',
    name: 'Gentle stretching',
    nameTa: 'மெதுவான நீட்சி',
    durationMin: 10,
    safeForDiabetes: true,
    safeForBp: true,
    videoUrl: 'https://www.youtube.com/embed/g_tea8ZNkv4',
    thumbnail: '/devices/watch-fitness.jpg',
  },
  {
    id: 'chair',
    name: 'Chair exercises',
    nameTa: 'நாற்காலி பயிற்சி',
    durationMin: 12,
    safeForDiabetes: true,
    safeForBp: true,
    videoUrl: 'https://www.youtube.com/embed/ODuZ46HDX1Y',
    thumbnail: '/devices/watch-garmin.jpg',
  },
];
