import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Upgrade {
  id: string;
  name: string;
  cost: number;
  coinsPerSecond: number;
  owned: number;
  icon: string;
  seasonal?: boolean;
  eventId?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  active: boolean;
  upgrades: Upgrade[];
}

interface GameState {
  coins: number;
  coinsPerClick: number;
  coinsPerSecond: number;
  upgrades: Upgrade[];
  achievements: Achievement[];
  walletAddress: string | null;
  activeTab: string;
  seasonalEvents: SeasonalEvent[];
  currentEvent: SeasonalEvent | null;
  addCoins: (amount: number) => void;
  buyUpgrade: (id: string) => void;
  setWalletAddress: (address: string | null) => void;
  setActiveTab: (tab: string) => void;
  checkAchievements: () => void;
  checkEvents: () => void;
}

const WINTER_EVENT: SeasonalEvent = {
  id: 'winter_2025',
  name: 'Winter Wonderland',
  description: 'Special winter upgrades available for a limited time!',
  startTime: new Date('2025-02-10').getTime(), // Today
  endTime: new Date('2025-02-17').getTime(), // Week-long event
  active: true,
  upgrades: [
    {
      id: 'snow_machine',
      name: 'Snow Machine',
      cost: 100,
      coinsPerSecond: 2,
      owned: 0,
      icon: 'https://images.unsplash.com/photo-1607666531863-c68c61b4f39f',
      seasonal: true,
      eventId: 'winter_2025'
    },
    {
      id: 'ice_castle',
      name: 'Ice Castle',
      cost: 500,
      coinsPerSecond: 10,
      owned: 0,
      icon: 'https://images.unsplash.com/photo-1582873472728-8e649e84c443',
      seasonal: true,
      eventId: 'winter_2025'
    }
  ]
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      coins: 0,
      coinsPerClick: 1,
      coinsPerSecond: 0,
      walletAddress: null,
      activeTab: 'tap',
      seasonalEvents: [WINTER_EVENT],
      currentEvent: null,
      upgrades: [
        {
          id: 'cursor',
          name: 'Magic Cursor',
          cost: 10,
          coinsPerSecond: 0.1,
          owned: 0,
          icon: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea'
        },
        {
          id: 'garden',
          name: 'Gnome Garden',
          cost: 50,
          coinsPerSecond: 1,
          owned: 0,
          icon: 'https://images.unsplash.com/photo-1611606063065-ee7946f0787a'
        },
        {
          id: 'factory',
          name: 'Gnome Factory',
          cost: 200,
          coinsPerSecond: 5,
          owned: 0,
          icon: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868'
        }
      ],
      achievements: [
        {
          id: 'beginner',
          name: 'Beginner Gnome',
          description: 'Earn your first 100 coins',
          icon: 'https://images.unsplash.com/photo-1548126466-4470dfd3a209',
          unlocked: false,
          requirement: 100
        },
        {
          id: 'intermediate',
          name: 'Skilled Gnome',
          description: 'Earn 1000 coins',
          icon: 'https://images.unsplash.com/photo-1571008840902-28bf8f9cd71a',
          unlocked: false,
          requirement: 1000
        },
        {
          id: 'advanced',
          name: 'Master Gnome',
          description: 'Earn 10000 coins',
          icon: 'https://images.unsplash.com/photo-1571008592377-e362723e8998',
          unlocked: false,
          requirement: 10000
        }
      ],
      addCoins: (amount) => {
        set((state) => ({ coins: state.coins + amount }));
        get().checkAchievements();
      },
      buyUpgrade: (id) => {
        set((state) => {
          const allUpgrades = [...state.upgrades];
          if (state.currentEvent) {
            allUpgrades.push(...state.currentEvent.upgrades);
          }

          const upgrade = allUpgrades.find(u => u.id === id);
          if (!upgrade || state.coins < upgrade.cost) return state;

          const newUpgrades = state.upgrades.map(u => 
            u.id === id ? { ...u, owned: u.owned + 1, cost: Math.floor(u.cost * 1.15) } : u
          );

          let newEventUpgrades = state.currentEvent?.upgrades.map(u =>
            u.id === id ? { ...u, owned: u.owned + 1, cost: Math.floor(u.cost * 1.15) } : u
          );

          const totalCPS = [...newUpgrades, ...(newEventUpgrades || [])].reduce(
            (sum, u) => sum + (u.coinsPerSecond * u.owned), 
            0
          );

          return {
            upgrades: newUpgrades,
            currentEvent: state.currentEvent ? {
              ...state.currentEvent,
              upgrades: newEventUpgrades || []
            } : null,
            coins: state.coins - upgrade.cost,
            coinsPerSecond: totalCPS
          };
        });
      },
      setWalletAddress: (address) => set({ walletAddress: address }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      checkAchievements: () => {
        set((state) => ({
          achievements: state.achievements.map(a => ({
            ...a,
            unlocked: state.coins >= a.requirement || a.unlocked
          }))
        }));
      },
      checkEvents: () => {
        const now = Date.now();
        set((state) => {
          const activeEvent = state.seasonalEvents.find(
            event => now >= event.startTime && now <= event.endTime
          ) || null;

          return {
            currentEvent: activeEvent
          };
        });
      }
    }),
    {
      name: 'coco-gnome-storage'
    }
  )
);