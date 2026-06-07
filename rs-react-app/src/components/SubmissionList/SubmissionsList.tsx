// import { useState, useEffect } from 'react';
// import { useSubmissionStore } from '../../store/submissionStore';
// import { SubmissionCard } from '../SubmissionCard/SubmissionCard';

// export const SubmissionsList = () => {
//   const submissions = useSubmissionStore((state) => state.submissions);
//   const [newSubmissionId, setNewSubmissionId] = useState<string | null>(null);

//   useEffect(() => {
//     if (submissions.length > 0) {
//       const latestId = submissions[0].id;
//       setNewSubmissionId(latestId);

//       const timer = setTimeout(() => setNewSubmissionId(null), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [submissions]);

//   return (
//     <div className="submissions-grid">
//       <h2>Submitted Forms History ({submissions.length})</h2>

//       {submissions.length === 0 ? (
//         <p>No submissions yet. Fill out a form to see it here!</p>
//       ) : (
//         <div>
//           {submissions.map((submission) => (
//             <SubmissionCard 
//               key={submission.id}
//               submission={submission}
//               isNew={submission.id === newSubmissionId}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// components/SubmissionsList.tsx
// import { useSubmissionStore } from '../store/submissionStore';
// import type { Submission } from '../store/submissionStore';
import { useSubmissionStore } from '../../store/submissionStore';
import { SubmissionCard } from '../SubmissionCard/SubmissionCard';

interface SubmissionsListProps {
  highlightId?: string | null; // ID для подсветки
}

export const SubmissionsList = ({ highlightId }: SubmissionsListProps) => {
  const submissions = useSubmissionStore((state) => state.submissions);

  if (submissions.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px', 
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <p>✨ No submissions yet. Fill out a form to see it here!</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gap: '16px', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' 
    }}>
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

// Карточка сабмита


// Добавь в глобальный CSS или в head
const styles = `
  @keyframes highlight {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
`;

// Если используешь CSS-in-JS, добавь style в head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}