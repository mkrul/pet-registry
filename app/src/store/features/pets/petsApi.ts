import { transformToCamelCase } from "../../../shared/apiHelpers";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PetProps, GetPetsResponse, UpdatePetResponse } from "../../../shared/types/Pet";
import { PaginationPropsQuery } from "../../../shared/types/common/Pagination";

export const petsApi = createApi({
  reducerPath: "petsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    credentials: "same-origin"
  }),
  tagTypes: ["Pets"],
  endpoints: build => ({
    getPet: build.query<PetProps, number>({
      query: id => `pets/${id}`,
      transformResponse: (response: PetProps) => transformToCamelCase(response),
      providesTags: (result, error, id) => [{ type: "Pets", id: id }]
    }),
    getPets: build.query<GetPetsResponse, PaginationPropsQuery>({
      query: params => {
        const queryParams: Record<string, string> = {
          page: params.page?.toString() || "1",
          per_page: params.items?.toString() || "21"
        };

        if (params.species) {
          queryParams.species = params.species;
        }

        const queryString = new URLSearchParams(queryParams).toString();

        return {
          url: `pets?${queryString}`,
          method: "GET"
        };
      },
      transformResponse: (response: GetPetsResponse) => {
        const pets = response.data.map(pet => transformToCamelCase(pet));
        const pagination = transformToCamelCase(response.pagination);
        return { data: pets, pagination, message: response.message };
      },
      keepUnusedDataFor: 30,
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Pets" as const, id })),
              { type: "Pets", id: "LIST" }
            ]
          : [{ type: "Pets", id: "LIST" }]
    }),
    updatePet: build.mutation<UpdatePetResponse, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `pets/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Pets", id },
        { type: "Pets", id: "LIST" }
      ]
    }),
    deletePet: build.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `pets/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Pets", id },
        { type: "Pets", id: "LIST" },
        { type: "Pets", id: "USER_LIST" }
      ]
    }),
    archivePet: build.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `pets/${id}/archive`,
        method: "PATCH"
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Pets", id },
        { type: "Pets", id: "LIST" },
        { type: "Pets", id: "USER_LIST" }
      ]
    }),
    submitPet: build.mutation<{ message: string; id: number } & PetProps, FormData>({
      query: formData => ({
        url: "pets",
        method: "POST",
        body: formData
      }),
      transformResponse: (
        response: { message: string; id: number } & PetProps
      ) => {
        const transformedPet = transformToCamelCase(response);
        return {
          ...transformedPet,
          message: response.message,
          pet: transformedPet,
          id: response.id,
          data: transformedPet
        };
      },
      invalidatesTags: ["Pets"]
    }),
    getNewPet: build.query<PetProps, void>({
      query: () => "pets/new",
      providesTags: ["Pets"]
    }),
    getUserPets: build.query<GetPetsResponse, PaginationPropsQuery>({
      query: params => {
        const queryParams: Record<string, string> = {
          page: params.page?.toString() || "1",
          per_page: params.items?.toString() || "21"
        };

        if (params.species) {
          queryParams.species = params.species;
        }

        if (params.archived) {
          queryParams.archived = params.archived.toString();
        }

        const queryString = new URLSearchParams(queryParams).toString();

        return {
          url: `users/pets?${queryString}`,
          method: "GET"
        };
      },
      transformResponse: (response: GetPetsResponse) => {
        const pets = response.data.map(pet => transformToCamelCase(pet));
        const pagination = transformToCamelCase(response.pagination);
        return { data: pets, pagination, message: response.message };
      },
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Pets" as const, id })),
              { type: "Pets", id: "USER_LIST" }
            ]
          : [{ type: "Pets", id: "USER_LIST" }]
    })
  })
});

export const {
  useGetPetQuery,
  useGetPetsQuery,
  useSubmitPetMutation,
  useGetNewPetQuery,
  useUpdatePetMutation,
  useDeletePetMutation,
  useArchivePetMutation,
  useGetUserPetsQuery
} = petsApi;
export default petsApi;
