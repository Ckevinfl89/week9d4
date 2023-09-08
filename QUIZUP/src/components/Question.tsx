import { useState } from 'react';
import QuestionType from '../types/question';

type QuestionProps = {
    question: QuestionType;
};

export default function Question({ question }: QuestionProps) {
    const [answer, setAnswer] = useState('');

    const handleGetAnswer = () => {
        if (answer === '') {
            setAnswer(question.answer);
        } else {
            setAnswer('');
        }
    };

    return (
        <div className="question-card text-center">
            <div>
                {question.question && <h3>{question.question}</h3>}
                {question.author && <h5>By {typeof question.author === 'string' ? question.author : question.author.firstName}</h5>}
                {answer && <p>{answer}</p>}
                {question.question && question.answer && <button onClick={handleGetAnswer}>Get Answer</button>}
            </div>
        </div>
    );
}