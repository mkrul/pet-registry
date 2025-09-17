import { useState, useEffect } from 'react';
import { useGetUserPetsQuery } from '../redux/features/pets/petsApi';
import { PetProps } from '../types/Pet';
import { NotificationState, NotificationType } from '../types/common/Notification';

type PetFilter = 'all' | 'dog' | 'cat' | 'archived';

export const useUserPetsData = (page: number, filter: PetFilter) => {
  const [pets, setPets] = useState<PetProps[]>([]);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const speciesFilter = filter === 'all' || filter === 'archived' ? undefined : filter;
  const archivedFilter = filter === 'archived';

  const { data, isLoading, error, refetch } = useGetUserPetsQuery({
    page,
    items: 21,
    species: speciesFilter,
    archived: archivedFilter
  });

  useEffect(() => {
    if (data) {
      setPets(data.data);
    }
  }, [data]);

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

  return {
    pets,
    isLoading,
    notification,
    refetch
  };
};
