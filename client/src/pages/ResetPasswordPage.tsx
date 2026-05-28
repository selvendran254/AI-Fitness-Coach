import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/auth/reset-password', { token: params.get('token'), password });
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>New password</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <Input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            <Button type="submit" className="w-full">Update password</Button>
          </form>
          <Link to="/login" className="text-sm text-primary block mt-4">Login</Link>
        </CardContent>
      </Card>
    </div>
  );
}
