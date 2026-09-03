import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  FileText, 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Loader2, 
  Sparkles, 
  ShieldCheck, 
  CornerDownLeft,
  Edit3
} from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { FormStep, FormQuestion, QuestionOption, ProgressiveFormProps } from './types';

export const ProgressiveForm: React.FC<ProgressiveFormProps> = ({
  badgeText,
  steps,
  questions,
  initialValues = {},
  onSubmit,
  onCancel,
  submitButtonText = 'Confirm & Submit',
  reviewTitle = 'Review Your Request',
  reviewDescription = 'Please verify your information before final submission. You can click edit on any section.',
  reviewSections,
  isSubmitting = false,
  submitError = '',
  accentColor = '#ff7700',
  renderSuccess,
  footerNotice,
  enableSound = true,
  compact = false
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = { ...initialValues };
    questions.forEach(q => {
      if (defaults[q.id] === undefined && q.defaultValue !== undefined) {
        defaults[q.id] = q.defaultValue;
      }
    });
    return defaults;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [inlineError, setInlineError] = useState<string>('');
  const [selectedPendingOption, setSelectedPendingOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Compute active questions based on conditional logic
  const activeQuestions = questions.filter(q => !q.condition || q.condition(formData));

  const isReviewStep = currentIndex >= activeQuestions.length;
  const currentQuestion: FormQuestion | undefined = activeQuestions[currentIndex];

  // Find active step
  const currentStepId = isReviewStep 
    ? 'review' 
    : currentQuestion?.stepId || steps[0]?.id;

  const currentStepIndex = steps.findIndex(s => s.id === currentStepId);

  // Calculate overall progress percentage
  const totalQuestions = activeQuestions.length;
  const progressPercent = Math.min(
    100, 
    Math.round(((isReviewStep ? totalQuestions : currentIndex) / totalQuestions) * 100)
  );

  // Auto-focus input when question changes
  useEffect(() => {
    setInlineError('');
    setSelectedPendingOption(null);
    if (!isReviewStep && inputRef.current) {
      const timer = setTimeout(() => {
        try {
          inputRef.current?.focus();
        } catch {
          // ignore mobile focus issues
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isReviewStep]);

  // Field validation
  const validateField = (question: FormQuestion, value: any): string | null => {
    if (question.validate) {
      const customErr = question.validate(value, formData);
      if (customErr) return customErr;
    }

    if (question.required) {
      if (value === undefined || value === null || value === '') {
        return 'This field is required to continue.';
      }
      if (Array.isArray(value) && value.length === 0) {
        return 'Please select at least one option.';
      }
      if (question.type === 'file' && !value) {
        return 'Please upload a file to continue.';
      }
    }

    // Email validation
    if (question.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value).trim())) {
        return 'Please enter a valid business email address (e.g. name@company.com).';
      }
    }

    // URL validation
    if (question.type === 'url' && value) {
      const trimmed = String(value).trim();
      if (!trimmed.includes('.') || trimmed.length < 4) {
        return 'Please enter a valid website URL (e.g. company.com).';
      }
    }

    // Phone validation
    if (question.type === 'phone' && value) {
      const digits = String(value).replace(/\D/g, '');
      if (digits.length < 7) {
        return 'Please enter a valid phone number with area code.';
      }
    }

    return null;
  };

  const handleNext = () => {
    if (!currentQuestion) return;

    const value = formData[currentQuestion.id];
    const err = validateField(currentQuestion, value);

    if (err) {
      setInlineError(err);
      if (enableSound) soundFx.playPop();
      return;
    }

    setInlineError('');
    if (enableSound) soundFx.playNav();
    setDirection('forward');
    setCurrentIndex(prev => prev + 1);
  };

  const handleSkip = () => {
    if (!currentQuestion) return;
    setInlineError('');
    if (enableSound) soundFx.playNav();
    setDirection('forward');
    setCurrentIndex(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setInlineError('');
      if (enableSound) soundFx.playNav();
      setDirection('backward');
      setCurrentIndex(prev => prev - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleJumpToQuestion = (targetStepId?: string, targetQuestionId?: string) => {
    setInlineError('');
    if (enableSound) soundFx.playClick();
    setDirection('backward');

    if (targetQuestionId) {
      const idx = activeQuestions.findIndex(q => q.id === targetQuestionId);
      if (idx !== -1) {
        setCurrentIndex(idx);
        return;
      }
    }

    if (targetStepId) {
      const idx = activeQuestions.findIndex(q => q.stepId === targetStepId);
      if (idx !== -1) {
        setCurrentIndex(idx);
        return;
      }
    }

    setCurrentIndex(0);
  };

  const handleSingleSelect = (val: string) => {
    if (!currentQuestion) return;
    setSelectedPendingOption(val);
    setFormData(prev => ({ ...prev, [currentQuestion.id]: val }));
    if (enableSound) soundFx.playClick();

    // Auto advance after 220ms smooth delay
    setTimeout(() => {
      setInlineError('');
      setDirection('forward');
      setCurrentIndex(prev => prev + 1);
    }, 220);
  };

  const handleMultiSelectToggle = (val: string) => {
    if (!currentQuestion) return;
    if (enableSound) soundFx.playClick();
    setFormData(prev => {
      const currentList: string[] = Array.isArray(prev[currentQuestion.id]) 
        ? [...prev[currentQuestion.id]] 
        : [];
      const exists = currentList.includes(val);
      const updated = exists 
        ? currentList.filter(item => item !== val) 
        : [...currentList, val];
      return { ...prev, [currentQuestion.id]: updated };
    });
    setInlineError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentQuestion || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    // Check size
    const maxSize = (currentQuestion.maxFileSizeMB || 10) * 1024 * 1024;
    if (file.size > maxSize) {
      setInlineError(`File size exceeds limit of ${currentQuestion.maxFileSizeMB || 10}MB.`);
      return;
    }

    setFormData(prev => ({ ...prev, [currentQuestion.id]: file }));
    setInlineError('');
    if (enableSound) soundFx.playPop();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentQuestion?.type !== 'textarea') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && currentQuestion?.type === 'textarea') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (enableSound) soundFx.playClick();
    try {
      await onSubmit(formData);
      setIsSubmitted(true);
      if (enableSound) soundFx.playChime();
    } catch {
      // Handled by parent via submitError prop
    }
  };

  const resetForm = () => {
    setFormData({ ...initialValues });
    setCurrentIndex(0);
    setIsSubmitted(false);
  };

  if (isSubmitted && renderSuccess) {
    return <>{renderSuccess(formData, resetForm)}</>;
  }

  // Animation variants
  const slideVariants = {
    enter: (dir: string) => ({
      x: dir === 'forward' ? 24 : -24,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: string) => ({
      x: dir === 'forward' ? -24 : 24,
      opacity: 0
    })
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${compact ? 'p-3 sm:p-5' : 'p-4 sm:p-8'} text-white`}>
      {/* Top Header & Progress Navigation */}
      <div className="mb-6 sm:mb-8 space-y-4">
        <div className="flex items-center justify-between gap-4">
          {/* Back button or badge */}
          <div className="flex items-center gap-3">
            {currentIndex > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : onCancel ? (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close</span>
              </button>
            ) : badgeText ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff7700]/10 text-[#ff7700] text-xs font-bold border border-[#ff7700]/20 tracking-wide uppercase">
                <Sparkles className="w-3 h-3 text-[#ff7700]" />
                {badgeText}
              </span>
            ) : null}

            {!isReviewStep && currentQuestion && (
              <span className="text-xs font-medium text-slate-400 hidden sm:inline-block">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
            )}
            {isReviewStep && (
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                Final Step • Review
              </span>
            )}
          </div>

          {/* Progress Percent Text */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">
              {progressPercent}% Completed
            </span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ff8800] via-[#ff7700] to-[#ff5500] rounded-full shadow-[0_0_12px_rgba(255,119,0,0.6)]"
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>

        {/* Compact Steps Pill Navigation */}
        <div className="hidden md:flex items-center justify-between gap-2 pt-1 border-t border-white/5">
          {steps.map((s, idx) => {
            const isCurrent = s.id === currentStepId;
            const isPast = steps.findIndex(st => st.id === currentStepId) > idx || isReviewStep;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleJumpToQuestion(s.id)}
                disabled={!isPast && !isCurrent}
                className={`flex items-center gap-2 py-1 px-2 rounded-lg text-xs font-medium transition-all ${
                  isCurrent
                    ? 'text-[#ff7700] font-bold bg-[#ff7700]/10 border border-[#ff7700]/30'
                    : isPast
                    ? 'text-slate-300 hover:text-white cursor-pointer'
                    : 'text-slate-600 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent
                    ? 'bg-[#ff7700] text-black'
                    : isPast
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-white/5 text-slate-500'
                }`}>
                  {isPast && !isCurrent ? <Check className="w-3 h-3 text-emerald-400" /> : idx + 1}
                </span>
                <span>{s.shortLabel || s.label}</span>
              </button>
            );
          })}
          <div className={`flex items-center gap-2 py-1 px-2 rounded-lg text-xs font-medium ${
            isReviewStep
              ? 'text-[#ff7700] font-bold bg-[#ff7700]/10 border border-[#ff7700]/30'
              : 'text-slate-600'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isReviewStep ? 'bg-[#ff7700] text-black' : 'bg-white/5 text-slate-500'
            }`}>
              {steps.length + 1}
            </span>
            <span>Review</span>
          </div>
        </div>
      </div>

      {/* Main Question / Review Container with Smooth AnimatePresence */}
      <div className="relative min-h-[360px] flex flex-col justify-between">
        <AnimatePresence mode="wait" custom={direction}>
          {!isReviewStep && currentQuestion ? (
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Question Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#ff7700]">
                    {steps.find(s => s.id === currentQuestion.stepId)?.label || 'Step'}
                  </span>
                  {!currentQuestion.required && (
                    <span className="text-[11px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      Optional
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {currentQuestion.question}
                </h2>

                {currentQuestion.subtitle && (
                  <p className="text-sm text-slate-400 font-normal leading-relaxed max-w-2xl">
                    {currentQuestion.subtitle}
                  </p>
                )}
              </div>

              {/* Dynamic Input Component Based on Type */}
              <div className="pt-2">
                {/* 1. TEXT / EMAIL / PHONE / URL / NUMBER */}
                {(currentQuestion.type === 'text' ||
                  currentQuestion.type === 'email' ||
                  currentQuestion.type === 'phone' ||
                  currentQuestion.type === 'url' ||
                  currentQuestion.type === 'number') && (
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type={currentQuestion.type === 'number' ? 'number' : currentQuestion.type === 'phone' ? 'tel' : currentQuestion.type}
                        value={formData[currentQuestion.id] || ''}
                        min={currentQuestion.min}
                        max={currentQuestion.max}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, [currentQuestion.id]: e.target.value }));
                          setInlineError('');
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={currentQuestion.placeholder || 'Type your answer here...'}
                        className="w-full px-5 py-4 text-base sm:text-lg bg-black/60 border-2 border-white/15 focus:border-[#ff7700] rounded-xl outline-none text-white placeholder-slate-500 shadow-inner transition-all duration-200 focus:shadow-[0_0_24px_rgba(255,119,0,0.25)]"
                      />
                    </div>
                  </div>
                )}

                {/* 2. TEXTAREA */}
                {currentQuestion.type === 'textarea' && (
                  <div className="space-y-3">
                    <textarea
                      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                      rows={currentQuestion.rows || 4}
                      value={formData[currentQuestion.id] || ''}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, [currentQuestion.id]: e.target.value }));
                        setInlineError('');
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder={currentQuestion.placeholder || 'Provide details here...'}
                      className="w-full px-5 py-4 text-base sm:text-lg bg-black/60 border-2 border-white/15 focus:border-[#ff7700] rounded-xl outline-none text-white placeholder-slate-500 shadow-inner transition-all duration-200 focus:shadow-[0_0_24px_rgba(255,119,0,0.25)] leading-relaxed"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Pro-tip: Press Cmd/Ctrl + Enter to continue</span>
                    </div>
                  </div>
                )}

                {/* 3. SINGLE-SELECT CARDS (Auto-advances) */}
                {currentQuestion.type === 'select' && currentQuestion.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {currentQuestion.options.map((opt: QuestionOption) => {
                      const isSelected = (formData[currentQuestion.id] === opt.value) || (selectedPendingOption === opt.value);
                      const Icon = opt.icon;

                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSingleSelect(opt.value)}
                          className={`relative text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer flex items-start gap-3.5 ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#ff7700]/20 to-black border-[#ff7700] shadow-[0_0_20px_rgba(255,119,0,0.3)] scale-[1.01]'
                              : 'bg-black/50 border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                          }`}
                        >
                          {Icon && (
                            <div className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                              isSelected ? 'bg-[#ff7700] text-black' : 'bg-white/5 text-slate-300'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-sm sm:text-base text-white truncate">
                                {opt.label}
                              </span>
                              {opt.tag && (
                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#ff7700]/20 text-[#ff7700] border border-[#ff7700]/30 shrink-0">
                                  {opt.tag}
                                </span>
                              )}
                            </div>
                            {opt.description && (
                              <p className="text-xs text-slate-400 mt-1 leading-normal line-clamp-2">
                                {opt.description}
                              </p>
                            )}
                          </div>

                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isSelected 
                              ? 'bg-[#ff7700] border-[#ff7700] text-black' 
                              : 'border-white/20 bg-black/40'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* 4. MULTI-SELECT CARDS (Requires Continue button click) */}
                {currentQuestion.type === 'multiselect' && currentQuestion.options && (
                  <div className="space-y-3 pt-1">
                    <p className="text-xs text-slate-400 font-medium">
                      Select all that apply, then click Continue.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                      {currentQuestion.options.map((opt: QuestionOption) => {
                        const selectedList: string[] = Array.isArray(formData[currentQuestion.id]) 
                          ? formData[currentQuestion.id] 
                          : [];
                        const isSelected = selectedList.includes(opt.value);
                        const Icon = opt.icon;

                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleMultiSelectToggle(opt.value)}
                            className={`relative text-left p-4 rounded-xl border-2 transition-all duration-150 cursor-pointer flex items-start gap-3.5 ${
                              isSelected
                                ? 'bg-gradient-to-r from-[#ff7700]/20 to-black border-[#ff7700] shadow-[0_0_20px_rgba(255,119,0,0.3)]'
                                : 'bg-black/50 border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
                            }`}
                          >
                            {Icon && (
                              <div className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${
                                isSelected ? 'bg-[#ff7700] text-black' : 'bg-white/5 text-slate-300'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-sm sm:text-base text-white truncate">
                                  {opt.label}
                                </span>
                                {opt.tag && (
                                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#ff7700]/20 text-[#ff7700] border border-[#ff7700]/30 shrink-0">
                                    {opt.tag}
                                  </span>
                                )}
                              </div>
                              {opt.description && (
                                <p className="text-xs text-slate-400 mt-1 leading-normal line-clamp-2">
                                  {opt.description}
                                </p>
                              )}
                            </div>

                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              isSelected 
                                ? 'bg-[#ff7700] border-[#ff7700] text-black' 
                                : 'border-white/20 bg-black/40'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. DATE PICKER WITH QUICK PRESETS */}
                {currentQuestion.type === 'date' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Tomorrow', getDays: () => 1 },
                        { label: 'In 2 Days', getDays: () => 2 },
                        { label: 'Next Business Day', getDays: () => 3 },
                        { label: 'Next Week', getDays: () => 7 }
                      ].map((preset) => {
                        const targetDate = new Date();
                        targetDate.setDate(targetDate.getDate() + preset.getDays());
                        const dateStr = targetDate.toISOString().split('T')[0];
                        const isChosen = formData[currentQuestion.id] === dateStr;

                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, [currentQuestion.id]: dateStr }));
                              setInlineError('');
                              if (enableSound) soundFx.playClick();
                            }}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              isChosen
                                ? 'bg-[#ff7700] text-black border-[#ff7700]'
                                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="relative">
                      <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData[currentQuestion.id] || ''}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, [currentQuestion.id]: e.target.value }));
                          setInlineError('');
                        }}
                        onKeyDown={handleKeyDown}
                        className="w-full px-5 py-4 text-base sm:text-lg bg-black/60 border-2 border-white/15 focus:border-[#ff7700] rounded-xl outline-none text-white shadow-inner transition-all [color-scheme:dark]"
                      />
                    </div>
                  </div>
                )}

                {/* 6. TIME SLOTS PICKER */}
                {currentQuestion.type === 'time' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        '09:00 AM EST',
                        '10:00 AM EST',
                        '11:30 AM EST',
                        '01:30 PM EST',
                        '03:00 PM EST',
                        '04:30 PM EST'
                      ].map((slot) => {
                        const isSelected = formData[currentQuestion.id] === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleSingleSelect(slot)}
                            className={`p-3.5 rounded-xl border-2 text-center font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                              isSelected
                                ? 'bg-[#ff7700] text-black border-[#ff7700] shadow-[0_0_15px_rgba(255,119,0,0.4)]'
                                : 'bg-black/50 text-slate-200 border-white/10 hover:border-white/30 hover:bg-white/5'
                            }`}
                          >
                            <Clock className="w-4 h-4 opacity-70" />
                            <span>{slot}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 7. FILE UPLOAD (RESUME / ATTACHMENT) */}
                {currentQuestion.type === 'file' && (
                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={currentQuestion.accept || '.pdf,.doc,.docx,.png,.jpg'}
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {formData[currentQuestion.id] ? (
                      <div className="p-6 rounded-xl bg-black/60 border-2 border-emerald-500/40 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">
                              {formData[currentQuestion.id] instanceof File 
                                ? (formData[currentQuestion.id] as File).name 
                                : String(formData[currentQuestion.id])}
                            </p>
                            {formData[currentQuestion.id] instanceof File && (
                              <p className="text-xs text-slate-400">
                                {(((formData[currentQuestion.id] as File).size) / (1024 * 1024)).toFixed(2)} MB
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, [currentQuestion.id]: null }));
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold hover:bg-red-500/20 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handleFileUpload({ target: { files: e.dataTransfer.files } } as any);
                          }
                        }}
                        className="p-8 border-2 border-dashed border-white/20 hover:border-[#ff7700] rounded-xl bg-black/40 hover:bg-white/[0.02] text-center cursor-pointer transition-all duration-200 group"
                      >
                        <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-[#ff7700]/20 text-slate-400 group-hover:text-[#ff7700] flex items-center justify-center mx-auto mb-3 transition-colors">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-white mb-1">
                          Click or drag file to upload
                        </p>
                        <p className="text-xs text-slate-400">
                          {currentQuestion.accept ? `Accepted: ${currentQuestion.accept}` : 'PDF, DOC, DOCX up to 10MB'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Inline Validation Error */}
              {inlineError && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2.5 font-medium shadow-lg"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{inlineError}</span>
                </motion.div>
              )}

              {/* Bottom Navigation Controls for Current Question */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                <div className="text-xs text-slate-500 hidden sm:block">
                  {currentQuestion.type !== 'select' && currentQuestion.type !== 'textarea' && (
                    <span className="flex items-center gap-1">
                      Press <CornerDownLeft className="w-3 h-3 text-slate-400" /> <kbd className="px-1 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">Enter</kbd> to continue
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {!currentQuestion.required && (
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/10 transition-all cursor-pointer"
                    >
                      Skip
                    </button>
                  )}

                  {/* Hide Continue on single-select because clicking option auto-advances */}
                  {currentQuestion.type !== 'select' && (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-[#ff8800] to-[#ff5500] hover:from-[#ff9900] hover:to-[#ff6600] text-black font-extrabold text-sm shadow-[0_0_20px_rgba(255,119,0,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* FINAL REVIEW STEP */
            <motion.div
              key="review-step"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ff7700]">
                  Ready for Submission
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {reviewTitle}
                </h2>
                <p className="text-sm text-slate-400">
                  {reviewDescription}
                </p>
              </div>

              {/* Review Sections Cards */}
              <div className="space-y-4">
                {reviewSections && reviewSections.length > 0 ? (
                  reviewSections.map((section, sIdx) => (
                    <div 
                      key={sIdx}
                      className="bg-black/40 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h4 className="font-bold text-sm text-[#ff7700] uppercase tracking-wider">
                          {section.title}
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleJumpToQuestion(section.stepId)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {section.fields.map((f) => {
                          const rawVal = formData[f.key];
                          let rendered = f.format ? f.format(rawVal) : rawVal;

                          if (Array.isArray(rendered)) {
                            rendered = rendered.join(', ');
                          } else if (rendered instanceof File) {
                            rendered = rendered.name;
                          } else if (!rendered) {
                            rendered = <span className="text-slate-500 italic">Not provided</span>;
                          }

                          return (
                            <div key={f.key} className="space-y-0.5">
                              <span className="text-slate-400 block">{f.label}</span>
                              <span className="text-white font-medium block truncate">
                                {rendered}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  /* Fallback auto-review based on active questions */
                  <div className="bg-black/40 border border-white/10 rounded-xl p-5 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {activeQuestions.map((q) => {
                        let val = formData[q.id];
                        if (Array.isArray(val)) val = val.join(', ');
                        else if (val instanceof File) val = val.name;
                        else if (!val) val = 'Not provided';

                        return (
                          <div key={q.id} className="space-y-0.5">
                            <span className="text-slate-400 block">{q.question}</span>
                            <span className="text-white font-medium block truncate">{String(val)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2.5 font-medium shadow-lg">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Security Badge */}
              <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl flex items-center gap-2.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>256-bit encrypted transmission. Dispatched directly to Wal Group operational queue.</span>
              </div>

              {/* Final Actions */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/10 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Questions</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#ff8800] via-[#ff7700] to-[#ff5500] hover:from-[#ff9900] hover:to-[#ff6600] disabled:opacity-50 text-black font-extrabold text-sm shadow-[0_0_24px_rgba(255,119,0,0.5)] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 text-black animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-black" />
                      <span>{submitButtonText}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {footerNotice && (
        <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-slate-500">
          {footerNotice}
        </div>
      )}
    </div>
  );
};
