// import type { Submission } from "../../schemas/formSchema";

import type { Submission } from "../../schemas/formSchema";

// export const SubmissionCard = ({ submission }: { submission: Submission; isNew: boolean }) => {
//   return (
//     <div 
//       className="submission-card"
//     >
//       <div >
//         <h3>{submission.data.name}</h3>
//         {submission.formType === 'uncontrolled' ? (
//           <span>
//             Uncontrolled
//           </span>
//         ) : (
//           <span >
//             RHF
//           </span>
//         )}
//       </div>

//       {submission.data.avatar && (
//         <img 
//           src={submission.data.avatar} 
//           alt="Avatar" 
//         />
//       )}

//       <p> {submission.data.email}</p>
//       <p> Age: {submission.data.age}</p>
//       <p> Gender: {submission.data.gender}</p>
//       <p> Country: {submission.data.country}</p>
//       <p> Terms: {submission.data.termsAccepted ? 'Accepted' : 'Not accepted'}</p>
//       <p >
//         Submitted: {new Date(submission.submittedAt).toLocaleString()}
//       </p>
//     </div>
//   );
// };

export const SubmissionCard = ({ 
  submission, 
  isHighlighted 
}: { 
  submission: Submission; 
  isHighlighted: boolean;
}) => {
  return (
    <div style={{
      border: `2px solid ${isHighlighted ? '#4CAF50' : '#e0e0e0'}`,
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: isHighlighted ? '#f0fdf4' : 'white',
      transition: 'all 0.3s ease',
      boxShadow: isHighlighted ? '0 4px 12px rgba(76, 175, 80, 0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
      animation: isHighlighted ? 'highlight 0.5s ease' : 'none'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
        <h3 style={{ margin: 0 }}>{submission.data.name}</h3>
        <span style={{
          fontSize: '12px',
          padding: '2px 8px',
          borderRadius: '12px',
          backgroundColor: submission.formType === 'uncontrolled' ? '#e0e0e0' : '#2196f3',
          color: submission.formType === 'uncontrolled' ? '#333' : 'white'
        }}>
          {submission.formType === 'uncontrolled' ? 'Uncontrolled' : 'React Hook Form'}
        </span>
      </div>

      <p style={{ margin: '8px 0' }}>
        <strong>📧 Email:</strong> {submission.data.email}
      </p>
      <p style={{ margin: '8px 0' }}>
        <strong>🎂 Age:</strong> {submission.data.age}
      </p>
      <p style={{ margin: '8px 0' }}>
        <strong>⚥ Gender:</strong> {submission.data.gender}
      </p>
      <p style={{ margin: '8px 0' }}>
        <strong>✅ Terms:</strong> {submission.data.termsAccepted ? 'Accepted' : 'Not accepted'}
      </p>

      {submission.data.avatar && (
        <img 
          src={submission.data.avatar} 
          alt="Avatar" 
          style={{ width: '50px', height: '50px', borderRadius: '50%', marginTop: '8px' }}
        />
      )}

      <p style={{ fontSize: '12px', color: '#666', marginTop: '12px', borderTop: '1px solid #eee', paddingTop: '8px' }}>
        Submitted: {new Date(submission.submittedAt).toLocaleString()}
      </p>
    </div>
  );
};