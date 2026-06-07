import { z } from 'zod';

export const formDataSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .regex(/^[A-Z]/, 'Name must start with uppercase letter'),
  age: z
    .number({
      required_error: 'Age is required',
      invalid_type_error: 'Age must be a number',
    })
    .min(0, 'Age cannot be negative')
    .max(120, 'Age must be realistic'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Please select gender',
  }),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, 'You must accept Terms and Conditions'),
  avatar: z.string().optional(),
  password: z.string().optional(),
  country: z.string().optional(),
});

export type FormData = z.infer<typeof formDataSchema>;

export type StoredFormData = {
  [K in keyof FormData]: FormData[K] extends string | undefined
    ? string
    : FormData[K];
};

export interface Submission {
  id: string;
  submittedAt: string;
  formType: 'uncontrolled' | 'rhf';
  data: StoredFormData;
}
