import { useSubmissionStore } from '../../store/submissionStore';
import { SubmissionCard } from '../SubmissionCard/SubmissionCard';

interface SubmissionsListProps {
  highlightId?: string | null;
}

export const SubmissionsList = ({ highlightId }: SubmissionsListProps) => {
  const submissions = useSubmissionStore((state) => state.submissions);

  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">
          ✨ No submissions yet. Fill out a form to see it here!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {submissions.map((submission) => (
        <SubmissionCard
          key={submission.id}
          submission={submission}
          isHighlighted={submission.id === highlightId}
        />
      ))}
    </div>
  );
};
