import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, FileWarning } from 'lucide-react';
import Button from '../common/Button';

/**
 * ImageUploader component with drag & drop, file type validation, and size checks
 * @param {Function} onImageSelected - (file: File, previewUrl: string) => void
 * @param {number} [maxSizeMB=10]
 */
export const ImageUploader = ({ onImageSelected, maxSizeMB = 10 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  const validateAndProcessFile = (file) => {
    setErrorMessage(null);

    if (!file) {
      setErrorMessage('No image file was selected');
      return;
    }

    // 1. Validate MIME Type
    if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('Unsupported file type. Please upload a JPG, JPEG, or PNG image.');
      return;
    }

    // 2. Validate File Size (Max 10MB)
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMessage(`File exceeds ${maxSizeMB} MB. Please select a smaller photo.`);
      return;
    }

    // 3. Validate image readability via Image object
    try {
      const previewUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        if (onImageSelected) {
          onImageSelected(file, previewUrl);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(previewUrl);
        setErrorMessage('Image could not be loaded or is corrupted.');
      };
      img.src = previewUrl;
    } catch {
      setErrorMessage('Image could not be loaded. Please try a different photo.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndProcessFile(droppedFile);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      validateAndProcessFile(selectedFile);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200
          flex flex-col items-center justify-center select-none
          ${
            isDragging
              ? 'border-primary-500 bg-primary-50/80 scale-[1.01]'
              : 'border-border bg-surface-subtle hover:bg-surface-muted hover:border-primary-400'
          }
          ${errorMessage ? 'border-error-300 bg-error-50/20' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Upload packaging label photo"
        />

        <div
          className={`h-16 w-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-200 ${
            isDragging
              ? 'bg-primary-600 text-white scale-110'
              : 'bg-primary-50 text-primary-600 border border-primary-200/80'
          }`}
        >
          <UploadCloud className="h-8 w-8" />
        </div>

        <h3 className="text-base font-bold text-neutral-900 tracking-tight">
          {isDragging ? 'Drop packaging photo here' : 'Drag & drop product label image'}
        </h3>

        <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mt-1 mb-5">
          Supports JPG, JPEG, and PNG images up to {maxSizeMB} MB. Ensure declarations are sharp and well-lit.
        </p>

        <Button
          type="button"
          variant="primary"
          size="sm"
          icon={ImageIcon}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Browse Files
        </Button>
      </div>

      {/* Inline Validation Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-error-50 border border-error-500/20 flex items-start gap-2.5 text-error-700 text-xs sm:text-sm animate-in fade-in duration-150"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-error-600" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
