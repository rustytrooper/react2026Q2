import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Submission {
  id: string;
  submittedAt: string;
  formType: 'uncontrolled' | 'rhf';
  data: {
    name: string;
    age: number;
    email: string;
    gender: string;
    termsAccepted: boolean;
    avatar: string;
    password: string;
    country: string;
  };
}

interface SubmissionStore {
  submissions: Submission[];
  addSubmission: (submission: Omit<Submission, 'id' | 'submittedAt'>) => void;
  clearSubmissions: () => void;
  getSubmissionsByType: (type: 'uncontrolled' | 'rhf') => Submission[];
}

export const useSubmissionStore = create<SubmissionStore>()(
  persist(
    (set, get) => ({
      submissions: [],
      addSubmission: (submissionData) => {
        const newSubmission: Submission = {
          ...submissionData,
          id: crypto.randomUUID(),
          submittedAt: new Date().toISOString(),
        };

        set((state) => ({
          submissions: [newSubmission, ...state.submissions],
        }));
      },
      clearSubmissions: () => set({ submissions: [] }),
      getSubmissionsByType: (type) => {
        return get().submissions.filter((sub) => sub.formType === type);
      },
    }),
    {
      name: 'submissions-storage',
    }
  )
);
