import { useQuery, useMutation } from '@tanstack/react-query';
import { useGameStore } from '@/lib/game';
import { Card } from '@/components/ui/card';
import { apiRequest } from '@/lib/queryClient';
import type { Score } from '@shared/schema';

export function Leaderboard() {
  const { coins, achievements, walletAddress } = useGameStore();

  const { data: scores } = useQuery<Score[]>({
    queryKey: ['/api/scores']
  });

  const { mutate: submitScore } = useMutation({
    mutationFn: async () => {
      if (!walletAddress) return;

      await apiRequest('POST', '/api/scores', {
        username: walletAddress,
        score: coins,
        achievements: achievements.filter(a => a.unlocked).length
      });
    }
  });

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <button
          onClick={() => submitScore()}
          className="text-sm text-primary hover:text-primary/80"
          disabled={!walletAddress}
        >
          Submit Score
        </button>
      </div>
      <div className="space-y-2">
        {scores?.map((score, i) => (
          <div key={score.id} className="flex justify-between items-center">
            <span>
              {i + 1}. {score.username.slice(0, 6)}...{score.username.slice(-4)}
            </span>
            <span className="text-primary">{score.score.toLocaleString()} coins</span>
          </div>
        ))}
      </div>
    </Card>
  );
}