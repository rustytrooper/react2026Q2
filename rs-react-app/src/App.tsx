// import './App.css';

// function App() {


//   return (
//     <>
//     </>
//   );
// }

// export default App;
// App.tsx
import { useState } from 'react';
import { Modal } from './components/Modal/Modal';
import { ReactHookForm } from './components/Forms/ReactHookForm';
import { UncontrolledForm } from './components/Forms/UncontrolledForm';
import { SubmissionsList } from './components/SubmissionList/SubmissionsList';
// import { SubmissionsList } from './components/SubmissionsList';

// Тип для выбранной формы
type FormType = 'uncontrolled' | 'rhf' | null;

function App() {
  // Состояние для модалки
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Какая форма сейчас активна
  const [activeForm, setActiveForm] = useState<FormType>(null);

  // Состояние для визуального фидбека (не обязательно, можно в SubmissionsList)
  const [lastSubmissionId, setLastSubmissionId] = useState<string | null>(null);

  // Функция открытия модалки с определенной формой
  const openModal = (formType: 'uncontrolled' | 'rhf') => {
    setActiveForm(formType);
    setIsModalOpen(true);
  };

  // Функция закрытия модалки
  const closeModal = () => {
    setIsModalOpen(false);
    // Сбрасываем активную форму после закрытия (опционально)
    // setActiveForm(null);
  };

  // Обработчик успешной отправки формы
  const handleFormSuccess = (submissionId?: string) => {
    closeModal(); // Закрываем модалку

    // Если передан ID, сохраняем для подсветки
    if (submissionId) {
      setLastSubmissionId(submissionId);
      // Через 3 секунды убираем подсветку
      setTimeout(() => setLastSubmissionId(null), 3000);
    }
  };

  return (
    <div className="app" style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px' 
    }}>
      {/* Заголовок */}
      <h1>📝 React Forms Task</h1>

      {/* Блок с кнопками открытия форм */}
      <div className="forms-buttons" style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '32px' 
      }}>
        <button 
          onClick={() => openModal('uncontrolled')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📝 Open Uncontrolled Form
        </button>

        <button 
          onClick={() => openModal('rhf')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ⚛️ Open React Hook Form
        </button>
      </div>

      {/* Секция с историей сабмитов */}
      <div className="submissions-section">
        <h2>📋 Form Submissions History</h2>
        <SubmissionsList  highlightId={lastSubmissionId} />
      </div>

      {/* Модалка с порталом */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
      >
        {/* Условный рендеринг формы в зависимости от activeForm */}
        {activeForm === 'uncontrolled' && (
          <UncontrolledForm 
            onSuccess={() => handleFormSuccess()}
            onCancel={closeModal}
          />
        )}

        {activeForm === 'rhf' && (
          <ReactHookForm 
            onSuccess={() => handleFormSuccess()}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;