import React, { useState, useEffect, useRef } from 'react';
import { ScanLine, ShieldCheck, AlertCircle } from 'lucide-react';
import scanService from '../../services/scan';
import { ImageUploader, ImagePreview, AnalysisLoader } from '../../components/scanner';
import { ComplianceResult } from '../../components/reports';
import { useToast } from '../../components/common/Toast';
import Card from '../../components/common/Card';

export const OfficerScanPage = () => {
  const toast = useToast();

  // Lifecycle states: 'idle' | 'preview' | 'analyzing' | 'result'
  const [stage, setStage] = useState('idle');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentAnalysisStage, setCurrentAnalysisStage] = useState(1);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);

  const stageTimerRef = useRef(null);

  // Clean up object URLs on unmount
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

    // Prepare FormData with field name "label" as specified
    const formData = new FormData();
    formData.append('label', selectedFile);

    // Step through the 4 visual analysis stages over ~4 seconds
    const startTime = Date.now();
    stageTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) {
        setCurrentAnalysisStage(1); // Image uploaded
        setAnalysisProgress(25);
      } else if (elapsed < 2200) {
        setCurrentAnalysisStage(2); // Text extraction
        setAnalysisProgress(55);
      } else if (elapsed < 3400) {
        setCurrentAnalysisStage(3); // Compliance analysis
        setAnalysisProgress(80);
      } else {
        setCurrentAnalysisStage(4); // Generating report
        setAnalysisProgress(95);
      }
    }, 300);

    try {
      const result = await scanService.analyzeLabel(formData);

      // Finish progress to 100%
      clearInterval(stageTimerRef.current);
      setCurrentAnalysisStage(4);
      setAnalysisProgress(100);

      // Brief delay to show 100% completion before showing the dossier
      setTimeout(() => {
        setScanResult(result);
        setStage('result');
        if (result.isCompliant) {
          toast.success('Label satisfies all Legal Metrology declarations.', 'Product is Compliant');
        } else {
          toast.warning('Statutory deficiencies detected on packaging.', 'Non-Compliance Detected');
        }
      }, 500);
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
      {/* Page Header */}
      {stage !== 'result' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Product Label Verification Scanner
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Upload packaging photographs to trigger OCR and Legal Metrology PCR 2011 compliance checks.
            </p>
          </div>
        </div>
      )}

      {/* ─── Stage 1: Upload (Idle) ─── */}
      {stage === 'idle' && (
        <div className="animate-in fade-in duration-200">
          <ImageUploader onImageSelected={handleImageSelected} maxSizeMB={10} />
        </div>
      )}

      {/* ─── Stage 2: Preview & Confirm ─── */}
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

      {/* ─── Stage 3: Animated Analysis Screen ─── */}
      {stage === 'analyzing' && (
        <div className="animate-in fade-in zoom-in-95 duration-200 py-6">
          <AnalysisLoader
            currentStage={currentAnalysisStage}
            progress={analysisProgress}
          />
        </div>
      )}

      {/* ─── Stage 4: Compliance Result Dossier ─── */}
      {stage === 'result' && scanResult && (
        <ComplianceResult
          scanData={scanResult}
          onScanAnother={handleScanAnother}
          historyUrl="/app/officer/history"
        />
      )}
    </div>
  );
};

export default OfficerScanPage;
