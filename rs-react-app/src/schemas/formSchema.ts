import { z } from 'zod';

export const countries = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'PL', name: 'Poland' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
];

export type Country = (typeof countries)[number];

export const formDataSchema = z
  .object({
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
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(
        /[^A-Za-z0-9]/,
        'Password must contain at least one special character'
      ),
    confirmPassword: z.string(),
    country: z.string().min(1, 'Please select a country'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
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
