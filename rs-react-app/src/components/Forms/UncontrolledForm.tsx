// import { useRef, useState } from 'react';
// import { z } from 'zod';
// import { useSubmissionStore } from '../../store/submissionStore';

// // Та же самая схема валидации (переиспользуем)
// const formSchema = z.object({
//   name: z.string().min(1, 'Name is required').regex(/^[A-Z]/, 'Name must start with uppercase letter'),
//   age: z.number().min(0, 'Age cannot be negative').max(120, 'Age must be realistic'),
//   email: z.string().min(1, 'Email is required').email('Invalid email format'),
//   gender: z.enum(['male', 'female', 'other'], { required_error: 'Please select gender' }),
//   termsAccepted: z.boolean().refine(val => val === true, 'You must accept Terms and Conditions'),
// });

// interface UncontrolledFormProps {
//   onSuccess?: () => void;
//   onCancel?: () => void;
// }

// export const UncontrolledForm = ({ onSuccess, onCancel }: UncontrolledFormProps) => {
//   const addSubmission = useSubmissionStore((state) => state.addSubmission);

//   // Refs для полей
//   const nameRef = useRef<HTMLInputElement>(null);
//   const ageRef = useRef<HTMLInputElement>(null);
//   const emailRef = useRef<HTMLInputElement>(null);
//   const genderRef = useRef<HTMLInputElement>(null);
//   const termsRef = useRef<HTMLInputElement>(null);

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Собираем данные из refs
//     const formData = {
//       name: nameRef.current?.value || '',
//       age: Number(ageRef.current?.value),
//       email: emailRef.current?.value || '',
//       gender: genderRef.current?.value || '',
//       termsAccepted: termsRef.current?.checked || false,
//     };

//     // Валидация через Zod
//     const result = formSchema.safeParse(formData);

//     if (!result.success) {
//       // Форматируем ошибки
//       const formattedErrors: Record<string, string> = {};
//       result.error.errors.forEach(err => {
//         if (err.path[0]) {
//           formattedErrors[err.path[0].toString()] = err.message;
//         }
//       });
//       setErrors(formattedErrors);
//       return;
//     }

//     // Очищаем ошибки
//     setErrors({});

//     // Сохраняем в стор
//     addSubmission({
//       formType: 'uncontrolled',
//       data: {
//         ...result.data,
//         avatar: '', // добавим позже
//         password: '', // добавим позже
//         country: '', // добавим позже
//       }
//     });

//     // Очищаем форму (сброс refs)
//     if (nameRef.current) nameRef.current.value = '';
//     if (ageRef.current) ageRef.current.value = '';
//     if (emailRef.current) emailRef.current.value = '';
//     if (genderRef.current) genderRef.current.checked = false;
//     if (termsRef.current) termsRef.current.checked = false;

//     onSuccess?.();
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       {/* Name поле */}
//       <div style={{ marginBottom: '16px' }}>
//         <label htmlFor="uncontrolled-name" style={{ display: 'block', marginBottom: '4px' }}>
//           Name <span style={{ color: 'red' }}>*</span>
//         </label>
//         <input
//           id="uncontrolled-name"
//           ref={nameRef}
//           type="text"
//           style={{
//             width: '100%',
//             padding: '8px',
//             border: `1px solid ${errors.name ? 'red' : '#ccc'}`,
//             borderRadius: '4px'
//           }}
//         />
//         {errors.name && <p style={{ color: 'red', fontSize: '12px' }}>{errors.name}</p>}
//       </div>

//       {/* Аналогично для age, email, gender, terms */}
//       {/* ... (структура такая же как в RHF) */}

//       <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
//         <button type="button" onClick={onCancel}>
//           Cancel
//         </button>
//         <button type="submit">
//           Submit
//         </button>
//       </div>
//     </form>
//   );
// };

// components/Forms/UncontrolledForm.tsx
import { useRef, useState } from 'react';
import { useSubmissionStore } from '../../store/submissionStore';
import { formDataSchema,  } from '../../schemas/formSchema';

interface UncontrolledFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const UncontrolledForm = ({ onSuccess, onCancel }: UncontrolledFormProps) => {
  const addSubmission = useSubmissionStore((state) => state.addSubmission);

  // Refs для полей
  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLInputElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null); // добавим позже
  const confirmPasswordRef = useRef<HTMLInputElement>(null); // добавим позже
  const countryRef = useRef<HTMLInputElement>(null); // добавим позже
  const avatarRef = useRef<HTMLInputElement>(null); // добавим позже

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Собираем данные из refs
    const formData = {
      name: nameRef.current?.value || '',
      age: Number(ageRef.current?.value),
      email: emailRef.current?.value || '',
      gender: genderRef.current?.value as 'male' | 'female' | 'other' || 'male',
      termsAccepted: termsRef.current?.checked || false,
      // Для advanced fields пока пустые значения
      avatar: '',
      password: '',
      country: '',
    };

    // Валидация через Zod схему (используем импортированную схему!)
    const result = formDataSchema.safeParse(formData);
     // Type guard: проверяем success
      if (!result.success) {
        // Теперь TypeScript знает, что result.error существует
        const formattedErrors: Record<string, string> = {};

        // result.error.errors теперь доступно!
        result.error.issues.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });

        setErrors(formattedErrors);
        return;
      }

    // if (!result.success) {
    //   // Форматируем ошибки Zod в удобный формат
    //   const formattedErrors: Record<string, string> = {};
    //   result.error.errors.forEach(err => {
    //     if (err.path[0]) {
    //       formattedErrors[err.path[0].toString()] = err.message;
    //     }
    //   });
    //   setErrors(formattedErrors);
    //   return;
    // }

    // Очищаем ошибки
    setErrors({});

    // Подготавливаем данные для стора (все поля обязательные)
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

    // Сохраняем в стор
    addSubmission({
      formType: 'uncontrolled',
      data: storedData,
    });

    // Очищаем форму (сброс refs)
    if (nameRef.current) nameRef.current.value = '';
    if (ageRef.current) ageRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (genderRef.current) genderRef.current.checked = false;
    if (termsRef.current) termsRef.current.checked = false;
    if (passwordRef.current) passwordRef.current.value = '';
    if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';
    if (countryRef.current) countryRef.current.value = '';
    if (avatarRef.current) avatarRef.current.value = '';

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name поле */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="uncontrolled-name" style={{ display: 'block', marginBottom: '4px' }}>
          Name <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          id="uncontrolled-name"
          ref={nameRef}
          type="text"
          style={{
            width: '100%',
            padding: '8px',
            border: `1px solid ${errors.name ? 'red' : '#ccc'}`,
            borderRadius: '4px'
          }}
        />
        {errors.name && <p style={{ color: 'red', fontSize: '12px' }}>{errors.name}</p>}
      </div>

      {/* Age поле */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="uncontrolled-age" style={{ display: 'block', marginBottom: '4px' }}>
          Age <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          id="uncontrolled-age"
          ref={ageRef}
          type="number"
          style={{
            width: '100%',
            padding: '8px',
            border: `1px solid ${errors.age ? 'red' : '#ccc'}`,
            borderRadius: '4px'
          }}
        />
        {errors.age && <p style={{ color: 'red', fontSize: '12px' }}>{errors.age}</p>}
      </div>

      {/* Email поле */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="uncontrolled-email" style={{ display: 'block', marginBottom: '4px' }}>
          Email <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          id="uncontrolled-email"
          ref={emailRef}
          type="email"
          style={{
            width: '100%',
            padding: '8px',
            border: `1px solid ${errors.email ? 'red' : '#ccc'}`,
            borderRadius: '4px'
          }}
        />
        {errors.email && <p style={{ color: 'red', fontSize: '12px' }}>{errors.email}</p>}
      </div>

      {/* Gender picker */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px' }}>
          Gender <span style={{ color: 'red' }}>*</span>
        </label>
        <div>
          <label htmlFor="uncontrolled-gender-male" style={{ marginRight: '16px' }}>
            <input
              id="uncontrolled-gender-male"
              type="radio"
              name="gender" // Важно: все radio должны иметь одинаковое name
              value="male"
              ref={genderRef}
              defaultChecked
            />
            {' '}Male
          </label>
          <label htmlFor="uncontrolled-gender-female" style={{ marginRight: '16px' }}>
            <input
              id="uncontrolled-gender-female"
              type="radio"
              name="gender"
              value="female"
              ref={genderRef}
            />
            {' '}Female
          </label>
          <label htmlFor="uncontrolled-gender-other">
            <input
              id="uncontrolled-gender-other"
              type="radio"
              name="gender"
              value="other"
              ref={genderRef}
            />
            {' '}Other
          </label>
        </div>
        {errors.gender && (
          <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
            {errors.gender}
          </p>
        )}
      </div>

      {/* Terms and Conditions checkbox */}
      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="uncontrolled-terms" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            id="uncontrolled-terms"
            type="checkbox"
            ref={termsRef}
          />
          I accept the Terms and Conditions <span style={{ color: 'red' }}>*</span>
        </label>
        {errors.termsAccepted && (
          <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
            {errors.termsAccepted}
          </p>
        )}
      </div>

      {/* Кнопки */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit">
          Submit
        </button>
      </div>
    </form>
  );
};