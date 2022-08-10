/*
 * Copyright (c) 2022, Salesforce, Inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import {ShopperLoginTypes} from 'commerce-sdk-isomorphic'
import {useState} from 'react'
import useAuth from './useAuth'
import {ActionResponse} from './types'
import {useQuery, UseQueryOptions} from '@tanstack/react-query'

export const useAsync = <T>(
    queryKey: unknown[],
    fn: (tokenResponse: ShopperLoginTypes.TokenResponse) => Promise<T>,
    queryOptions?: UseQueryOptions<T, Error>
) => {
    const auth = useAuth()
    const authenticatedFn = () => auth.ready().then(fn)
    return useQuery<T, Error>(queryKey, authenticatedFn, queryOptions)
}

export const useAsyncCallback = <Args extends unknown[], Ret>(
    fn: (...args: Args) => Promise<Ret>
) => {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState<Ret | undefined>(undefined)
    const [error, setError] = useState<Error | undefined>(undefined)
    const result: ActionResponse<Args, Ret> = {
        data,
        error,
        isLoading,
        execute: (...arg) => {
            setIsLoading(true)
            fn(...arg)
                .then((data) => setData(data))
                .catch((error: Error) => setError(error))
                .finally(() => setIsLoading(false))
        }
    }
    return result
}
