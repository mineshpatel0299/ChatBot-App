// lib/graphql/serverClient.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core"
import fetch from "cross-fetch"

export const serverApolloClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NHOST_GRAPHQL_URL, // your GraphQL endpoint
    fetch,
    headers: {
      "x-hasura-admin-secret": process.env.NHOST_ADMIN_SECRET || "",
    },
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "no-cache" },
    query: { fetchPolicy: "no-cache" },
  },
})