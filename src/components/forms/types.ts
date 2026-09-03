import React from 'react';

export interface FormStep {
  id: string;
  label: string;
  shortLabel?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tag?: string;
  recommended?: boolean;
}

export type QuestionType = 
  | 'text'
  | 'email'
  | 'phone'
  | 'url'
  | 'number'
  | 'select'
  | 'multiselect'
  | 'textarea'
  | 'file'
  | 'date'
  | 'time';

export interface FormQuestion {
  id: string;
  stepId: string;
  type: QuestionType;
  question: string;
  subtitle?: string;
  placeholder?: string;
  required?: boolean;
  options?: QuestionOption[];
  condition?: (formData: Record<string, any>) => boolean;
  validate?: (value: any, formData: Record<string, any>) => string | null;
  helpText?: string;
  defaultValue?: any;
  min?: number;
  max?: number;
  accept?: string;
  maxFileSizeMB?: number;
  rows?: number;
}

export interface ReviewSection {
  title: string;
  stepId?: string;
  fields: {
    label: string;
    key: string;
    format?: (val: any) => React.ReactNode;
  }[];
}

export interface ProgressiveFormProps {
  formId?: string;
  badgeText?: string;
  title?: string;
  steps: FormStep[];
  questions: FormQuestion[];
  initialValues?: Record<string, any>;
  onSubmit: (formData: Record<string, any>) => Promise<void> | void;
  onCancel?: () => void;
  submitButtonText?: string;
  reviewTitle?: string;
  reviewDescription?: string;
  reviewSections?: ReviewSection[];
  isSubmitting?: boolean;
  submitError?: string;
  accentColor?: string;
  renderSuccess?: (formData: Record<string, any>, resetForm: () => void) => React.ReactNode;
  footerNotice?: React.ReactNode;
  enableSound?: boolean;
  compact?: boolean;
}
