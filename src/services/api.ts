import axios from 'axios';
import { User, Pokemon, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types/types';
import PokemonCard from '@/components/PokemonCard';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000', 
  withCredentials: true
});

// Set JWT token for auth requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  // console.log('Token sent:', token);
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});




// Function to decrease health for Pokémon not fed in 24 hours
const updatePokemonHealth = () => {
  try {
    const adoptedPokemons = JSON.parse(localStorage.getItem('adoptedPokemons') || '[]');
    const now = new Date();
    
    const updatedPokemons = adoptedPokemons.map((pokemon: Pokemon) => {
      if (!pokemon.lastFed) return pokemon;
      
      const lastFed = new Date(pokemon.lastFed);
      const hoursSinceLastFed = (now.getTime() - lastFed.getTime()) / (1000 * 60 * 60);
      
      // If not fed in the last 24 hours, decrease health (simulating cron job)
      if (hoursSinceLastFed >= 24) {
        const healthDecrease = Math.floor(hoursSinceLastFed / 24) * 10;  // 10 health points per day
        return {
          ...pokemon,
          health: Math.max(1, pokemon.health - healthDecrease) // Don't go below 1
        };
      }
      
      return pokemon;
    });
    
    localStorage.setItem('adoptedPokemons', JSON.stringify(updatedPokemons));
    return updatedPokemons;
  } catch (error) {
    console.error('Error updating Pokémon health:', error);
    return [];
  }
};

// Real API service for production use
const realApiService = {
  getAllPokemons: async (): Promise<Pokemon[]> => {
    const response = await api.get('http://localhost:5000/api/pokemons');
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
},


register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', credentials);
  return response.data;
},


  getUserPokemons: async (): Promise<Pokemon[]> => {
    // Check and update health first (simulating a cron job)
    const updatedPokemons = updatePokemonHealth();
    return updatedPokemons;
  },

  adoptPokemon: async (pokemonId: string): Promise<{ pokemon: Pokemon; user: User }> => {
    const response = await api.post(`/pokemons/${pokemonId}/adopt`);
    return response.data;
  },

  feedPokemon: async (pokemonId: string): Promise<{ pokemon: Pokemon; message: string }> => {
    const response = await api.post(`/pokemons/${pokemonId}/feed`);
    return response.data;
  },

  collectFairyReward: async (): Promise<{ user: User; message: string }> => {
    const response = await api.post('/rewards/fairy');
    return response.data;
    
  }
};
 export default realApiService 

// Mock API service for demo/dev purposes
export const mockApiService = {
  getAllPokemons: async (): Promise<Pokemon[]> => {
    // Return mock data for demo purposes with more Pokémon
    return [
      {
        _id: '1',
        name: 'Pikachu',
        breed: 'Electric Mouse',
        age: 2,
        type: ['Electric'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        description: "When it is angered, it immediately discharges the energy stored in the pouches in its cheeks.",
        health: 100,
        rarity: 'rare',
        price: 50,
        isAdopted: false
      },
      {
        _id: '2',
        name: 'Bulbasaur',
        breed: 'Seed',
        age: 1,
        type: ['Grass', 'Poison'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
        description: "Bulbasaur can be seen napping in bright sunlight. There is a seed on its back. By soaking up the sun's rays, the seed grows progressively larger.",
        health: 120,
        rarity: 'common',
        price: 30,
        isAdopted: false
      },
      {
        _id: '3',
        name: 'Charmander',
        breed: 'Lizard',
        age: 1,
        type: ['Fire'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
        description: "The flame that burns at the tip of its tail is an indication of its emotions. The flame wavers when Charmander is enjoying itself. If the Pokémon becomes enraged, the flame burns fiercely.",
        health: 80,
        rarity: 'common',
        price: 30,
        isAdopted: false
      },
      {
        _id: '4',
        name: 'Squirtle',
        breed: 'Tiny Turtle',
        age: 1,
        type: ['Water'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
        description: "Squirtle's shell is not merely used for protection. The shell's rounded shape and the grooves on its surface minimize resistance in water, enabling this Pokémon to swim at high speeds.",
        health: 90,
        rarity: 'common',
        price: 30,
        isAdopted: false
      },
      {
        _id: '5',
        name: 'Eevee',
        breed: 'Evolution',
        age: 2,
        type: ['Normal'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
        description: 'Eevee has an unstable genetic code that allows it to evolve into multiple forms. It is popular as a pet due to its friendly nature.',
        health: 110,
        rarity: 'rare',
        price: 50,
        isAdopted: false
      },
      {
        _id: '6',
        name: 'Snorlax',
        breed: 'Sleeping',
        age: 5,
        type: ['Normal'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png',
        description: 'Snorlax is a very lazy Pokémon. Unless it is eating, it is constantly asleep. It is not picky about what it eats—even moldy food will do.',
        health: 200,
        rarity: 'common',
        price: 70,
        isAdopted: false
      },
      {
        _id: '7',
        name: 'Gengar',
        breed: 'Shadow',
        age: 4,
        type: ['Ghost', 'Poison'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/94.png',
        description: 'Sometimes, on a dark night, your shadow thrown by a streetlight will suddenly overtake you and race off into the darkness. It is actually a Gengar running by pretending to be your shadow.',
        health: 95,
        rarity: 'rare',
        price: 60,
        isAdopted: false
      },
      {
        _id: '8',
        name: 'Mewtwo',
        breed: 'Genetic',
        age: 3,
        type: ['Psychic'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
        description: "Mewtwo is a Pokémon that was created by genetic manipulation. However, even though the scientific power of humans created this Pokémon's body, they failed to endow Mewtwo with a compassionate heart.",
        health: 150,
        rarity: 'legendary',
        price: 100,
        isAdopted: false
      },
      {
        _id: '9',
        name: 'Articuno',
        breed: 'Freeze',
        age: 5,
        type: ['Ice', 'Flying'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/144.png',
        description: 'Articuno is a large, avian Pokémon with predominantly blue plumage. It has a head crest of long, blue feathers and a gray, mask-like marking around its eyes.',
        health: 130,
        rarity: 'legendary',
        price: 90,
        isAdopted: false
      },
      {
        _id: '10',
        name: 'Zapdos',
        breed: 'Electric',
        age: 5,
        type: ['Electric', 'Flying'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/145.png',
        description: 'Zapdos is an avian Pokémon with predominantly yellow plumage. Black tips appear on its wings and tail feathers. It has a long, thin, light orange beak and black eyes.',
        health: 130,
        rarity: 'legendary',
        price: 90,
        isAdopted: false
      },
      {
        _id: '11',
        name: 'Moltres',
        breed: 'Flame',
        age: 5,
        type: ['Fire', 'Flying'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/146.png',
        description: 'Moltres is a large, avian Pokémon with orange plumage. It has a long, flowing head crest and tail composed of flames. Its beak is long and thin, and its eyes are surrounded by a black marking.',
        health: 130,
        rarity: 'legendary',
        price: 90,
        isAdopted: false
      },
      {
        _id: '12',
        name: 'Jigglypuff',
        breed: 'Balloon',
        age: 1,
        type: ['Normal', 'Fairy'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png',
        description: "Jigglypuff's vocal cords can freely adjust the wavelength of its voice. This Pokémon uses this ability to sing at precisely the right wavelength to make its foes most drowsy.",
        health: 95,
        rarity: 'common',
        price: 25,
        isAdopted: false
      },
      {
        _id: '13',
        name: 'Psyduck',
        breed: 'Duck',
        age: 2,
        type: ['Water'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png',
        description: 'Psyduck is constantly beset by headaches. If the Pokémon lets its strange power erupt, apparently the pain subsides for a while.',
        health: 85,
        rarity: 'common',
        price: 30,
        isAdopted: false
      },
      {
        _id: '14',
        name: 'Machop',
        breed: 'Superpower',
        age: 3,
        type: ['Fighting'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/66.png',
        description: 'Machop exercises by hefting around a Graveler as if it were a barbell. There are some Machop that travel the world in a quest to master all kinds of martial arts.',
        health: 110,
        rarity: 'common',
        price: 35,
        isAdopted: false
      },
      {
        _id: '15',
        name: 'Growlithe',
        breed: 'Puppy',
        age: 1,
        type: ['Fire'],
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/58.png',
        description: "Growlithe has a superb sense of smell. Once it smells anything, this Pokémon won't forget the scent, no matter what. It uses its advanced olfactory sense to determine the emotions of other living things.",
        health: 90,
        rarity: 'common',
        price: 30,
        isAdopted: false
      }
    ];
  },

  getUserPokemons: async (): Promise<Pokemon[]> => {
    // Return mock data for the current user's adopted Pokemon
    const adoptedPokemons = JSON.parse(localStorage.getItem('adoptedPokemons') || '[]');
    return adoptedPokemons;
  },

  adoptPokemon: async (pokemonId: string, pokemonCost: number): Promise<{ pokemon: Pokemon; user: User }> => {
    // Mock the adoption process
    const allPokemons = await realApiService.getAllPokemons();
    const pokemon = allPokemons.find(p => p._id === pokemonId);
    
    if (!pokemon) {
      throw new Error('Pokemon not found');
    }
    
    if (pokemon.price > (JSON.parse(localStorage.getItem('user') || '{"coins":0}').coins || 0)) {
      throw new Error('Not enough coins');
    }
    
    if (pokemon.isAdopted) {
      throw new Error('This Pokémon has already been adopted');
    }
    
    // Update the pokemon
    const adoptedPokemon = { 
      ...pokemon, 
      isAdopted: true, 
      lastFed: new Date(),
      adoptedBy: 'currentUser'
    };
    
    // Update user
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { 
      ...currentUser, 
      coins: (currentUser.coins || 0) - pokemon.price 
    };
    
    // Save to localStorage for persistence
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Add to adopted pokemons
    const adoptedPokemons = JSON.parse(localStorage.getItem('adoptedPokemons') || '[]');
    localStorage.setItem('adoptedPokemons', JSON.stringify([...adoptedPokemons, adoptedPokemon]));
    
    // Mark this pokemon as adopted in the available list too
    const availablePokemons = JSON.parse(localStorage.getItem('availablePokemons') || JSON.stringify(allPokemons));
    const updatedAvailablePokemons = availablePokemons.map((p: Pokemon) => 
      p._id === pokemonId ? { ...p, isAdopted: true } : p
    );
    localStorage.setItem('availablePokemons', JSON.stringify(updatedAvailablePokemons));
    
    return { pokemon: adoptedPokemon, user: updatedUser as User };
  },

  feedPokemon: async (pokemonId: string): Promise<{ pokemon: Pokemon; message: string }> => {
    // Mock the feeding process
    // Check if user has enough coins first
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const feedingCost = 5; // 5 coins per feeding
    
    if ((currentUser.coins || 0) < feedingCost) {
      throw new Error('Not enough coins to feed this Pokémon. Feeding costs 5 coins.');
    }
    
    const adoptedPokemons = JSON.parse(localStorage.getItem('adoptedPokemons') || '[]');
    const pokemonIndex = adoptedPokemons.findIndex((p: Pokemon) => p._id === pokemonId);
    
    if (pokemonIndex === -1) {
      throw new Error('Pokemon not found');
    }
    
    // Update Pokemon health and lastFed
    const updatedPokemon = {
      ...adoptedPokemons[pokemonIndex],
      health: Math.min(100, adoptedPokemons[pokemonIndex].health + 20),
      lastFed: new Date()
    };
    
    // Update user coins
    const updatedUser = {
      ...currentUser,
      coins: (currentUser.coins || 0) - feedingCost
    };
    
    // Update storage
    adoptedPokemons[pokemonIndex] = updatedPokemon;
    localStorage.setItem('adoptedPokemons', JSON.stringify(adoptedPokemons));
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return { 
      pokemon: updatedPokemon, 
      message: `${updatedPokemon.name} has been fed and is feeling better!` 
    };
  },

  collectFairyReward: async (): Promise<{ user: User; message: string }> => {
    // Mock the fairy reward process
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Update user with coins and timestamp
    const updatedUser = {
      ...currentUser,
      coins: (currentUser.coins || 0) + 1, // Add 1 coin
      lastFairyReward: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return {
      user: updatedUser as User,
      message: "You received 1 coin from Fairy Tuba!"
    };
  },

  collectTubaReward: async (): Promise<{ user: User; message: string }> => {
    // Mock the tuba reward process
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Check if 10 hours have passed since last collection
    const lastReward = currentUser.lastTubaReward ? new Date(currentUser.lastTubaReward) : null;
    const currentTime = new Date();
    
    if (lastReward && ((currentTime.getTime() - lastReward.getTime()) < 10 * 60 * 60 * 1000)) {
      throw new Error('You can collect this reward again in a few hours');
    }
    
    // Update user with coins and timestamp
    const updatedUser = {
      ...currentUser,
      coins: (currentUser.coins || 0) + 5, // Add 5 coins
      lastTubaReward: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return {
      user: updatedUser as User,
      message: "You received 5 coins from Fairy Tuba!"
    };
  },

  // Auth methods
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // In a real app, this would validate against a backend
    if (credentials.email === 'user@example.com' && credentials.password === 'password') {
      const user: User = {
        _id: '12345',
        username: 'DemoUser',
        email: credentials.email,
        coins: 100
      };
      
      const token = 'mock-jwt-token';
      
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      return { user, token };
    }
    
    throw new Error('Invalid email or password');
  },
  
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    // Mock registration
    const user: User = {
      _id: Math.random().toString(36).substring(7),
      username: credentials.username,
      email: credentials.email,
      coins: 100
    };
    
    const token = 'mock-jwt-token';
    
    // Store in localStorage
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    
    return { user, token };
  },
  
  logout: async (): Promise<void> => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('adoptedPokemons');
    return;
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    return JSON.parse(userString) as User;
  }
};

// Export the appropriate service based on environment
// For now, we're using the mock service
// export const pokemonService = mockApiService;

export const pokemonService = {
    getAllPokemons: () => api.get('api/pokemons'),
  getUserPokemons: () => api.get('api/pokemons/user'),
  adoptPokemon: (id) => api.post(`/pokemons/${id}/adopt`),
  feedPokemon: (id) => api.post(`/pokemons/${id}/feed`)
}