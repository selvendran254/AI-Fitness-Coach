import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, ArrowLeft, MailCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/auth/forgot-password', { email });
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 app-mesh-bg">
      <Card className="elevated-card w-full max-w-md ring-1 ring-primary/5">
        <CardHeader className="text-center">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
            {sent ? <MailCheck className="h-6 w-6" /> : <KeyRound className="h-6 w-6" />}
          </div>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            {sent ? 'Check your email for the reset link' : 'Enter your account email'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              If that email exists, we sent a reset link (dev: check server console).
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
              </div>
              <Button type="submit" className="w-full" size="lg">Send reset link</Button>
            </form>
          )}
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mt-6 mx-auto w-fit">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
