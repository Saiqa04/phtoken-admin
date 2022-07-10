import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { BrowserRouter as Router  } from "react-router-dom";
import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import { offsetLimitPagination } from '@apollo/client/utilities';
import { ChainContextProvider } from "./context/ChainContext";

  const production = "production";
  const development = "development";

  if(process.env.NODE_ENV === development){
    var client = new ApolloClient({
      uri: 'http://localhost:5000/api/graphql',
      cache: new InMemoryCache({
        typePolicies: {
          Coin: {
            keyFields: ["CoinID"]
          },
          Query: {
            fields: {
              Coins: offsetLimitPagination()
            }
          }
        }
      })
    });
  }

  if(process.env.NODE_ENV === production){
    var client = new ApolloClient({
      uri: 'https://racoins.cc/api/graphql',
      cache: new InMemoryCache({
        typePolicies: {
          Coin: {
            keyFields: ["CoinID"]
          },
          Query: {
            fields: {
              Coins: offsetLimitPagination()
            }
          }
        }
      })
    });
  }

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <ApolloProvider client={client}>
        <ChainContextProvider>
          <Router>
              <App />
          </Router>
        </ChainContextProvider>
    </ApolloProvider>
)


if (module.hot) {
  module.hot.accept();
}