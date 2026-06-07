import { useRef, useState } from 'react';
import { useSubmissionStore } from '../../store/submissionStore';
import { formDataSchema } from '../../schemas/formSchema';

interface UncontrolledFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UncontrolledForm = ({
  onSuccess,
  onCancel,
}: UncontrolledFormProps) => {
  const addSubmission = useSubmissionStore((state) => state.addSubmission);

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name: nameRef.current?.value || '',
      age: Number(ageRef.current?.value),
      email: emailRef.current?.value || '',
      gender:
        (genderRef.current?.value as 'male' | 'female' | 'other') || 'male',
      termsAccepted: termsRef.current?.checked || false,
      avatar: '',
      password: '',
      country: '',
    };

    const result = formDataSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setErrors({});

    const storedData = {
      name: result.data.name,
      age: result.data.age,
      email: result.data.email,
      gender: result.data.gender,
      termsAccepted: result.data.termsAccepted,
      avatar: result.data.avatar || '',
      password: result.data.password || '',
      country: result.data.country || '',
    };

    addSubmission({
      formType: 'uncontrolled',
      data: storedData,
    });

    if (nameRef.current) nameRef.current.value = '';
    if (ageRef.current) ageRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (genderRef.current) genderRef.current.checked = false;
    if (termsRef.current) termsRef.current.checked = false;

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="uncontrolled-name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="uncontrolled-name"
          ref={nameRef}
          type="text"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="uncontrolled-age"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Age <span className="text-red-500">*</span>
        </label>
        <input
          id="uncontrolled-age"
          ref={ageRef}
          type="number"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.age ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.age && (
          <p className="text-red-500 text-sm mt-1">{errors.age}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="uncontrolled-email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="uncontrolled-email"
          ref={emailRef}
          type="email"
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender <span className="text-red-500">*</span>
        </label>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="male"
              ref={genderRef}
              defaultChecked
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2">Male</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="female"
              ref={genderRef}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2">Female</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="other"
              ref={genderRef}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2">Other</span>
          </label>
        </div>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
        )}
      </div>
      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            ref={termsRef}
            className="text-blue-600 focus:ring-blue-500 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            I accept the Terms and Conditions{' '}
            <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>
        )}
      </div>
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          Submit
        </button>
      </div>
    </form>
  );
};
