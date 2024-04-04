import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject} from '@apollo/client';
import {useMemo} from 'react';

let apolloClient: ApolloClient<NormalizedCacheObject>;

function createApolloClient() {
    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: new HttpLink({
            uri: `https://analytics.linkb.org/api`, // Server URL (must be absolute)
            credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
            headers: {
                "Authorization": `Bearer 2555755b-42f9-41b7-a37e-bb8f06e8a761`
            },
            fetch,
        }),
        cache: new InMemoryCache(),
    });
}

export function initializeApollo(initialState = {}) {
    const _apolloClient = apolloClient ?? createApolloClient();

    // If your page has Next.js data fetching methods that use Apollo Client, the initial state
    // get hydrated here
    if (initialState) {
        const existingCache = _apolloClient.extract();

        _apolloClient.cache.restore({ ...existingCache, ...initialState });
    }

    // For SSG and SSR always create a new Apollo Client
    if (typeof window === 'undefined') return _apolloClient;

    // Create the Apollo Client once in the client
    if (!apolloClient) apolloClient = _apolloClient;

    return _apolloClient;
}

export function useApollo(initialState: any) {
    return useMemo(() => initializeApollo(initialState), [initialState]);
}
