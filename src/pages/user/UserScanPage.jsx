import React, { useState, useEffect, useRef } from 'react';
import { ScanLine, Sparkles, ShieldCheck } from 'lucide-react';
import scanService from '../../services/scan';
import { ImageUploader, ImagePreview, AnalysisLoader } from '../../components/scanner';
import { ComplianceResult } from '../../components/reports';
import { useToast } from '../../components/common/Toast';

export const UserScanPage = () => {
  const toast = useToast();

  const [stage, setStage] = useState('idle');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentAnalysisStage, setCurrentAnalysisStage] = useState(1);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const stageTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      if (stageTimerRef.current) {
        clearInterval(stageTimerRef.current);
      }
    };
  }, [previewUrl]);

  const handleImageSelected = (file, objectUrl) => {
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setError(null);
    setStage('preview');
  };

  const handleChangeImage = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setStage('idle');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setStage('analyzing');
    setCurrentAnalysisStage(1);
    setAnalysisProgress(15);
    setError(null);

    const formData = new FormData();
    formData.append('label', selectedFile);

    const startTime = Date.now();
    stageTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) {
        setCurrentAnalysisStage(1);
        setAnalysisProgress(30);
      } else if (elapsed < 2200) {
        setCurrentAnalysisStage(2);
        setAnalysisProgress(60);
      } else if (elapsed < 3400) {
        setCurrentAnalysisStage(3);
        setAnalysisProgress(85);
      } else {
        setCurrentAnalysisStage(4);
        setAnalysisProgress(95);
      }
    }, 300);

    try {
      const result = await scanService.analyzeLabel(formData);

      clearInterval(stageTimerRef.current);
      setCurrentAnalysisStage(4);
      setAnalysisProgress(100);

      setTimeout(() => {
        setScanResult(result);
        setStage('result');
        if (result.isCompliant) {
          toast.success('This label looks fine! All declarations are verified.', 'Label Looks Good');
        } else {
          toast.warning('We found possible problems with this label.', 'Issues Detected');
        }
      }, 400);
    } catch (err) {
      clearInterval(stageTimerRef.current);
      const msg = err?.response?.data?.message || err?.message || 'Failed to analyze product label.';
      setError(msg);
      toast.error(msg, 'Scan Failed');
      setStage('preview');
    }
  };

  const handleScanAnother = () => {
    handleChangeImage();
    setScanResult(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {stage !== 'result' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
              <span>Scan a Product Label</span>
              <Sparkles className="h-6 w-6 text-primary-500" />
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Upload a clear photo of any pre-packaged commodity. We'll automatically verify MRP, quantity, and mandatory declarations.
            </p>
          </div>
        </div>
      )}

      {stage === 'idle' && (
        <div className="animate-in fade-in duration-200">
          <ImageUploader onImageSelected={handleImageSelected} maxSizeMB={10} />
        </div>
      )}

      {stage === 'preview' && (
        <div className="animate-in fade-in duration-200">
          <ImagePreview
            file={selectedFile}
            previewUrl={previewUrl}
            onChangeImage={handleChangeImage}
            onAnalyze={handleAnalyze}
          />
        </div>
      )}

      {stage === 'analyzing' && (
        <div className="animate-in fade-in zoom-in-95 duration-200 py-6">
          <AnalysisLoader
            currentStage={currentAnalysisStage}
            progress={analysisProgress}
          />
        </div>
      )}

      {stage === 'result' && scanResult && (
        <ComplianceResult
          scanData={scanResult}
          onScanAnother={handleScanAnother}
          historyUrl="/app/user/history"
          simplified={true}
        />
      )}
    </div>
  );
};

export default UserScanPage;
