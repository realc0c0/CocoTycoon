import { useGameStore } from '@/lib/game';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function Upgrades() {
  const { upgrades, coins, buyUpgrade, currentEvent } = useGameStore();

  // Combine regular and seasonal upgrades
  const allUpgrades = [...upgrades];
  if (currentEvent) {
    allUpgrades.push(...currentEvent.upgrades);
  }

  return (
    <div className="space-y-4">
      {currentEvent && (
        <Card className="p-4 bg-primary/10 border-primary">
          <h2 className="text-xl font-bold mb-2">{currentEvent.name}</h2>
          <p className="text-sm text-muted-foreground mb-2">{currentEvent.description}</p>
          <p className="text-sm text-primary">
            Event ends in {Math.ceil((currentEvent.endTime - Date.now()) / (1000 * 60 * 60 * 24))} days
          </p>
        </Card>
      )}

      <Card className="p-4">
        <h2 className="text-2xl font-bold mb-4">Upgrades</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allUpgrades.map((upgrade) => (
            <motion.div
              key={upgrade.id}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className={`p-4 ${upgrade.seasonal ? 'border-primary' : ''}`}>
                {upgrade.seasonal && (
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                    Limited Time
                  </div>
                )}
                <img
                  src={upgrade.icon}
                  alt={upgrade.name}
                  className="w-16 h-16 mb-2 rounded"
                />
                <h3 className="font-bold">{upgrade.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Owned: {upgrade.owned}
                </p>
                <p className="text-sm text-muted-foreground">
                  +{upgrade.coinsPerSecond} coins/s
                </p>
                <Button
                  onClick={() => buyUpgrade(upgrade.id)}
                  disabled={coins < upgrade.cost}
                  className="w-full mt-2"
                  variant={coins >= upgrade.cost ? "default" : "secondary"}
                >
                  Buy ({upgrade.cost} coins)
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}