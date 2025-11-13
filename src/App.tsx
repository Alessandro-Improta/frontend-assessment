import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PokemonListPage } from './screens/PokemonListPage';
import { LayoutWrapper } from './LayoutWrapper';
import { ApolloProvider } from '@apollo/client/react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { HomePage } from './screens/HomePage';
import { ConfigProvider } from 'antd';
import { tss } from 'src/tss';
import PokemonDetailsModal from 'src/components/PokemonDetailsModal';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graphql.pokeapi.co/v1beta2',
  }),
  cache: new InMemoryCache(),
});

const App = () => {
  const { theme } = useStyles();
  const antDTheme = {
    token: {
      colorText: theme.color.text.primary,
      colorBgTextHover: theme.color.tertiary,
      colorTextDisabled: theme.color.text.primary,
      colorTextPlaceholder: theme.color.text.primary,
      colorPrimaryActive: theme.color.surface,
    },
    components: {
      Pagination: {
        itemActiveBg: theme.color.tertiary,
        itemActiveColor: theme.color.text.primary,
        itemBg: theme.color.secondary,
        itemLinkBg: theme.color.text.primary,
      },
      Input: {
        color: theme.color.text.primary,
        activeBg: theme.color.secondary,
        activeBorderColor: theme.color.tertiary,
        hoverBg: theme.color.tertiary,
        hoverBorderColor: theme.color.tertiary,
        colorBgContainer: theme.color.surface,
        colorBorder: theme.color.tertiary,
      },
      Modal: {
        headerBg: theme.color.secondary,
        contentBg: theme.color.secondary,
        footerBg: theme.color.secondary,
      },
      Descriptions: {
        labelColor: theme.color.secondary,
        contentColor: theme.color.secondary,
      },
    },
  };
  return (
    <ApolloProvider client={client}>
      <ConfigProvider theme={antDTheme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LayoutWrapper />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/list" element={<PokemonListPage />}>
                <Route path="details/:pokemonId" element={<PokemonDetailsModal />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </ApolloProvider>
  );
};

const useStyles = tss.create(() => ({}));

export default App;
