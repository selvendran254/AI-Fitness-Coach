import type { UserSettings } from '@ai-fitness-coach/shared';
import { SettingSelect } from '../SettingSelect';
import { SettingRow } from '../SettingRow';
import { SettingsSection } from '../SettingsSection';

type Props = { settings: UserSettings; update: <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => void };

export function AiCoachSettings({ settings, update }: Props) {
  return (
    <SettingsSection title="AI Fitness Coach" description="Customize GPT-4o coaching behavior">
      <SettingSelect label="Coach tone" value={settings.aiCoachTone} options={[{ value: 'friendly', label: 'Friendly' }, { value: 'motivational', label: 'Motivational' }, { value: 'clinical', label: 'Clinical' }, { value: 'strict', label: 'Strict' }, { value: 'empathetic', label: 'Empathetic' }]} onValueChange={(v) => update('aiCoachTone', v as UserSettings['aiCoachTone'])} />
      <SettingSelect label="Response language" value={settings.aiCoachLanguage} options={[{ value: 'en', label: 'English' }, { value: 'ta', label: 'Tamil (தமிழ்)' }]} onValueChange={(v) => update('aiCoachLanguage', v as 'en' | 'ta')} />
      <SettingSelect label="Suggestion frequency" value={settings.aiSuggestionFrequency} options={[{ value: 'minimal', label: 'Minimal' }, { value: 'normal', label: 'Normal' }, { value: 'frequent', label: 'Frequent' }]} onValueChange={(v) => update('aiSuggestionFrequency', v as UserSettings['aiSuggestionFrequency'])} />
      <SettingRow label="Include health context" description="Share diabetes/BP data with AI" checked={settings.includeHealthContextInAi} onCheckedChange={(v) => update('includeHealthContextInAi', v)} />
      <SettingRow label="Conversation memory" checked={settings.aiConversationMemory} onCheckedChange={(v) => update('aiConversationMemory', v)} />
      <SettingRow label="Auto-adjust workouts from feedback" checked={settings.aiWorkoutAutoAdjust} onCheckedChange={(v) => update('aiWorkoutAutoAdjust', v)} />
      <SettingRow label="AI meal swap suggestions" checked={settings.aiMealSwapSuggestions} onCheckedChange={(v) => update('aiMealSwapSuggestions', v)} />
      <SettingRow label="Injury reporting in chat" checked={settings.aiInjuryReporting} onCheckedChange={(v) => update('aiInjuryReporting', v)} />
      <SettingRow label="Voice input" checked={settings.aiVoiceInput} onCheckedChange={(v) => update('aiVoiceInput', v)} />
      <SettingRow label="Read responses aloud" checked={settings.aiReadAloud} onCheckedChange={(v) => update('aiReadAloud', v)} />
    </SettingsSection>
  );
}
