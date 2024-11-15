import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TCreateWeatherRecord, TWeatherRecord } from '../types';

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery(),
    tagTypes: ['weather'],
    endpoints: (builder) => ({
        addWeatherRecord: builder.mutation<TWeatherRecord, Partial<TCreateWeatherRecord>>({
            query: (record: TCreateWeatherRecord) => ({
                url: '/records',
                method: 'POST',
                body: record
            }),
            invalidatesTags: ['weather']
        }),
        getWeatherRecords: builder.query<TWeatherRecord[], void>({
            query: () => "/records",
            transformResponse: (response: TWeatherRecord[]) => {
                const filtered = response.filter((r) => r.id <= 10);
                return filtered.sort((a, b) => b.id - a.id);
            },
            providesTags: ['weather'],
        }),
        deleteWeatherRecord: builder.mutation<{ success: boolean; id: number }, number>({
            query: (id: number) => ({
                url: `/records/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['weather']
        }),
        getAuthors: builder.query<string[], void>({
            query: () => "/authors",
        })
    }),
});

export const {
    useAddWeatherRecordMutation,
    useGetWeatherRecordsQuery,
    useDeleteWeatherRecordMutation,
    useGetAuthorsQuery
} = apiSlice;