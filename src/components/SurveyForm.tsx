import React, { useState, useEffect } from 'react';
import DatePicker from './DatePicker';
import SuccessModal from './SuccessModal';
import { 
  submitSurvey, 
  checkUserSurvey, 
  isAuthenticated, 
  sendSurveyEmail, 
  getUserEmail 
} from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import '../styles/survey.css';

const SurveyForm = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [answers, setAnswers] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [submittedData, setSubmittedData] = useState({
    date: '',
    question1: '',
    question2: '',
    question3: '',
    question4: '',
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Debes iniciar sesión para responder la encuesta');
      navigate('/login');
      return;
    }

    const checkSurvey = async () => {
      const response = await checkUserSurvey();
      if (response.success && response.data?.hasAnswered) {
        setHasAnswered(true);
      }
    };
    checkSurvey();
  }, [navigate]);

  const handleAnswerChange = (question: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [question]: value }));
  };

  const handleSubmit = async () => {
    if (!date) {
      alert('Por favor selecciona una fecha');
      return;
    }

    if (Object.values(answers).some((answer) => !answer)) {
      alert('Por favor responde todas las preguntas');
      return;
    }

    setIsLoading(true);

    try {
      const surveyData = {
        date,
        question1: answers.question1,
        question2: answers.question2,
        question3: answers.question3,
        question4: answers.question4,
      };

      // Enviar encuesta
      const response = await submitSurvey(surveyData);

      if (response.success) {
        // Obtener email del usuario
        const userEmail = getUserEmail();

        if (userEmail) {
          // Enviar email con las respuestas
          const emailContent = `
RESPUESTAS DE ENCUESTA - COMPENSAR
====================================

Fecha: ${surveyData.date}
Pregunta 1: ${surveyData.question1}
Pregunta 2: ${surveyData.question2}
Pregunta 3: ${surveyData.question3}
Pregunta 4: ${surveyData.question4}

====================================
Fecha de registro: ${new Date().toLocaleString('es-CO')}
          `.trim();

          await sendSurveyEmail({
            to: userEmail,
            subject: 'Copia de tus respuestas - Encuesta Compensar',
            body: emailContent,
            surveyData: surveyData,
          });
        }

        setSubmittedData(surveyData);
        setShowSuccessModal(true);
      } else {
        alert(response.error || 'Error al enviar la encuesta');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error al enviar la encuesta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate('/login');
  };

  if (hasAnswered) {
    return (
      <div className="survey-container">
        <img
          src="/logo-compensar.png"
          alt="Compensar"
          className="survey-logo-fixed"
        />
        <div className="survey-card">
          <div className="survey-header">
            <h2>Encuesta</h2>
            <button className="close-button" onClick={() => navigate('/login')}>×</button>
          </div>
          <div className="already-answered">
            <p>Ya has respondido esta encuesta anteriormente.</p>
            <button className="submit-button" onClick={() => navigate('/login')}>
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="survey-container">
        <img
          src="/logo-compensar.png"
          alt="Compensar"
          className="survey-logo-fixed"
        />
        <div className="survey-card">
          <div className="survey-header">
            <h2>Encuesta</h2>
            <button className="close-button" onClick={() => navigate('/login')}>×</button>
          </div>

          <div className="survey-body">
            <div className="form-group">
              <label>Fecha</label>
              <DatePicker value={date} onChange={setDate} />
            </div>

            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="form-group">
                <label>Pregunta {num}</label>
                <div className="radio-group">
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <label key={option} className="radio-option">
                      <input
                        type="radio"
                        name={`question${num}`}
                        value={option}
                        checked={answers[`question${num}` as keyof typeof answers] === option}
                        onChange={(e) => handleAnswerChange(`question${num}`, e.target.value)}
                        disabled={isLoading}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button 
              className="submit-button" 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      </div>

      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleCloseModal}
        surveyData={submittedData}
      />
    </>
  );
};

export default SurveyForm;