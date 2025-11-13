import React from 'react';
import { act, fireEvent, waitFor, render } from 'src/test-utils';
import { PokemonListPage } from './PokemonListPage';
import { useNavigate } from 'react-router-dom';

jest.mock('src/hooks/useDebounce', () => ({
  __esModule: true,
  default: (value: any) => value,
}));

jest.mock('src/hooks/useGetPokemon', () => ({
  useGetPokemon: jest.fn((search: string) => {
    const lowerCaseSearch = (search || '').toLowerCase();
    if (!lowerCaseSearch) {
      return {
        data: [{ id: '1', name: 'Bulbasaur' }],
        loading: false,
        error: null,
        count: 1,
        refetch: jest.fn(),
      };
    }
    if (lowerCaseSearch.includes('charmander')) {
      return {
        data: [{ id: '4', name: 'Charmander' }],
        loading: false,
        error: null,
        count: 1,
        refetch: jest.fn(),
      };
    }
    return { data: [], loading: false, error: null, count: 0, refetch: jest.fn() };
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('PokemonListPage', () => {
  test('it renders', () => {
    const { getByText } = render(<PokemonListPage />);
    getByText('Bulbasaur');
  });

  test('clicking on a pokemon calls navigate', async () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    const { getByText, user } = render(<PokemonListPage />);

    await act(async () => {
      await user.click(getByText('Bulbasaur'));
    });

    expect(mockNavigate).toHaveBeenCalledWith('details/1');
  });

  test('typing in the search bar filters the results', async () => {
    const { container, getByText, queryByText } = render(<PokemonListPage />);
    const input = container.querySelector('#searchInput') as HTMLInputElement;

    expect(getByText('Bulbasaur')).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'charmander' } });

    await waitFor(() => {
      expect(getByText('Charmander')).toBeInTheDocument();
    });

    expect(queryByText('Bulbasaur')).not.toBeInTheDocument();
  });
});
