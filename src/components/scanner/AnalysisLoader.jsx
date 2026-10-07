import React from 'react';
import { ShieldCheck, CheckCircle2, Loader2, Sparkles, Cpu, FileText, SearchCheck } from 'lucide-react';
import Card from '../common/Card';

const STAGES = [
  { id: 1, label: 'Image uploaded', description: 'Packaging photo transmitted to secure OCR ingest', icon: CheckCircle2 },
  { id: 2, label: 'Text extraction', description: 'Extracting MRP, Net Qty, Dates, and Manufacturer metadata', icon: Cpu },
  { id: 3, label: 'Compliance analysis', description: 'Auditing against Legal Metrology PCR 2011 statutory rules', icon: SearchCheck },
  { id: 4, label: 'Generating report', description: 'Compiling violations, statutory checklist, and compliance score', icon: FileText },
];

/**
 * AnalysisLoader component rendering animated shield and stepped progress during label scan
 * @param {number} currentStage - Active stage index (1 to 4)
 * @param {number} [progress=25] - Overall progress percentage (0 - 100)
 */
export const AnalysisLoader = ({ currentStage = 2, progress = 50 }) => {
  return (
    <Card className="p-8 sm:p-12 max-w-2xl mx-auto text-center space-y-8 shadow-float border-primary-100">
      {/* Animated Pulsating Shield */}
      <div className="relative flex items-center justify-center mx-auto">
        {/* Glow rings */}
        <div className="absolute h-28 w-28 rounded-full bg-primary-400/20 animate-ping pointer-events-none" />
        <div className="absolute h-24 w-24 rounded-full bg-primary-500/30 animate-pulse pointer-events-none" />
        
        <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-br from-primary-600 to-indigo-800 text-white shadow-card flex items-center justify-center">
          <ShieldCheck className="h-10 w-10 animate-bounce" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
          Analyzing Product Label...
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
          Please wait while the AI compliance engine performs OCR extraction and Legal Metrology verification.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="flex justify-between text-xs font-semibold text-neutral-600">
          <span>Audit Progress</span>
          <span className="text-primary-700 font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden border border-border">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Progress Stages Checklist */}
      <div className="space-y-3 max-w-lg mx-auto text-left pt-2">
        {STAGES.map((stage) => {
          const isCompleted = stage.id < currentStage || progress >= 100;
          const isActive = stage.id === currentStage && progress < 100;
          const isPending = stage.id > currentStage && progress < 100;

          return (
            <div
              key={stage.id}
              className={`
                flex items-start gap-3.5 p-3.5 rounded-xl border transition-all duration-300
                ${
                  isActive
                    ? 'bg-primary-50/70 border-primary-300 shadow-2xs'
                    : isCompleted
                    ? 'bg-surface border-success-500/20 text-neutral-800'
                    : 'bg-surface-subtle border-border opacity-50'
                }
              `}
            >
              {/* Status Indicator Icon */}
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <div className="h-5 w-5 rounded-full bg-success-50 text-success-600 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-neutral-300 flex items-center justify-center text-[10px] font-bold text-neutral-400">
                    {stage.id}
                  </div>
                )}
              </div>

              {/* Stage Detail */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs sm:text-sm font-bold leading-tight ${
                      isActive
                        ? 'text-primary-900'
                        : isCompleted
                        ? 'text-neutral-900'
                        : 'text-neutral-500'
                    }`}
                  >
                    {stage.label}
                  </h4>
                  {isActive && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-700 bg-primary-100 px-2 py-0.5 rounded">
                      In Progress
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 mt-0.5 truncate">
                  {stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default AnalysisLoader;
