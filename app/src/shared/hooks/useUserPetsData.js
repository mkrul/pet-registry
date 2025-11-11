import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetUserPetsQuery } from '../../store/features/pets/petsApi.js';
import { addNotification } from '../../store/features/notifications/notificationsSlice.js';

export const useUserPetsData = (page, filter, preloadAll = false) => {
  const dispatch = useDispatch();

  const speciesFilter = filter === 'all' || filter === 'archived' ? undefined : filter;
  const archivedFilter = filter === 'archived';

  const { data, isLoading, error, refetch } = useGetUserPetsQuery({
    page,
    items: 21,
    species: speciesFilter,
    archived: archivedFilter
  }, {
    refetchOnMountOrArgChange: false
  });

  const { data: allData, isLoading: isLoadingAll } = useGetUserPetsQuery({
    page: 1,
    items: 21,
    species: undefined,
    archived: false
  }, {
    refetchOnMountOrArgChange: false,
    skip: !preloadAll || filter === 'all'
  });

  const { data: dogData, isLoading: isLoadingDogs } = useGetUserPetsQuery({
    page: 1,
    items: 21,
    species: 'dog',
    archived: false
  }, {
    refetchOnMountOrArgChange: false,
    skip: !preloadAll || filter === 'dog'
  });

  const { data: catData, isLoading: isLoadingCats } = useGetUserPetsQuery({
    page: 1,
    items: 21,
    species: 'cat',
    archived: false
  }, {
    refetchOnMountOrArgChange: false,
    skip: !preloadAll || filter === 'cat'
  });

  const { data: archivedData, isLoading: isLoadingArchived } = useGetUserPetsQuery({
    page: 1,
    items: 21,
    species: undefined,
    archived: true
  }, {
    refetchOnMountOrArgChange: false,
    skip: !preloadAll || filter === 'archived'
  });

  useEffect(() => {
    if (error) {
      dispatch(addNotification({
        type: 'ERROR',
        message: 'Failed to load pets. Please try again.'
      }));
    }
  }, [error, dispatch]);

  const isPreloading = preloadAll && (isLoadingAll || isLoadingDogs || isLoadingCats || isLoadingArchived);

  return {
    pets: data?.data || [],
    isLoading,
    isPreloading,
    refetch
  };
};
