import { useState, useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';

const useFlyerGeneration = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rewardAmount, setRewardAmount] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const flyerRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: flyerRef,
    documentTitle: 'Lost Pet Flyer',
    onAfterPrint: () => {
      setRewardAmount('');
      setAdditionalNotes('');
    },
  });

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleGenerateFlyer = useCallback(({ rewardAmount: reward, additionalNotes: notes }) => {
    setRewardAmount(reward);
    setAdditionalNotes(notes);
    setIsModalOpen(false);

    setTimeout(() => {
      handlePrint();
    }, 100);
  }, [handlePrint]);

  return {
    isModalOpen,
    openModal,
    closeModal,
    handleGenerateFlyer,
    flyerRef,
    rewardAmount,
    additionalNotes,
  };
};

export default useFlyerGeneration;

