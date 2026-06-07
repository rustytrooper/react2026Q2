import { useForm } from 'react-hook-form';
import { useSubmissionStore } from '../../store/submissionStore';
import { formDataSchema, type FormData } from '../../schemas/formSchema';
import { zodResolver } from '@hookform/resolvers/zod';

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
    reset
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

  // const onSubmit = (data: FormData) => {
  //   addSubmission({
  //     formType: 'rhf',
  //     data: {
  //       ...data,
  //       age: Number(data.age),
  //       avatar: '', 
  //     }
  //   });

  //   reset(); 
  //   onSuccess?.();
  // };
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div >
        <label htmlFor="name">
          Name <span >*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
        />
        {errors.name && (
          <p >
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="age">
          Age <span >*</span>
        </label>
        <input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && (
          <p >
            {errors.age.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="email" >
          Email <span>*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
        />
        {errors.email && (
          <p >
            {errors.email.message}
          </p>
        )}
      </div>
      <div >
        <label>
          Gender <span>*</span>
        </label>
        <div>
          <label htmlFor="gender-male" >
            <input
              id="gender-male"
              type="radio"
              value="male"
              {...register('gender')}
            />
            {' '}Male
          </label>
          <label htmlFor="gender-female">
            <input
              id="gender-female"
              type="radio"
              value="female"
              {...register('gender')}
            />
            {' '}Female
          </label>
          <label htmlFor="gender-other">
            <input
              id="gender-other"
              type="radio"
              value="other"
              {...register('gender')}
            />
            {' '}Other
          </label>
        </div>
        {errors.gender && (
          <p >
            {errors.gender.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="terms" >
          <input
            id="terms"
            type="checkbox"
            {...register('termsAccepted')}
          />
          I accept the Terms and Conditions <span>*</span>
        </label>
        {errors.termsAccepted && (
          <p >
            {errors.termsAccepted.message}
          </p>
        )}
      </div>
      <div>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={!isValid}
        >
          Submit
        </button>
      </div>
    </form>
  );
};