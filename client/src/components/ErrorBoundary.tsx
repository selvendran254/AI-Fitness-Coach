import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background">
          <div className="max-w-md space-y-4 text-center">
            <h1 className="text-xl font-bold text-destructive">Something went wrong</h1>
            <p className="text-sm text-muted-foreground font-mono break-all">
              {this.state.error.message}
            </p>
            <Button
              onClick={() => {
                localStorage.removeItem('fitcoach-auth');
                window.location.href = '/login';
              }}
            >
              Clear session & reload
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
