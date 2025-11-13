import { createTss } from 'tss-react';

function useContext() {
  const theme = {
    color: {
      surface: '#000E1C',
      secondary: '#001529',
      text: {
        primary: '#FAFAFA',
      },
      tertiary: '#295983',
      Normal: '#B7B7A8',
      Fire: '#FD7D24',
      Water: '#4592C4',
      Grass: '#9BCC50',
      Electric: '#F7D02C',
      Ice: '#96D9D6',
      Fighting: '#C22E28',
      Poison: '#B97FC9',
      Ground: '#DEB887',
      Flying: '#9AA8FF',
      Psychic: '#F95587',
      Bug: '#B7C543',
      Rock: '#BBAA66',
      Ghost: '#735797',
      Dragon: '#6F35FC',
      Dark: '#775544',
      Steel: '#B7B7CE',
      Fairy: '#F4B9D0',
    },
  };

  return { theme };
}

export const { tss } = createTss({ useContext });

export const useStyles = tss.create({});
