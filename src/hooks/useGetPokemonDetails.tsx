import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { PokemonDetail, PokemonType } from 'src/types/pokemon.types';

export const GET_POKEMON_DETAILS = gql`
  query GetPokemonDetails($id: Int!) {
    pokemon(where: { id: { _eq: $id } }) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
        capture_rate
      }
      pokemonsprites {
        sprites(path: "other.official-artwork.front_default")
      }
      pokemontypes {
        type {
          typenames(where: { language: { name: { _eq: "en" } } }) {
            name
          }
        }
      }
      weight
      height
      pokemonstats {
        base_stat
        stat {
          name
        }
      }
    }
  }
`;

export const useGetPokemonDetails = (
  id: number,
): {
  data: PokemonDetail;
  loading: boolean;
  error: useQuery.Result['error'];
} => {
  const { data, loading, error } = useQuery<{ pokemon: any }>(GET_POKEMON_DETAILS, {
    variables: {
      id,
    },
  });

  const pokemon = data?.pokemon?.[0];

  return {
    data: {
      id: pokemon?.id,
      name: pokemon?.pokemonspecy.pokemonspeciesnames?.[0]?.name,
      types: pokemon?.pokemontypes?.map((t: PokemonType) => t.type?.typenames?.[0]?.name),
      sprite: pokemon?.pokemonsprites?.[0]?.sprites,
      height: pokemon?.height,
      weight: pokemon?.weight,
      capture_rate: pokemon?.pokemonspecy.capture_rate,
      stats: pokemon?.pokemonstats?.reduce(
        (
          accumulator: {
            hp: number;
            attack: number;
            defense: number;
            special_attack: number;
            special_defense: number;
            speed: number;
          },
          stat: {
            base_stat: number;
            stat: {
              name: string;
              __typename: 'stat';
            };
          },
        ) => ({
          ...accumulator,
          [stat.stat.name]: stat.base_stat,
        }),
        {},
      ),
    },
    loading,
    error,
  };
};
