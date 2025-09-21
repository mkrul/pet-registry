import { useState, useEffect } from 'react';
import { useGetUserPetsQuery } from '../../store/features/pets/petsApi';
import { PetProps } from '../../features/pets/types/Pet';
import { NotificationState, NotificationType } from '../types/common/Notification';

type PetFilter = 'all' | 'dog' | 'cat' | 'archived';

export const useUserPetsData = (page: number, filter: PetFilter, preloadAll: boolean = false) => {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const speciesFilter = filter === 'all' || filter === 'archived' ? undefined : filter;
  const archivedFilter = filter === 'archived';

  const { data, isLoading, error, refetch } = useGetUserPetsQuery({
    page,
    items: 21,
    species: speciesFilter,
    archived: archivedFilter
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
      setNotification({
        type: NotificationType.ERROR,
        message: 'Failed to load pets. Please try again.'
      });
    } else {
      setNotification(null);
    }
  }, [error]);

  const isPreloading = preloadAll && (isLoadingAll || isLoadingDogs || isLoadingCats || isLoadingArchived);

  return {
    pets: data?.data || [],
    isLoading,
    isPreloading,
    notification,
    refetch
  };
};
