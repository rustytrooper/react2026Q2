import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSubmissionStore } from '../../store/submissionStore';
import { formDataSchema, type FormData } from '../../schemas/formSchema';

interface ReactHookFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ReactHookForm = ({ onSuccess, onCancel }: ReactHookFormProps) => {
  const addSubmission = useSubmissionStore((state) => state.addSubmission);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formDataSchema),
    defaultValues: {
      name: '',
      age: undefined,
      email: '',
      gender: undefined,
      termsAccepted: false,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: FormData) => {
    const storedData = {
      name: data.name,
      age: data.age,
      email: data.email,
      gender: data.gender,
      termsAccepted: data.termsAccepted,
      avatar: data.avatar || '',
      password: data.password || '',
      country: data.country || '',
    };

    addSubmission({
      formType: 'rhf',
      data: storedData,
    });

    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="age"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Age <span className="text-red-500">*</span>
        </label>
        <input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.age ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.age && (
          <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
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
              value="male"
              {...register('gender')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2">Male</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="female"
              {...register('gender')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2">Female</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              value="other"
              {...register('gender')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2">Other</span>
          </label>
        </div>
        {errors.gender && (
          <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
        )}
      </div>
      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            {...register('termsAccepted')}
            className="text-blue-600 focus:ring-blue-500 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">
            I accept the Terms and Conditions{' '}
            <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.termsAccepted && (
          <p className="text-red-500 text-sm mt-1">
            {errors.termsAccepted.message}
          </p>
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
          disabled={!isValid}
          className={`px-4 py-2 text-white rounded-md transition-colors cursor-pointer ${
            isValid
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
    </form>
  );
};
