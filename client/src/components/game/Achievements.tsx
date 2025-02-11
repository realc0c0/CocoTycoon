import { useGameStore } from '@/lib/game';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

export function Achievements() {
  const { achievements } = useGameStore();

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-4">Achievements</h2>
      <div className="space-y-4">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            whileHover={{ scale: 1.02 }}
            className={`${achievement.unlocked ? 'opacity-100' : 'opacity-50'}`}
          >
            <Card className="p-4 flex items-center gap-4">
              <img
                src={achievement.icon}
                alt={achievement.name}
                className="w-12 h-12 rounded"
              />
              <div>
                <h3 className="font-bold">{achievement.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {achievement.description}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
