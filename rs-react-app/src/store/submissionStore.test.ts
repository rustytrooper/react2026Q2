import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useSubmissionStore } from './submissionStore';
import type { StoredFormData } from '../schemas/formSchema';
import { cleanup } from '@testing-library/react';

describe('useSubmissionStore', () => {
  const mockStoredData: StoredFormData = {
    name: 'John Doe',
    age: 25,
    email: 'john@example.com',
    gender: 'male',
    termsAccepted: true,
    avatar: '',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    country: 'US',
  };

  const mockStoredData2: StoredFormData = {
    name: 'Jane Smith',
    age: 30,
    email: 'jane@example.com',
    gender: 'female',
    termsAccepted: true,
    avatar: '',
    password: 'Password456!',
    confirmPassword: 'Password456!',
    country: 'UK',
  };

  beforeEach(() => {
    useSubmissionStore.setState({ submissions: [] });
    localStorage.clear();
    cleanup();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  describe('Initial state', () => {
    it('should have empty submissions array initially', () => {
      const submissions = useSubmissionStore.getState().submissions;
      expect(submissions).toEqual([]);
    });
  });

  describe('addSubmission', () => {
    it('should add new submission to the beginning of the list', () => {
      const addSubmission = useSubmissionStore.getState().addSubmission;

      const submissionData = {
        formType: 'rhf' as const,
        data: mockStoredData,
      };

      addSubmission(submissionData);

      const submissions = useSubmissionStore.getState().submissions;
      expect(submissions).toHaveLength(1);
      expect(submissions[0].formType).toBe('rhf');
      expect(submissions[0].data.name).toBe('John Doe');
      expect(submissions[0].id).toBeDefined();
      expect(submissions[0].submittedAt).toBeDefined();
    });

    it('should generate unique id for each submission', () => {
      const addSubmission = useSubmissionStore.getState().addSubmission;

      const submissionData = {
        formType: 'rhf' as const,
        data: mockStoredData,
      };

      addSubmission(submissionData);
      addSubmission(submissionData);

      const submissions = useSubmissionStore.getState().submissions;
      expect(submissions[0].id).not.toBe(submissions[1].id);
    });

    it('should add multiple submissions in correct order (newest first)', () => {
      const addSubmission = useSubmissionStore.getState().addSubmission;

      const submissionData1 = {
        formType: 'rhf' as const,
        data: mockStoredData,
      };

      const submissionData2 = {
        formType: 'uncontrolled' as const,
        data: mockStoredData2,
      };

      addSubmission(submissionData1);
      addSubmission(submissionData2);

      const submissions = useSubmissionStore.getState().submissions;
      expect(submissions).toHaveLength(2);
      expect(submissions[0].data.name).toBe('Jane Smith');
      expect(submissions[1].data.name).toBe('John Doe');
    });

    it('should add submission with current timestamp', () => {
      const before = new Date().toISOString();
      const addSubmission = useSubmissionStore.getState().addSubmission;

      const submissionData = {
        formType: 'rhf' as const,
        data: mockStoredData,
      };

      addSubmission(submissionData);

      const submissions = useSubmissionStore.getState().submissions;
      const after = new Date().toISOString();

      expect(submissions[0].submittedAt >= before).toBe(true);
      expect(submissions[0].submittedAt <= after).toBe(true);
    });
  });

  describe('clearSubmissions', () => {
    it('should clear all submissions', () => {
      const addSubmission = useSubmissionStore.getState().addSubmission;
      const clearSubmissions = useSubmissionStore.getState().clearSubmissions;

      const submissionData = {
        formType: 'rhf' as const,
        data: mockStoredData,
      };

      addSubmission(submissionData);
      expect(useSubmissionStore.getState().submissions).toHaveLength(1);

      clearSubmissions();
      expect(useSubmissionStore.getState().submissions).toEqual([]);
    });

    it('should do nothing when already empty', () => {
      const clearSubmissions = useSubmissionStore.getState().clearSubmissions;

      expect(useSubmissionStore.getState().submissions).toEqual([]);
      clearSubmissions();
      expect(useSubmissionStore.getState().submissions).toEqual([]);
    });
  });

  describe('getSubmissionsByType', () => {
    it('should return only rhf submissions', () => {
      const addSubmission = useSubmissionStore.getState().addSubmission;
      const getSubmissionsByType =
        useSubmissionStore.getState().getSubmissionsByType;

      const rhfSubmission = {
        formType: 'rhf' as const,
        data: mockStoredData,
      };

      const uncontrolledSubmission = {
        formType: 'uncontrolled' as const,
        data: mockStoredData2,
      };

      addSubmission(rhfSubmission);
      addSubmission(uncontrolledSubmission);

      const rhfSubmissions = getSubmissionsByType('rhf');
      const uncontrolledSubmissions = getSubmissionsByType('uncontrolled');

      expect(rhfSubmissions).toHaveLength(1);
      expect(rhfSubmissions[0].formType).toBe('rhf');
      expect(rhfSubmissions[0].data.name).toBe('John Doe');

      expect(uncontrolledSubmissions).toHaveLength(1);
      expect(uncontrolledSubmissions[0].formType).toBe('uncontrolled');
      expect(uncontrolledSubmissions[0].data.name).toBe('Jane Smith');
    });

    it('should return empty array when no submissions of type', () => {
      const addSubmission = useSubmissionStore.getState().addSubmission;
      const getSubmissionsByType =
        useSubmissionStore.getState().getSubmissionsByType;

      const rhfSubmission = {
        formType: 'rhf' as const,
        data: mockStoredData,
      };

      addSubmission(rhfSubmission);

      const uncontrolledSubmissions = getSubmissionsByType('uncontrolled');
      expect(uncontrolledSubmissions).toEqual([]);
    });

    it('should return multiple submissions of same type', () => {
      const addSubmission = useSubmissionStore.getState().addSubmission;
      const getSubmissionsByType =
        useSubmissionStore.getState().getSubmissionsByType;

      const rhfSubmission1 = {
        formType: 'rhf' as const,
        data: mockStoredData,
      };

      const rhfSubmission2 = {
        formType: 'rhf' as const,
        data: mockStoredData2,
      };

      addSubmission(rhfSubmission1);
      addSubmission(rhfSubmission2);

      const rhfSubmissions = getSubmissionsByType('rhf');
      expect(rhfSubmissions).toHaveLength(2);
      expect(rhfSubmissions[0].data.name).toBe('Jane Smith');
      expect(rhfSubmissions[1].data.name).toBe('John Doe');
    });
  });

  describe('Persistence', () => {
    it('should persist submissions to localStorage', () => {
      const addSubmission = useSubmissionStore.getState().addSubmission;

      const submissionData = {
        formType: 'rhf' as const,
        data: mockStoredData,
      };

      addSubmission(submissionData);

      const stored = localStorage.getItem('submissions-storage');
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.submissions).toHaveLength(1);
      expect(parsed.state.submissions[0].data.name).toBe('John Doe');
    });

    it('should restore from localStorage on initialization', async () => {
      const addSubmission = useSubmissionStore.getState().addSubmission;

      const submissionData = {
        formType: 'rhf' as const,
        data: mockStoredData,
      };

      addSubmission(submissionData);
      await new Promise((resolve) => setTimeout(resolve, 10));

      const submissions = useSubmissionStore.getState().submissions;
      expect(submissions).toHaveLength(1);
      expect(submissions[0].data.name).toBe('John Doe');
    });
  });
});
