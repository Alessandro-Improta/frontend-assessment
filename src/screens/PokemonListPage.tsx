import React, { useEffect, useState } from 'react';
import { tss } from '../tss';
import useGetPokemon from 'src/hooks/useGetPokemon';
import useDebounce from 'src/hooks/useDebounce';
import { Pokemon } from 'src/types/pokemon.types';
import { Button, Input, Pagination } from 'antd';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import PokemonListItem from 'src/components/PokemonListItem';
import ErrorState from 'src/components/ErrorState';

export const PokemonListPage = () => {
  const { classes, theme } = useStyles();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [offset, setOffset] = useState(0);
  const { data, loading, error, count, refetch } = useGetPokemon(debouncedSearch, offset);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
    setOffset(0);
  }, [debouncedSearch]);

  return (
    <div className={classes.root}>
      <h1>Pokédex</h1>
      <div className={classes.header}>
        <div className={classes.search}>
          <Input.Search
            placeholder="Search Pokemon"
            onChange={(e) => setSearch(e.target.value)}
            loading={loading}
            enterButton={
              <Button
                style={{
                  cursor: 'default',
                  backgroundColor: theme.color.secondary,
                  borderColor: theme.color.tertiary,
                }}
                type="primary"
                icon={loading ? <LoadingOutlined /> : <SearchOutlined />}
              />
            }
            allowClear
            size="large"
            value={search}
          />
        </div>
        <Pagination
          size="default"
          align="end"
          defaultCurrent={1}
          current={currentPage}
          total={count ?? 0}
          pageSize={20}
          pageSizeOptions={[]}
          hideOnSinglePage
          showLessItems
          showSizeChanger={false}
          showTotal={() => `Showing ${count ?? 0} results`}
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setOffset((page - 1) * pageSize);
          }}
        />
      </div>
      {data.length ? (
        <ul className={classes.list}>
          {data?.map((d: Pokemon) => (
            <li key={d.id}>
              <PokemonListItem pokemon={d} shouldNavigate />
            </li>
          ))}
        </ul>
      ) : (
        <>
          {error && <ErrorState error={error} onRetry={refetch} />}
          {loading && <div>Loading...</div>}
          {count === 0 && <div>No results found</div>}
        </>
      )}
      <div>
        <Pagination
          size="default"
          align="center"
          defaultCurrent={1}
          current={currentPage}
          total={count ?? 0}
          pageSize={20}
          pageSizeOptions={[]}
          hideOnSinglePage
          showLessItems
          showSizeChanger={false}
          showTotal={() => `Showing ${count ?? 0} results`}
          onChange={(page, pageSize) => {
            setCurrentPage(page);
            setOffset((page - 1) * pageSize);
          }}
        />
      </div>
      <Outlet />
    </div>
  );
};

const useStyles = tss.create(({ theme }) => ({
  root: {
    color: theme.color.text.primary,
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '200px',
  },
  search: {
    maxWidth: '35%',
  },
  list: {
    display: 'grid',
    gap: '20px',
    listStyle: 'none',
    padding: '0',
    margin: '0',
    gridTemplateColumns: 'repeat(1, 1fr)',
    [`@media (min-width: 500px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [`@media (min-width: 700px)`]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [`@media (min-width: 900px)`]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    [`@media (min-width: 1500px)`]: {
      gridTemplateColumns: 'repeat(5, 1fr)',
    },
    [`@media (min-width: 1900px)`]: {
      gridTemplateColumns: 'repeat(6, 1fr)',
    },
    [`@media (min-width: 2300px)`]: {
      gridTemplateColumns: 'repeat(7, 1fr)',
    },
    [`@media (min-width: 2600px)`]: {
      gridTemplateColumns: 'repeat(8, 1fr)',
    },
    [`@media (min-width: 2900px)`]: {
      gridTemplateColumns: 'repeat(9, 1fr)',
    },
    [`@media (min-width: 3200px)`]: {
      gridTemplateColumns: 'repeat(10, 1fr)',
    },
  },
}));
