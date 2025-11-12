export interface Pokemon {
  id: string;
  name: string;
  types?: TypeName[];
  sprite?: string;
}

type TypeName =
  | 'Normal'
  | 'Fire'
  | 'Water'
  | 'Grass'
  | 'Electric'
  | 'Ice'
  | 'Fighting'
  | 'Poison'
  | 'Ground'
  | 'Flying'
  | 'Psychic'
  | 'Bug'
  | 'Rock'
  | 'Ghost'
  | 'Dragon'
  | 'Dark'
  | 'Steel'
  | 'Fairy';

export interface PokemonType {
  __typename: 'pokemontype';
  type: {
    __typename: 'type';
    typenames: {
      __typename: 'typename';
      name: string;
    }[];
  };
}

export interface PokemonDetail extends Pokemon {
  height: number;
  weight: number;
  capture_rate: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
  };
}
