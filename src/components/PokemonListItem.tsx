import { Pokemon } from 'src/types/pokemon.types';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { tss } from 'src/tss';

const PokemonListItem = ({
  pokemon,
  shouldNavigate = false,
}: {
  pokemon: Pokemon;
  shouldNavigate?: boolean;
}) => {
  const navigate = useNavigate();
  const { classes, theme, cx, css } = useStyles();
  return (
    <div
      className={classes.listItem}
      onClick={() => shouldNavigate && navigate(`details/${pokemon.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (shouldNavigate) {
            navigate(`details/${pokemon.id}`);
          }
        }
      }}
      role="button"
      tabIndex={0}
    >
      <span className={classes.id}>#{pokemon.id}</span>
      <img className={classes.image} src={pokemon.sprite} alt={pokemon.name} />
      <span className={classes.name}>{pokemon.name}</span>
      <div className={classes.typesSection}>
        {pokemon.types?.map((type) => (
          <span
            key={type}
            className={cx(classes.type, css({ backgroundColor: theme.color[type] }))}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PokemonListItem;

PokemonListItem.defaultProps = {
  shouldNavigate: false,
};

const useStyles = tss.create(({ theme }) => ({
  listItem: {
    backgroundColor: theme.color.secondary,
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer',
  },
  id: {
    alignSelf: 'flex-end',
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  name: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
  },
  image: {
    width: '75%',
  },
  typesSection: {
    display: 'flex',
    gap: '10px',
  },
  type: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textShadow: '1px 1px 2px rgba(0, 0, 0, .4)',
  },
}));
