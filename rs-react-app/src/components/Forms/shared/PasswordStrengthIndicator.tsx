interface PasswordStrengthIndicatorProps {
  password: string;
}

interface StrengthRequirement {
  label: string;
  test: (pwd: string) => boolean;
}

export const PasswordStrengthIndicator = ({
  password,
}: PasswordStrengthIndicatorProps) => {
  const requirements: StrengthRequirement[] = [
    { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { label: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'One number', test: (pwd) => /[0-9]/.test(pwd) },
    { label: 'One special character', test: (pwd) => /[^A-Za-z0-9]/.test(pwd) },
  ];

  const fulfilledCount = requirements.filter((req) =>
    req.test(password)
  ).length;
  const strengthPercent = (fulfilledCount / requirements.length) * 100;

  const getStrengthColor = () => {
    if (strengthPercent <= 20) return 'bg-red-500';
    if (strengthPercent <= 40) return 'bg-orange-500';
    if (strengthPercent <= 60) return 'bg-yellow-500';
    if (strengthPercent <= 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (strengthPercent <= 20) return 'Very Weak';
    if (strengthPercent <= 40) return 'Weak';
    if (strengthPercent <= 60) return 'Fair';
    if (strengthPercent <= 80) return 'Good';
    return 'Strong';
  };

  return (
    <div className="mt-2 space-y-2">
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${strengthPercent}%` }}
        />
      </div>

      <p className="text-xs text-gray-600">
        Password strength:{' '}
        <span className="font-semibold">{getStrengthText()}</span>
      </p>
      <ul className="text-xs space-y-1">
        {requirements.map((req, index) => {
          const isMet = req.test(password);
          return (
            <li
              key={index}
              className={isMet ? 'text-green-600' : 'text-gray-400'}
            >
              {isMet ? '✓' : '○'} {req.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
