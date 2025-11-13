import React from 'react';
import useGetPokemonDetails from 'src/hooks/useGetPokemonDetails';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, Card, Descriptions, Divider, Progress, Tooltip } from 'antd';
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

  function captureRateToPercent(rate?: number | null) {
    if (rate === null || rate === undefined) return undefined;
    return Math.round((rate / 255) * 100);
  }

  const STAT_LABELS: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed',
  };

  const MAX_STAT = 255;

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
        <Card size="small">
          <Descriptions size="small" column={1} colon>
            {data?.height && (
              <Descriptions.Item label="Height">
                {data.height} m / {metersToFeetAndInches(data.height)}
              </Descriptions.Item>
            )}
            {data?.weight && (
              <Descriptions.Item label="Weight">
                {roundToNearestTenth(data.weight)} kg / {roundToNearestTenth(data.weight * 2.20462)}{' '}
                lbs
              </Descriptions.Item>
            )}
            {data?.capture_rate && (
              <Descriptions.Item label="Capture Rate">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Tooltip title="Game scale is 0–255; we also show it as a percentage.">
                    <Progress
                      percent={captureRateToPercent(data.capture_rate)}
                      size="small"
                      style={{ minWidth: 160 }}
                    />
                  </Tooltip>
                  <span style={{ whiteSpace: 'nowrap' }}>{data.capture_rate} / 255</span>
                </div>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {data?.stats && (
          <>
            <Divider style={{ margin: '8px 0 12px' }}>Base Stats</Divider>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
              {Object.entries(data.stats).map(([key, value]) => {
                const label = STAT_LABELS[key] ?? key;
                const percent = Math.round((value / MAX_STAT) * 100);
                let strokeColor: string;
                if (value >= 120) {
                  strokeColor = '#52c41a';
                } else if (value >= 80) {
                  strokeColor = '#faad14';
                } else {
                  strokeColor = '#ff4d4f';
                }

                return (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 90, textAlign: 'right' }}>{label}</div>
                    <div style={{ flex: 1 }}>
                      <Progress percent={percent} showInfo={false} strokeColor={strokeColor} />
                    </div>
                    <div style={{ width: 36, textAlign: 'left' }}>{value}</div>
                  </div>
                );
              })}
            </div>
          </>
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
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
}));

export default PokemonDetailsModal;
