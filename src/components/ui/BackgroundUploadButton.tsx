import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface BackgroundUploadButtonProps {
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  hasBackground: boolean;
}

const BackgroundUploadButton: React.FC<BackgroundUploadButtonProps> = ({ 
  onImageSelect, 
  onImageRemove,
  hasBackground 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="background-buttons">
      <button
        className="background-upload-button"
        onClick={handleClick}
        title="Alterar imagem de fundo"
      >
        <Upload size={20} />
        <span>Alterar fundo</span>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </button>
      
      {hasBackground && (
        <button
          className="background-remove-button"
          onClick={onImageRemove}
          title="Remover imagem de fundo"
        >
          <X size={20} />
          <span>Remover fundo</span>
        </button>
      )}
    </div>
  );
};

export default BackgroundUploadButton;