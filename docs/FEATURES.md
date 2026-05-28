# All 27 features — implementation status

| # | Feature | Status |
|---|---------|--------|
| 1 | Real dashboard data | `GET /api/v1/dashboard/summary` + DashboardPage |
| 2 | Medicine reminders | Settings schedule + `POST /medications/check-reminders` |
| 3 | Glucose & BP log | `VitalsLogForm` + progress API + alerts |
| 4 | Meal photo AI | FoodPhotoScan saves meal after analyze |
| 5 | Tamil voice coach | `useVoiceCoach` mic + TTS on CoachPage |
| 6 | Challenges API | POST create/join/progress on `/challenges` |
| 7 | Push notifications | `POST /notifications/push-subscribe` + `usePushNotifications` |
| 8 | Android TWA stub | `android/README.md` |
| 9 | QR pair | `POST /pairing/qr` + QrPairingCard |
| 10 | OAuth wizard | OAuthSetupWizard on Devices page |
| 11 | Auto sync | `useAutoDeviceSync` hook |
| 12 | Health alerts | `evaluateHealthAlerts` on vitals save |
| 13 | Safe exercise | `POST /workouts/safety-check` before generate |
| 14 | Doctor PDF | `GET /reports/doctor` + Progress export |
| 15 | Caregiver view | `/caregiver` page + invite API |
| 16 | Weekly AI summary | `POST /ai/weekly-summary` |
| 17 | Meal calendar | MealCalendar component |
| 18 | Offline queue | `offlineQueue.ts` + flush on reconnect |
| 19 | Quick toggles | QuickToggleBar in layout |
| 20 | Onboarding | `/onboarding` wizard + guard |
| 21 | Streaks & badges | `GET /streaks` + StreakBadges |
| 22 | Tamil quotes | `getDailyQuote` on dashboard |
| 23 | Exercise videos | ExerciseVideos + YouTube embeds |
| 24 | Deploy configs | Dockerfile, vercel.json, railway.toml |
| 25 | Email auth | verify + forgot/reset password routes |
| 26 | 2FA | TOTP setup/enable/login routes |
| 27 | CI tests | `.github/workflows/ci.yml` |
