import { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
const SecurityQuestions = ({ handleChange }: { handleChange: any }) => {
  const securityQuestionOptions = [
    "What is your favorite childhood pet's name?",
    "In which city were you born?",
    "What is the name of your favorite book or movie?",
    "What is the name of the elementary school you attended?",
    "What is the model of your first car?",
  ];

  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);

  const handleQuestionChange = (index: number, selectedQuestion: string) => {
    const isDuplicate = questions.some((q, i) => i !== index && q.question === selectedQuestion);

    if (!isDuplicate) {
      const updatedQuestions = [...questions];
      updatedQuestions[index] = { ...updatedQuestions[index], question: selectedQuestion };
      setQuestions(updatedQuestions);
      handleChange(updatedQuestions);
    } else {
      console.error('Duplicate question detected.');
    }
  };

  const handleAnswerChange = (index: number, answer: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], answer };
    setQuestions(updatedQuestions);
    handleChange(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
    handleChange(updatedQuestions);
  };

  return (
    <div className='security-container'>
      <div className="questions-list-container">
        {questions.map((q, index) => (
          <div className="input-group mt-20" key={index}>
            <label>Select Security Question:</label>
            <select value={q.question} onChange={(e) => handleQuestionChange(index, e.target.value)}>
              <option value="" disabled>Select a question</option>
              {securityQuestionOptions.map((question, i) => (
                <option key={i} value={question}>
                  {question}
                </option>
              ))}
            </select>

            {q.question && (
              <div className="input-group mt-15">
                <label>Answer:</label>
                <input
                  name={`answer-${index}`}
                  type="text"
                  value={q.answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className={`form-input`}
                  placeholder={`Enter your answer for "${q.question}"`}
                  required
                />
              </div>
            )}
            <div className='security-question-features'>
              <span className="mt-5" onClick={addQuestion} title="Add Question" style={{ cursor: 'pointer'}}>Add Question</span>
              {index > 0 && (
                <span className='mt-5' onClick={() => removeQuestion(index)} title="Remove Question" style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }}>Remove Question</span>

              )}
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default SecurityQuestions;
