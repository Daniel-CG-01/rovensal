export interface Pokemon {
    name: string;
    height: number;
    weight: number;
    imageUrl: string;
    types: string[];
    abilities: string[];
}

// Esta interfaz devuelve una lista con todos los Pokémon
export interface PokemonListResponse {
    results: {
        name: string;
        url: string;
    }[];
}

// Esta interfaz devuelve cada Pokémon por separado (con sus características)
export interface PokemonDetailResponse {
    name: string;
    height: number;
    weight: number;
    sprites: {
        front_default: string;
    };
    types: {
        type: {
            name: string;
        };
    }[];
    abilities: {
        ability: {
            name: string;
        };
    }[];
}