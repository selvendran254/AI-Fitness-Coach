import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function OAuthSetupWizard() {
  return (
    <Card>
      <CardHeader><CardTitle>Live Fitbit / Google Fit sync</CardTitle></CardHeader>
      <CardContent className="text-sm space-y-2 text-muted-foreground">
        <p>1. Create Fitbit app at dev.fitbit.com — add redirect: <code className="text-xs">http://localhost:5173/api/v1/devices/oauth/fitbit/callback</code></p>
        <p>2. Google Cloud → Fitness API → OAuth client — redirect: <code className="text-xs">http://localhost:5173/api/v1/devices/oauth/google/callback</code></p>
        <p>3. Add to <code>server/.env</code>: FITBIT_CLIENT_ID, FITBIT_CLIENT_SECRET, GOOGLE_FIT_CLIENT_ID, GOOGLE_FIT_CLIENT_SECRET</p>
        <p>4. Restart server — Connect on Fitbit/Google cards opens real OAuth</p>
      </CardContent>
    </Card>
  );
}
