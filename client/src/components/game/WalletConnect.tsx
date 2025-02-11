import { TonConnectButton } from '@tonconnect/ui-react';
import { Card } from '@/components/ui/card';

export function WalletConnect() {
  return (
    <Card className="p-4 flex items-center justify-end">
      <TonConnectButton />
    </Card>
  );
}