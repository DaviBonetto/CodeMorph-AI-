
import type { ReactNode } from 'react';

export interface TransformationOption {
  id: string;
  name: string;
  subtitle: string;
  // Fix: Use ReactNode type.
  icon: ReactNode;
  badge?: string;
}

export interface SummaryStat {
    value: string;
    description: string;
}

export interface Analysis {
  summaryStats: {
    performance: SummaryStat;
    issuesFixed: SummaryStat;
    bundleSize: SummaryStat;
    qualityGrade: SummaryStat;
  };
  detailedChanges: {
    icon: string;
    description: string;
  }[];
  explanation: string;
}

export interface SampleCode {
    language: string;
    code: string;
}