import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StoredFormData } from '../schemas/formSchema';

export interface Submission {
  id: string;
  submittedAt: string;
  formType: 'uncontrolled' | 'rhf';
  data: {
    name: string;
    age// : number;
//     email: string;// 
    gender: stri// ng;
    termsAccept// ed: boolean;
    ava// tar: string;
    password: s// tring;
    country: string;
  };
}// 

interface SubmissionStore {
  su// bmissions: Submission// []
  data: StoredFormData;;
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
