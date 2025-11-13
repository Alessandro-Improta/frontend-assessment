import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Pokemon, PokemonType } from 'src/types/pokemon.types';

export const GET_POKEMON = gql`
  query GetPokemon($search: String, $offset: Int) {
    pokemon(
      order_by: { id: asc }
      limit: 20
      offset: $offset
      where: {
        _and: [
          {
            id: { _lte: 151 }
            pokemonspecy: {
              pokemonspeciesnames: { language: { name: { _eq: "en" } }, name: { _iregex: $search } }
            }
          }
        ]
      }
    ) {
      id
      pokemonspecy {
        pokemonspeciesnames(where: { language: { name: { _eq: "en" } } }) {
          name
        }
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
    }
    pokemon_aggregate(
      where: {
        _and: [
          {
            id: { _lte: 151 }
            pokemonspecy: {
              pokemonspeciesnames: { language: { name: { _eq: "en" } }, name: { _iregex: $search } }
            }
          }
        ]
      }
    ) {
      aggregate {
        count
      }
    }
  }
`;

// Search should be done client-side for the mid-level assessment. Uncomment for the senior assessment.
export const useGetPokemon = (
  search?: string,
  offset?: number,
): {
  data: Pokemon[];
  loading: boolean;
  error: useQuery.Result['error'];
  count: number | undefined;
} => {
  const { data, loading, error } = useQuery<{
    pokemon: any[];
    pokemon_aggregate: { aggregate: { count: number } };
  }>(GET_POKEMON, {
    variables: {
      search,
      offset,
    },
  });

  return {
    data:
      data?.pokemon?.map(
        (p): Pokemon => ({
          id: p.id,
          name: p.pokemonspecy.pokemonspeciesnames?.[0]?.name,
          types: p.pokemontypes?.map((t: PokemonType) => t.type?.typenames?.[0]?.name),
          sprite: p.pokemonsprites?.[0]?.sprites,
        }),
      ) ?? [],
    loading,
    error,
    count: data?.pokemon_aggregate?.aggregate?.count,
  };
};

export default useGetPokemon;
