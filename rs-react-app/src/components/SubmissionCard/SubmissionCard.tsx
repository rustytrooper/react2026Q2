import type { Submission } from '../../schemas/formSchema';

export const SubmissionCard = ({
  submission,
  isHighlighted,
}: {
  submission: Submission;
  isHighlighted: boolean;
}) => {
  return (
    <div
      className={`
        rounded-lg p-4 transition-all duration-300
        ${
          isHighlighted
            ? 'border-2 border-green-500 bg-green-50 shadow-lg shadow-green-200 animate-highlight'
            : 'border border-gray-200 bg-white shadow-sm hover:shadow-md'
        }
      `}
    >
      {submission.data.avatar && (
        <div className="mt-3">
          <img
            src={submission.data.avatar}
            alt="Avatar"
            className="w-12 h-12 mb-2 rounded-full object-cover"
          />
        </div>
      )}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 m-0">
          {submission.data.name}
        </h3>
        <span
          className={`
          text-xs px-2 py-1 rounded-full font-medium
          ${
            submission.formType === 'uncontrolled'
              ? 'bg-gray-200 text-gray-700'
              : 'bg-blue-600 text-white'
          }
        `}
        >
          {submission.formType === 'uncontrolled'
            ? 'Uncontrolled'
            : 'React Hook Form'}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <p className="flex items-center gap-1 m-0">
          <strong>📧 Email:</strong> {submission.data.email}
        </p>
        <p className="flex items-center gap-1 m-0">
          <strong>🎂 Age:</strong> {submission.data.age}
        </p>
        <p className="flex items-center gap-1 m-0">
          <strong>⚥ Gender:</strong> {submission.data.gender}
        </p>
        <p className="flex items-center gap-1 m-0">
          <strong>✅ Terms:</strong>
          <span
            className={
              submission.data.termsAccepted ? 'text-green-600' : 'text-red-600'
            }
          >
            {submission.data.termsAccepted ? 'Accepted' : 'Not accepted'}
          </span>
        </p>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400 m-0">
          Submitted: {new Date(submission.submittedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};
