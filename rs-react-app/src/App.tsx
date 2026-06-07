import { useState } from 'react';
import { Modal } from './components/Modal/Modal';
import { ReactHookForm } from './components/Forms/ReactHookForm';
import { UncontrolledForm } from './components/Forms/UncontrolledForm';
import { SubmissionsList } from './components/SubmissionList/SubmissionsList';

type FormType = 'uncontrolled' | 'rhf' | null;

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeForm, setActiveForm] = useState<FormType>(null);
  const [lastSubmissionId] = useState<string | null>(null);

  const openModal = (formType: 'uncontrolled' | 'rhf') => {
    setActiveForm(formType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSuccess = () => {
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <p className="text-3xl font-bold text-gray-500 mb-2">
            📝 React Forms Task
          </p>
          <p className="text-gray-600">
            Choose a form type to submit your information
          </p>
        </div>

        <div className="flex gap-4 justify-center  mb-12">
          <button
            onClick={() => openModal('uncontrolled')}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md cursor-pointer"
          >
            📝 Open Uncontrolled Form
          </button>
          <button
            onClick={() => openModal('rhf')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
          >
            ⚛️ Open React Hook Form
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-2xl font-bold text-gray-500 mb-4">
            📋 Form Submissions History
          </p>
          <SubmissionsList highlightId={lastSubmissionId} />
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={
            activeForm === 'uncontrolled'
              ? 'Uncontrolled Form'
              : 'React Hook Form'
          }
        >
          {activeForm === 'uncontrolled' && (
            <UncontrolledForm
              onSuccess={handleFormSuccess}
              onCancel={closeModal}
            />
          )}
          {activeForm === 'rhf' && (
            <ReactHookForm
              onSuccess={handleFormSuccess}
              onCancel={closeModal}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}

export default App;
