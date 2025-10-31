import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Image, Palette } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Modal } from '../ui/Modal';
import './BackgroundModal.css';

interface BackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackgroundChange: (type: 'image' | 'color', value: string) => void;
  currentBackground: {
    type: 'image' | 'color' | null;
    value: string | null;
  };
}

// Cores pré-definidas para seleção rápida
const predefinedColors = [
  '#3b82f6', // Azul
  '#ef4444', // Vermelho
  '#10b981', // Verde
  '#f59e0b', // Laranja
  '#8b5cf6', // Roxo
  '#ec4899', // Rosa
  '#06b6d4', // Ciano
  '#84cc16', // Verde limão
  '#6366f1', // Índigo
  '#f97316', // Laranja escuro
  '#14b8a6', // Turquesa
  '#a855f7'  // Roxo claro
];

export const BackgroundModal: React.FC<BackgroundModalProps> = ({
  isOpen,
  onClose,
  onBackgroundChange,
  currentBackground
}) => {
  const [activeTab, setActiveTab] = useState<'image' | 'color'>(
    currentBackground.type === 'color' ? 'color' : 'image'
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    currentBackground.type === 'color' ? currentBackground.value || '#D9E4EC' : '#3b82f6'
  );
  const [previewImage, setPreviewImage] = useState<string | null>(
    currentBackground.type === 'image' ? currentBackground.value : null
  );
  const [showColorPicker, setShowColorPicker] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setPreviewImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1
  });

  const handleApply = () => {
    if (activeTab === 'image' && previewImage) {
      onBackgroundChange('image', previewImage);
    } else if (activeTab === 'color') {
      onBackgroundChange('color', selectedColor);
    }
    onClose();
  };

  const handleRemoveBackground = () => {
    onBackgroundChange('color', '#D9E4EC');
    onClose();
  };

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Alterar Fundo"
      size="medium"
      className="background-modal"
    >
      <div className="tab-buttons">
        <button 
          className={`tab-button ${activeTab === 'image' ? 'active' : ''}`}
          onClick={() => setActiveTab('image')}
        >
          <Image size={18} />
          <span>Imagem</span>
        </button>
        <button 
          className={`tab-button ${activeTab === 'color' ? 'active' : ''}`}
          onClick={() => setActiveTab('color')}
        >
          <span>Cor Sólida</span>
        </button>
      </div>
      
      <div className="modal-content">
        {activeTab === 'image' ? (
          <>
            {!previewImage ? (
              <div 
                {...getRootProps()} 
                className="upload-area"
              >
                <input {...getInputProps()} />
                <div className="upload-icon">
                  <Upload size={32} />
                </div>
                <p className="upload-text">
                  Arraste uma imagem ou clique para selecionar
                </p>
                <p className="upload-subtext">
                  PNG, JPG, GIF até 10MB
                </p>
              </div>
            ) : (
              <div className="image-preview">
                <img src={previewImage} alt="Preview" />
                <button 
                  className="remove-preview"
                  onClick={() => setPreviewImage(null)}
                >
                  <X size={16} />
                  Remover
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="color-selector">
            <div className="color-preview-box" style={{ backgroundColor: selectedColor }}>
            </div>
            <div className="color-input-container">
              <div className="color-input-wrapper">
                <input
                  type="text"
                  className="color-text-input"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                />
                <button 
                  className="color-picker-button"
                  onClick={toggleColorPicker}
                  aria-label="Abrir seletor de cores"
                >
                  <Palette size={20} />
                </button>
              </div>
              
              {showColorPicker && (
                <div className="color-picker-popover">
                  <HexColorPicker 
                    color={selectedColor} 
                    onChange={setSelectedColor} 
                  />
                </div>
              )}
            </div>
            <div className="color-palette">
              {predefinedColors.map((color, index) => (
                <button
                  key={index}
                  className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Selecionar cor ${color}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="modal-footer">
        <button 
          className="button button-secondary"
          onClick={handleRemoveBackground}
        >
          Remover Fundo
        </button>
        <button 
          className="button button-primary"
          onClick={handleApply}
        >
          Aplicar
        </button>
      </div>
    </Modal>
  );
};