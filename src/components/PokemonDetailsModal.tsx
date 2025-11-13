import React from 'react';
import useGetPokemonDetails from 'src/hooks/useGetPokemonDetails';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'antd';
import PokemonListItem from 'src/components/PokemonListItem';
import { tss } from 'src/tss';
import { CloseOutlined } from '@ant-design/icons';

const PokemonDetailsModal = () => {
  const { pokemonId } = useParams<{ pokemonId: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useGetPokemonDetails(pokemonId);
  const { classes } = useStyles();
  console.log('data: ', data);
  console.log('loading: ', loading);
  console.log('error: ', error);

  function roundToNearestTenth(number: number) {
    return Math.round(number * 10) / 10;
  }

  function metersToFeetAndInches(meters: number) {
    // Conversion factor from meters to feet
    const FEET_PER_METER = 3.28084;
    const INCHES_PER_FOOT = 12;

    // Calculate total feet
    const totalFeet = meters * FEET_PER_METER;

    // Extract whole feet
    const feet = Math.floor(totalFeet);

    // Calculate remaining inches
    const remainingInches = (totalFeet - feet) * INCHES_PER_FOOT;

    // Round inches to the nearest whole number
    const inches = Math.round(remainingInches);

    return `${feet}'-${inches}"`;
  }

  return (
    <Modal
      loading={loading}
      centered
      open={!!pokemonId}
      footer={null}
      onCancel={() => navigate('/list')}
      destroyOnHidden
      styles={{ body: { padding: '10px 0px 10px 0px' } }}
      closeIcon={<CloseOutlined className={classes.closeIcon} />}
    >
      <PokemonListItem pokemon={data} />
      <div className={classes.detailsContainer}>
        {data?.weight && (
          <span>
            Weight: {roundToNearestTenth(data.weight)}kgs/
            {roundToNearestTenth(data.weight * 2.20462)}
            lbs
          </span>
        )}
        {data?.height && (
          <span>
            Height: {data.height}m/{metersToFeetAndInches(data.height)}
          </span>
        )}
      </div>
    </Modal>
  );
};

// This is the data structure of the pokemon object
// {
//   "id": 18,
//   "name": "Pidgeot",
//   "types": [
//     "Normal",
//     "Flying"
//   ],
//   "sprite": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/18.png",
//   "height": 1.5,
//   "weight": 39.5,
//   "capture_rate": 45,
//   "stats": {
//     "hp": 83,
//     "attack": 80,
//     "defense": 75,
//     "special-attack": 70,
//     "special-defense": 70,
//     "speed": 101
//   }
// }

const useStyles = tss.create(({ theme }) => ({
  closeIcon: {
    color: theme.color.text.primary,
    fontSize: '20px',
  },
  detailsContainer: {},
}));

export default PokemonDetailsModal;
