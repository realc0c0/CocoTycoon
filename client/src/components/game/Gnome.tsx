import { useGameStore } from '@/lib/game';
import { motion } from 'framer-motion';

export function Gnome() {
  const { addCoins, coinsPerClick } = useGameStore();

  const handleClick = () => {
    addCoins(coinsPerClick);
  };

  return (
    <motion.div
      className="flex justify-center cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <img
        src="https://images.unsplash.com/photo-1531000164940-cde686a49bfc"
        alt="Coco the Gnome"
        className="w-48 h-48 object-contain rounded-full"
      />
    </motion.div>
  );
}
