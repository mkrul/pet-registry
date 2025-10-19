import { useState, useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';

const useFlyerGeneration = (reportId) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rewardAmount, setRewardAmount] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const flyerRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: flyerRef,
    documentTitle: `Lost Pets Registry - https://www.lostpetsregistry.com/reports/${reportId}`,
  });

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setIsGenerating(false);
  }, []);

  const closeModal = useCallback(() => {
    if (!isGenerating) {
      setIsModalOpen(false);
    }
  }, [isGenerating]);

  const handleGenerateFlyer = useCallback(({ rewardAmount: reward, description: customDesc }) => {
    console.log('handleGenerateFlyer called with:', { reward, customDesc });
    setRewardAmount(reward);
    setCustomDescription(customDesc);
    setIsGenerating(true);

    setTimeout(async () => {
      const startTime = Date.now();
      console.log('About to trigger print, flyerRef:', flyerRef.current);
      if (flyerRef.current) {
        try {
          console.log('Print dialog opened');
          await handlePrint();
          console.log('Print dialog closed');

          const elapsed = Date.now() - startTime;
          const minimumWait = 3000;
          const remainingTime = Math.max(0, minimumWait - elapsed);

          await new Promise(resolve => setTimeout(resolve, remainingTime));

          setRewardAmount('');
          setCustomDescription('');
          setIsGenerating(false);
        } catch (error) {
          console.error('Error calling handlePrint:', error);
          const elapsed = Date.now() - startTime;
          const minimumWait = 3000;
          const remainingTime = Math.max(0, minimumWait - elapsed);

          await new Promise(resolve => setTimeout(resolve, remainingTime));
          setIsGenerating(false);
        }
      } else {
        console.error('Flyer ref is not available');
        await new Promise(resolve => setTimeout(resolve, 3000));
        setIsGenerating(false);
      }
    }, 100);
  }, [handlePrint]);

  return {
    isModalOpen,
    isGenerating,
    openModal,
    closeModal,
    handleGenerateFlyer,
    flyerRef,
    rewardAmount,
    customDescription,
  };
};

export default useFlyerGeneration;