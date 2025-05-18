import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Heart, Coins, AlertCircle } from 'lucide-react';
import { Pokemon } from '@/types/types';
import { pokemonService } from '@/services/api';

const StatsCard: React.FC = () => {
  const { user } = useAuth();
  const [adoptedPokemons, setAdoptedPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user's adopted Pokémon
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      pokemonService.getUserPokemons()
        .then(response => {
          return setAdoptedPokemons(response.data);
        })
        .catch(error => {
          console.error("Error fetching adopted Pokémon:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setAdoptedPokemons([]);
    }
  }, [user]);
  
  // Calculate how many Pokémon are healthy vs in danger
  const pokemonStats = React.useMemo(() => {
    const total = adoptedPokemons.length;
    const healthy = adoptedPokemons.filter(pokemon => pokemon.health > 50).length;
    const danger = total - healthy;
    
    return { total, healthy, danger };
  }, [adoptedPokemons]);
  
  return (
    <div className="w-full bg-gradient-to-r from-[#1a2b47] to-[#0a1128] border border-blue-500/30 rounded-lg shadow-lg p-3 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center px-3 py-1 bg-blue-900/30 rounded-lg">
          <div className="flex items-center gap-2 text-blue-300">
            <span className="text-xs whitespace-nowrap">Adopted Pokémon</span>
            <span className="block text-lg font-bold">
              {isLoading ? "..." : pokemonStats.total}
            </span>
          </div>
        </div>

        <div className="flex items-center px-3 py-1 bg-blue-900/30 rounded-lg">
          <div className="flex items-center gap-2 text-pokemon-yellow">
            <Coins size={16} />
            <span className="text-xs whitespace-nowrap">Available Coins</span>
            <span className="block text-lg font-bold">{user?.coins || 0}</span>
          </div>
        </div>

        <div className="flex items-center px-3 py-1 bg-blue-900/30 rounded-lg">
          <div className="flex items-center gap-2 text-green-500">
            <Heart size={16} />
            <span className="text-xs whitespace-nowrap">Healthy Pokémon</span>
            <span className="block text-lg font-bold">
              {isLoading ? "..." : pokemonStats.healthy}
            </span>
          </div>
        </div>

        <div className="flex items-center px-3 py-1 bg-blue-900/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle size={16} />
            <span className="text-xs whitespace-nowrap">Need Feeding</span>
            <span className="block text-lg font-bold">
              {isLoading ? "..." : pokemonStats.danger}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
