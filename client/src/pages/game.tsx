import { useEffect } from 'react';
import { Gnome } from '@/components/game/Gnome';
import { Upgrades } from '@/components/game/Upgrades';
import { Achievements } from '@/components/game/Achievements';
import { Leaderboard } from '@/components/game/Leaderboard';
import { WalletConnect } from '@/components/game/WalletConnect';
import { useGameStore } from '@/lib/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export default function Game() {
  const { coins, coinsPerSecond, activeTab, setActiveTab, addCoins, checkEvents } = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      if (coinsPerSecond > 0) {
        addCoins(coinsPerSecond);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [coinsPerSecond, addCoins]);

  // Check for active events every minute
  useEffect(() => {
    checkEvents(); // Check immediately on mount
    const interval = setInterval(checkEvents, 60000);
    return () => clearInterval(interval);
  }, [checkEvents]);

  return (
    <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json">
      <div className="min-h-screen bg-background text-foreground relative pb-20">
        {/* Top Bar with Wallet and Stats */}
        <div className="w-full bg-card border-b border-border p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Card className="p-4">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-primary mb-2">
                  {coins.toFixed(0)} Coins
                </h1>
                <p className="text-sm text-muted-foreground">
                  Per second: {coinsPerSecond.toFixed(1)}
                </p>
              </div>
            </Card>
            <WalletConnect />
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'tap' && <Gnome />}
            {activeTab === 'upgrades' && <Upgrades />}
            {activeTab === 'achievements' && <Achievements />}
            {activeTab === 'leaderboard' && <Leaderboard />}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
          <div className="max-w-4xl mx-auto flex justify-center gap-4">
            <Button
              variant={activeTab === 'tap' ? 'default' : 'secondary'}
              onClick={() => setActiveTab('tap')}
            >
              Tap to Earn
            </Button>
            <Button
              variant={activeTab === 'upgrades' ? 'default' : 'secondary'}
              onClick={() => setActiveTab('upgrades')}
            >
              Upgrades
            </Button>
            <Button
              variant={activeTab === 'achievements' ? 'default' : 'secondary'}
              onClick={() => setActiveTab('achievements')}
            >
              Achievements
            </Button>
            <Button
              variant={activeTab === 'leaderboard' ? 'default' : 'secondary'}
              onClick={() => setActiveTab('leaderboard')}
            >
              Leaderboard
            </Button>
          </div>
        </div>
      </div>
    </TonConnectUIProvider>
  );
}