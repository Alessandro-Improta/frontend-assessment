import React from 'react';
import useGetPokemonDetails from 'src/hooks/useGetPokemonDetails';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal, Card, Descriptions, Divider, Progress } from 'antd';
import PokemonListItem from 'src/components/PokemonListItem';
import { tss } from 'src/tss';
import { CloseOutlined } from '@ant-design/icons';
import ErrorState from 'src/components/ErrorState';

const PokemonDetailsModal = () => {
  const { pokemonId } = useParams<{ pokemonId: string }>();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useGetPokemonDetails(pokemonId);
  const { classes } = useStyles();
  function roundToNearestTenth(number: number) {
    return Math.round(number * 10) / 10;
  }

  function metersToFeetAndInches(meters: number) {
    const FEET_PER_METER = 3.28084;
    const INCHES_PER_FOOT = 12;
    const totalFeet = meters * FEET_PER_METER;
    const feet = Math.floor(totalFeet);
    const remainingInches = (totalFeet - feet) * INCHES_PER_FOOT;
    const inches = Math.round(remainingInches);
    return `${feet}'${inches}"`;
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
      centered
      open={!!pokemonId}
      footer={null}
      onCancel={() => navigate('/list')}
      destroyOnHidden
      className={classes.modal}
      closeIcon={<CloseOutlined className={classes.closeIcon} />}
      loading={loading}
      width="40vw"
    >
      {error ? (
        <ErrorState error={error} onRetry={refetch} compact />
      ) : (
        <>
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
                    {roundToNearestTenth(data.weight)} kg /{' '}
                    {roundToNearestTenth(data.weight * 2.20462)} lbs
                  </Descriptions.Item>
                )}
                {data?.capture_rate && (
                  <Descriptions.Item label="Capture Rate">
                    <div className={classes.captureRow}>
                      <Progress
                        percent={captureRateToPercent(data.capture_rate)}
                        size="small"
                        className={classes.progressMinWidth}
                      />
                      <span className={classes.nowrap}>
                        {captureRateToPercent(data.capture_rate)}%
                      </span>
                    </div>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>

            {data?.stats && (
              <>
                <Divider className={classes.statsDivider}>Base Stats</Divider>
                <div className={classes.statsGrid}>
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
                      <div key={key} className={classes.statRow}>
                        <div className={classes.statLabel}>{label}</div>
                        <div className={classes.statProgress}>
                          <Progress percent={percent} showInfo={false} strokeColor={strokeColor} />
                        </div>
                        <div className={classes.statValue}>{value}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

const useStyles = tss.create(({ theme }) => ({
  modal: {
    '& .ant-modal-body': {
      padding: '10px 0px 10px 0px',
    },
    height: '90vh',
    overflowY: 'auto',
  },
  closeIcon: {
    color: theme.color.text.primary,
    fontSize: '20px',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  captureRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  progressMinWidth: {
    minWidth: 160,
  },
  nowrap: {
    whiteSpace: 'nowrap',
  },
  statsDivider: {
    margin: '8px 0 12px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 8,
  },
  statRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  statLabel: {
    width: 90,
    textAlign: 'right',
  },
  statProgress: {
    flex: 1,
  },
  statValue: {
    width: 36,
    textAlign: 'left',
  },
}));

export default PokemonDetailsModal;
