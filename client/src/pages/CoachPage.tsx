import { useState, useEffect, useRef } from 'react';
import { useUserSettings } from '@/hooks/useUserSettings';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { MessageCircle, Mic, Volume2, Sparkles, Send, Lightbulb } from 'lucide-react';
import { useVoiceCoach } from '@/hooks/useVoiceCoach';
import { ChatMessage, ChatTypingIndicator } from '@/components/coach/ChatMessage';

interface Message {
  role: string;
  content: string;
}

const QUICK_PROMPTS_EN = [
  'Safe cardio for hypertension?',
  'Post-meal walk — how long?',
  'Low GI breakfast ideas (Tamil Nadu)',
  'Why is my glucose high after workout?',
  'Modify plan — knee pain today',
];

const QUICK_PROMPTS_TA = [
  'உயர் இரத்த அழுத்தத்திற்கு பாதுகாப்பான உடற்பயிற்சி?',
  'உணவுக்குப் பிறகு நடை எவ்வளவு நேரம்?',
  'குறைந்த GI காலை உணவு யோசனைகள்',
  'பயிற்சிக்குப் பிறகு சர்க்கரை ஏன் உயர்ந்தது?',
];

export default function CoachPage() {
  const s = useUserSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const lang = s.aiCoachLanguage === 'ta' ? 'ta' : 'en';
  const { listening, transcript, setTranscript, startListening, speak } = useVoiceCoach(lang);
  const prompts = lang === 'ta' ? QUICK_PROMPTS_TA : QUICK_PROMPTS_EN;

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript, setTranscript]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const msg = text ?? input;
    if (!msg.trim()) return;
    const userMsg = { role: 'user', content: msg };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { message: msg });
      const reply = data.data.message.content as string;
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
      if (s.aiReadAloud) speak(reply);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Unable to reach AI coach. Check server & OPENAI_API_KEY.' }]);
    } finally {
      setLoading(false);
    }
  };

  const meta = `GPT-4o · ${s.aiCoachTone} tone · ${s.aiCoachLanguage === 'ta' ? 'தமிழ்' : 'English'}${s.includeHealthContextInAi ? ' · Health context ON' : ''}`;

  return (
    <div className="page-shell max-w-4xl">
      <PageHeader icon={MessageCircle} title="AI Coach" description={meta}>
        {s.aiVoiceInput && <Badge variant="outline" className="rounded-full"><Mic className="h-3 w-3 mr-1" />Voice</Badge>}
        {s.aiReadAloud && <Badge variant="outline" className="rounded-full"><Volume2 className="h-3 w-3 mr-1" />Read aloud</Badge>}
        {s.aiWorkoutAutoAdjust && <Badge className="rounded-full"><Sparkles className="h-3 w-3 mr-1" />Auto-adjust</Badge>}
      </PageHeader>

      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="prompts">Quick prompts</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card className="elevated-card flex flex-col min-h-[540px] border-primary/15 overflow-hidden">
            <CardHeader className="pb-3 border-b border-border/40 bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="text-base">Conversation</CardTitle>
              <CardDescription>
                {s.aiConversationMemory ? 'Remembers recent messages' : 'Single session'} · {s.aiSuggestionFrequency}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 p-4 sm:p-6">
              <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto max-h-[440px] pr-2 chat-scroll-area rounded-2xl chat-panel-bg p-4 -mx-1">
                {messages.length === 0 && (
                  <div className="text-center py-14 px-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-emerald-500/10 text-primary flex items-center justify-center mx-auto mb-4 ring-2 ring-primary/15 shadow-lg shadow-primary/10">
                      <MessageCircle className="h-8 w-8" />
                    </div>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Ask about exercises, meals, glucose, BP, or workout modifications.
                    </p>
                    {s.healthConditions.length > 0 && (
                      <p className="text-xs text-primary mt-3 font-medium">
                        AI knows: {s.healthConditions.join(', ').replace(/_/g, ' ')}
                      </p>
                    )}
                  </div>
                )}
                {messages.map((msg, i) => (
                  <ChatMessage key={i} role={msg.role} content={msg.content} />
                ))}
                {loading && <ChatTypingIndicator />}
              </div>
              <div className="chat-input-bar flex gap-2">
                {s.aiVoiceInput && (
                  <Button type="button" variant="outline" size="icon" className="shrink-0 rounded-xl h-11 w-11 border-primary/20" onClick={startListening} disabled={listening}>
                    <Mic className={`h-4 w-4 ${listening ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
                  </Button>
                )}
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={s.aiCoachLanguage === 'ta' ? 'உங்கள் கேள்வியை டைப் செய்யுங்கள்...' : 'Type your question...'}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  disabled={loading}
                  className="h-11 flex-1 rounded-xl border-0 bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-primary/30"
                />
                <Button onClick={() => sendMessage()} disabled={loading} size="icon" className="shrink-0 h-11 w-11 rounded-xl shadow-md shadow-primary/20">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prompts">
          <Card>
            <CardHeader><CardTitle>One-tap questions</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {prompts.map((p) => (
                <Button key={p} variant="outline" size="sm" className="rounded-full text-left h-auto py-2 px-4 max-w-full whitespace-normal" onClick={() => sendMessage(p)} disabled={loading}>
                  {p}
                </Button>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tips">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-emerald-500/15">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-emerald-600" />Diabetes</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Check glucose before/after exercise</p>
                <p>• Keep fast carbs during workouts</p>
                <p>• Max carbs/meal: {s.maxCarbsPerMealG}g</p>
                {s.insulinDependent && <p>• Insulin timing affects exercise safety</p>}
              </CardContent>
            </Card>
            <Card className="border-blue-500/15">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-blue-600" />Blood pressure</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Target: {s.targetSystolicBp}/{s.targetDiastolicBp} mmHg</p>
                <p>• HR cap: {s.heartRateCapPercent}% max during exercise</p>
                {s.avoidHighIntensityCardio && <p>• High-intensity cardio disabled in profile</p>}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
