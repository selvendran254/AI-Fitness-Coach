import { Bot, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: string;
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn('chat-message-enter flex gap-3.5 items-end', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={cn(
          'h-10 w-10 shrink-0 rounded-full flex items-center justify-center ring-[3px] ring-offset-2 ring-offset-transparent',
          isUser
            ? 'bg-gradient-to-br from-primary via-emerald-500 to-teal-600 text-primary-foreground ring-primary/25 shadow-lg shadow-primary/30'
            : 'bg-gradient-to-br from-card to-muted text-primary ring-primary/20 border border-primary/10 shadow-md'
        )}
      >
        {isUser ? <User className="h-[18px] w-[18px]" /> : <Bot className="h-[18px] w-[18px]" />}
      </div>
      <div className={cn('flex flex-col gap-1.5 min-w-0 max-w-[min(100%,34rem)]', isUser && 'items-end')}>
        <span
          className={cn(
            'text-[10px] font-bold uppercase tracking-[0.08em] px-1',
            isUser ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {isUser ? 'You' : 'AI Coach'}
        </span>
        <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-assistant'}>
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>
      </div>
    </div>
  );
}

export function ChatTypingIndicator() {
  return (
    <div className="chat-message-enter flex gap-3.5 items-end">
      <div className="relative h-10 w-10 shrink-0">
        <div className="h-full w-full rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 border border-primary/25 flex items-center justify-center ring-2 ring-primary/15">
          <Sparkles className="h-[18px] w-[18px] text-primary animate-pulse" />
        </div>
        <span className="online-dot scale-75" aria-hidden />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-primary px-1">AI Coach · typing</span>
        <div className="chat-bubble-assistant flex items-center gap-2 py-4 px-6 min-w-[72px]">
          <span className="typing-dot" />
          <span className="typing-dot [animation-delay:160ms]" />
          <span className="typing-dot [animation-delay:320ms]" />
        </div>
      </div>
    </div>
  );
}
