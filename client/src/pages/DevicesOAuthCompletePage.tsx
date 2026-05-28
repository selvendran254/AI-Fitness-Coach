import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';

/**
 * OAuth popup landing page — notifies opener and closes.
 */
export default function DevicesOAuthCompletePage() {
  const [params] = useSearchParams();
  const status = params.get('status') ?? 'error';
  const provider = params.get('provider') ?? 'device';
  const ok = status === 'success';

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ type: 'fitcoach-oauth', status, provider }, '*');
      const t = setTimeout(() => window.close(), 1500);
      return () => clearTimeout(t);
    }
  }, [status, provider]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="text-center space-y-3">
        {ok ? (
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
        ) : (
          <XCircle className="h-12 w-12 text-destructive mx-auto" />
        )}
        <h1 className="text-xl font-bold">
          {ok ? 'Device connected!' : 'Connection failed'}
        </h1>
        <p className="text-sm text-muted-foreground">
          {ok ? 'You can close this window.' : 'Try again from the Devices page.'}
        </p>
      </div>
    </div>
  );
}
