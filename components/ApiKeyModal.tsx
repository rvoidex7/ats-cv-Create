import React from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = () => {
  // This component is intentionally left blank.
  // API keys must be configured via environment variables (process.env.API_KEY)
  // and should not be managed through the UI.
  return null;
};

export default ApiKeyModal;
