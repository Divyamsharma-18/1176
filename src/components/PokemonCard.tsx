
import React from 'react';
import { Coins, Heart, Star } from 'lucide-react';
import { Pokemon } from '@/types/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { json } from 'stream/consumers';


interface PokemonCardProps {
  pokemon: Pokemon;
  onAdopt?: (id: string, cost: number) => void;
  onFeed?: (id: string) => void;
  isAdopted?: boolean;
  userCoins?: number;
  actionLoading?: boolean;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ 
  pokemon, 
  onAdopt, 
  onFeed, 
  isAdopted = false, 
  userCoins = 0,
  actionLoading = false
}) => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  
  // Function to determine time since last fed
  const getTimeSinceLastFed = () => {
    if (!pokemon.lastFed) return 'Never fed';
    
    const lastFed = new Date(pokemon.lastFed);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - lastFed.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just fed';
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffHours / 24)} days ago`;
  };

  // Determine health status color
  const getHealthStatusColor = () => {
    if (pokemon.health > 70) return 'bg-green-500';
    if (pokemon.health > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Check if pokemon is rare based on rarity or isRare property
  const isRare = pokemon.isRare || pokemon.rarity === 'rare';
  const isLegendary = pokemon.rarity === 'legendary';
  
  // Get image URL from either imageUrl or image property
  const imageUrl = pokemon.imageUrl || pokemon.image;
  
  // Get adoption cost from either adoptionCost or price property
  const adoptionCost = pokemon.adoptionCost || pokemon.price;

  // Random age between 1-5 years if not provided
  const age = pokemon.age || Math.floor(Math.random() * 5) + 1;

  // Generate breed from type if not provided
  const breed = pokemon.breed || (Array.isArray(pokemon.type) ? pokemon.type[0] : pokemon.type);

  // Get card class based on rarity
  const getCardClass = () => {
    let baseClass = 'pixel-card hover:shadow-lg transition-shadow duration-300';
    if (isLegendary) return `${baseClass} legendary-pokemon hover:shadow-pokemon-gold/50`;
    if (isRare) return `${baseClass} rare-pokemon hover:shadow-pokemon-gold/30`;
    return `${baseClass} normal-pokemon hover:shadow-blue-500/30`; // Add blue shadow to normal cards
  };

  // Function to play pokemon cry
  const playPokemonCry = () => {
    try {
      // Create audio element
      const audio = new Audio(`https://play.pokemonshowdown.com/audio/cries/${pokemon.name.toLowerCase()}.mp3`);
      audio.volume = 0.3;
      audio.play().catch(err => console.log('Error playing sound:', err));
    } catch (error) {
      console.error('Error playing Pokémon sound:', error);
    }
  };
const user = localStorage.getItem('pokemon_user');
const userDetail =JSON.parse(user);
console.log(userDetail)
  // Handle adoption click when not authenticated
  const handleAdoptClick = async() => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please login or register to be a Pokémon trainer',
        variant: 'destructive',
      });
      return;
    }
    const payload = {
    pokemonId: pokemon._id,
    userEmail: userDetail.email,
    name: pokemon.name,
    type: pokemon.type,
    imageUrl: imageUrl,
    adoptionCost: adoptionCost,
    cost: adoptionCost,
    rarity: pokemon.rarity,
    isRare: isRare,
    isLegendary: isLegendary,
  };
    const response = await axios.post(`http://localhost:5000/api/pokemons/adopt-pokemon`, payload);
    console.log(response)
    if (onAdopt && !pokemon.isAdopted && userCoins >= adoptionCost && !actionLoading) {
      // Play sound immediately when button is clicked
      playPokemonCry();
      // Then call the adopt function
      onAdopt(pokemon._id, adoptionCost);
    }
  };

  // Handle feed click
  const handleFeedClick = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to feed your Pokémon',
        variant: 'destructive',
      });
      return;
    }
    
    if (onFeed && pokemon.health < 100 && !actionLoading) {
      // Play sound immediately when button is clicked
      playPokemonCry();
      // Then call the feed function
      onFeed(pokemon._id);
    }
  };

  return (
    <div className={getCardClass()}>
      {/* Pokemon Image Container */}
      <div className={`relative bg-[#1e3a64] aspect-square flex items-center justify-center p-2 ${
        isRare || isLegendary ? 'bg-gradient-to-br from-[#1e3a64] to-pokemon-gold/30' : ''
      }`}>
        {/* Adopted Badge for available pokemons that are adopted */}
        {pokemon.isAdopted && !isAdopted && (
          <div className="adopted-badge">
            ADOPTED
          </div>
        )}
        
        {/* Star decoration for rare/legendary pokemon */}
        {(isRare || isLegendary) && (
          <div className="star-decoration">
            <Star size={isLegendary ? 24 : 18} fill="#ffde00" stroke="#ffde00" />
          </div>
        )}
        
        <img 
          src={imageUrl} 
          alt={pokemon.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      
      {/* Pokemon Info */}
      <div className={`p-3 ${
        isLegendary ? 'bg-gradient-to-br from-[#102340] to-pokemon-gold/20' : 
        isRare ? 'bg-gradient-to-br from-[#102340] to-pokemon-gold/10' : 'bg-[#102340]'
      } text-white`}>
        <div className="flex justify-between items-center mb-2">
          <h3 className="pokemon-font text-sm">{pokemon.name}</h3>
          {isRare && !isLegendary && (
            <span className="bg-pokemon-gold text-xs px-1 rounded text-black">RARE</span>
          )}
          {isLegendary && (
            <span className="bg-gradient-to-r from-pokemon-gold to-amber-400 text-xs px-1 rounded text-black font-bold">LEGENDARY</span>
          )}
        </div>
        
        <div className="text-xs mb-1 flex justify-between">
          <span>Breed:</span>
          <span>{breed}</span>
        </div>
        
        <div className="text-xs mb-1 flex justify-between">
          <span>Age:</span>
          <span>{age} {age === 1 ? 'year' : 'years'}</span>
        </div>
        
        <div className="flex justify-between text-xs mb-2">
          <span>Health:</span>
          <span>{pokemon.health}/100</span>
        </div>
        
        <div className="w-full h-2 bg-gray-700 mb-3">
          <div 
            className={`h-full ${getHealthStatusColor()}`}
            style={{ width: `${pokemon.health}%` }}
          ></div>
        </div>
        
        {!isAdopted ? (
          <button 
            onClick={handleAdoptClick}
            disabled={userCoins < adoptionCost || actionLoading || pokemon.isAdopted}
            className={`w-full py-1 pokemon-font text-center text-xs ${
              userCoins < adoptionCost || pokemon.isAdopted ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {pokemon.isAdopted ? 'ADOPTED' : `ADOPT (${adoptionCost} COINS)`}
          </button>
        ) : (
          <button 
            onClick={handleFeedClick}
            disabled={pokemon.health >= 100 || actionLoading}
            className={`w-full py-1 pokemon-font text-center text-xs ${
              pokemon.health >= 100 ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {pokemon.health >= 100 ? 'FULLY FED' : 'FEED (5 COINS)'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PokemonCard;
