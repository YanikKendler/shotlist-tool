import { HttpLink } from "@apollo/client";
import {
    registerApolloClient,
    ApolloClient,
    InMemoryCache,
} from "@apollo/client-integration-nextjs";

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: "http://localhost:8080/graphql",
            fetchOptions: {
                // you can pass additional options that should be passed to `fetch` here,
                // e.g. Next.js-related `fetch` options regarding caching and revalidation
                // see https://nextjs.org/docs/app/api-reference/functions/fetch#fetchurl-options
            },
        }),
    });
});