import React, { useState } from 'react';
import ConfirmationModal from '../../../shared/components/common/ConfirmationModal.jsx';

const MessageText = ({ text }) => {
  const [showModal, setShowModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState(null);

  const isExternalUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const currentHostname = window.location.hostname;
      return urlObj.hostname !== currentHostname;
    } catch {
      return false;
    }
  };

  const handleLinkClick = (url, e) => {
    e.preventDefault();

    if (isExternalUrl(url)) {
      setPendingUrl(url);
      setShowModal(true);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleConfirmOpen = () => {
    if (pendingUrl) {
      window.open(pendingUrl, '_blank', 'noopener,noreferrer');
    }
    setShowModal(false);
    setPendingUrl(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPendingUrl(null);
  };

  const parseUrls = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'url', content: match[0] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  const parseMessage = (text) => {
    const googleMapsPattern = /🗺️📍\s*Location:\s*\n?\s*(https?:\/\/www\.google\.com\/maps\?q=([\d.-]+),([\d.-]+))/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = googleMapsPattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const beforeText = text.slice(lastIndex, match.index);
        parts.push(...parseUrls(beforeText));
      }
      const latitude = match[2];
      const longitude = match[3];
      const mapsUrl = match[1];
      parts.push({
        type: 'googleMaps',
        url: mapsUrl,
        latitude,
        longitude
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      parts.push(...parseUrls(remainingText));
    }

    return parts.length > 0 ? parts : parseUrls(text);
  };

  const parts = parseMessage(text);

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'googleMaps') {
          return (
            <a
              key={index}
              href={part.url}
              onClick={(e) => handleLinkClick(part.url, e)}
              className="text-blue-600 hover:text-blue-800 underline cursor-pointer inline-block"
            >
              🗺️📍 View on Google Maps
            </a>
          );
        }
        if (part.type === 'url') {
          return (
            <a
              key={index}
              href={part.content}
              onClick={(e) => handleLinkClick(part.content, e)}
              className="text-blue-600 hover:text-blue-800 underline break-all cursor-pointer"
            >
              {part.content}
            </a>
          );
        }
        return <span key={index}>{part.content}</span>;
      })}

      <ConfirmationModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmOpen}
        title="You are about to open an external link."
        message={`If the link you clicked is not from a trusted source, it may contain potential security risks. \n\nAre you sure you want to open it?`}
        confirmText="Continue"
        cancelText="Cancel"
        confirmButtonColor="blue"
      />
    </>
  );
};

export default MessageText;

