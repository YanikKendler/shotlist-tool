"use client";

import { HttpLink } from "@apollo/client";
import {
    ApolloNextAppProvider,
    ApolloClient,
    InMemoryCache,
} from "@apollo/client-integration-nextjs";
import auth from "@/Auth"
import {setContext} from "@apollo/client/link/context"

export function makeClient() {
    const httpLink = new HttpLink({
        uri: "http://localhost:8080/graphql",
        fetchOptions: {
            // you can pass additional options that should be passed to `fetch` here,
            // e.g. Next.js-related `fetch` options regarding caching and revalidation
            // see https://nextjs.org/docs/app/api-reference/functions/fetch#fetchurl-options
        },
        // you can override the default `fetchOptions` on a per query basis
        // via the `context` property on the options passed as a second argument
        // to an Apollo Client data fetching hook, e.g.:
        // const { data } = useSuspenseQuery(MY_QUERY, { context: { fetchOptions: { ... }}});
    });

    /*return new ApolloClient({
        cache: new InMemoryCache(),
        link: httpLink,
    });*/

    const authLink = setContext(async (_, {headers}) => {
        const token = await auth.getTokenSilently();
        console.log(token)
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "",
            }
        }
    })

    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache()
    })
}

export const apolloClient = makeClient();

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
    return (
        <ApolloNextAppProvider makeClient={makeClient}>
            {children}
        </ApolloNextAppProvider>
    );
}