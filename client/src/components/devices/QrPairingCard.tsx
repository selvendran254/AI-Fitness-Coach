import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode } from 'lucide-react';

export function QrPairingCard({ isTa }: { isTa: boolean }) {
  const [qr, setQr] = useState<string | null>(null);
  const gen = useMutation({
    mutationFn: async () => {
      const res = await api.post('/pairing/qr');
      return res.data.data as { qrDataUrl: string; url: string };
    },
    onSuccess: (d) => setQr(d.qrDataUrl),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <QrCode className="h-5 w-5" /> {isTa ? 'QR இணைப்பு' : 'QR pairing'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {isTa ? 'Phone-ல் QR scan செய்து Health Connect setup open செய்யுங்கள்' : 'Scan QR on phone to open device pairing'}
        </p>
        <Button onClick={() => gen.mutate()} disabled={gen.isPending}>
          {isTa ? 'QR உருவாக்கு' : 'Generate QR'}
        </Button>
        {qr && <img src={qr} alt="Pairing QR" className="w-48 h-48 mx-auto border rounded-lg" />}
      </CardContent>
    </Card>
  );
}
