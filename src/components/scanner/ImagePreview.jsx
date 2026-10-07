import React from 'react';
import { Image as ImageIcon, Sparkles, RotateCcw, FileText, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * ImagePreview component showing the selected label image with metadata and analysis actions
 */
export const ImagePreview = ({
  file,
  previewUrl,
  onChangeImage,
  onAnalyze,
  isAnalyzing = false,
}) => {
  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" dot>
            Image Ready
          </Badge>
          <span className="text-xs text-neutral-500 font-medium">
            Legal Metrology Ingest
          </span>
        </div>

        <button
          type="button"
          onClick={onChangeImage}
          disabled={isAnalyzing}
          className="text-xs font-semibold text-neutral-600 hover:text-primary-600 transition-colors flex items-center gap-1 focus:outline-none disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Change Image</span>
        </button>
      </div>

      {/* Image Preview Canvas */}
      <div className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-border flex items-center justify-center max-h-[420px] group shadow-inner">
        <img
          src={previewUrl}
          alt="Selected product label for audit"
          className="max-h-[420px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {/* Overlay scanning gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Quick File Tag */}
        <div className="absolute bottom-3 left-3 right-3 bg-surface/90 backdrop-blur-md border border-border rounded-xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 truncate">
            <div className="h-8 w-8 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div className="truncate">
              <p className="font-bold text-neutral-900 truncate">
                {file?.name || 'label_photo.jpg'}
              </p>
              <p className="text-[11px] text-neutral-500">
                {formatFileSize(file?.size)} • {file?.type?.toUpperCase()?.replace('IMAGE/', '') || 'JPG'}
              </p>
            </div>
          </div>
          <span className="text-success-700 font-semibold text-[11px] hidden sm:flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-success-600" />
            <span>Valid Image</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          size="md"
          icon={RotateCcw}
          onClick={onChangeImage}
          disabled={isAnalyzing}
          className="w-full sm:w-auto"
        >
          Change Image
        </Button>

        <Button
          type="button"
          variant="primary"
          size="md"
          icon={Sparkles}
          isLoading={isAnalyzing}
          onClick={onAnalyze}
          className="w-full sm:w-auto shadow-md"
        >
          Analyze Label
        </Button>
      </div>
    </Card>
  );
};

export default ImagePreview;
