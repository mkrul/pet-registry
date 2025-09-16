import { useState, useEffect } from 'react';
import { useGetUserPetsQuery } from '../redux/features/pets/petsApi';
import { PetProps } from '../types/Pet';
import { NotificationState, NotificationType } from '../types/common/Notification';

type PetFilter = 'all' | 'dog' | 'cat';

export const useUserPetsData = (page: number, filter: PetFilter) => {
  const [pets, setPets] = useState<PetProps[]>([]);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const speciesFilter = filter === 'all' ? undefined : filter;

  const { data, isLoading, error, refetch } = useGetUserPetsQuery({
    page,
    items: 21,
    species: speciesFilter
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
