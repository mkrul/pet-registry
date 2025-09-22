import { transformToCamelCase } from "../../../shared/apiHelpers.js";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const petsApi = createApi({
  reducerPath: "petsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    credentials: "same-origin"
  }),
  tagTypes: ["Pets"],
  endpoints: build => ({
    getPet: build.query({
      query: id => `pets/${id}`,
      transformResponse: (response) => transformToCamelCase(response),
      providesTags: (result, error, id) => [{ type: "Pets", id: id }]
    }),
    getPets: build.query({
      query: params => {
        const queryParams = {
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
      transformResponse: (response) => {
        const pets = response.data.map(pet => transformToCamelCase(pet));
        const pagination = transformToCamelCase(response.pagination);
        return { data: pets, pagination };
      },
      keepUnusedDataFor: 30,
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Pets" , id })),
              { type: "Pets", id: "LIST" }
            ]
          : [{ type: "Pets", id: "LIST" }]
    }),
    updatePet: build.mutation({
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
    deletePet: build.mutation({
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
    archivePet: build.mutation({
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
    submitPet: build.mutation({
      query: formData => ({
        url: "pets",
        method: "POST",
        body: formData
      }),
      transformResponse: (
        response
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
    getNewPet: build.query({
      query: () => "pets/new",
      providesTags: ["Pets"]
    }),
    getUserPets: build.query({
      query: params => {
        const queryParams = {
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
      transformResponse: (response) => {
        const pets = response.data.map(pet => transformToCamelCase(pet));
        const pagination = transformToCamelCase(response.pagination);
        return { data: pets, pagination };
      },
      providesTags: result =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Pets" , id })),
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
