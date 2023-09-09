import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import QuestionType from '../types/question';
import UserType from '../types/auth';

type QuestionProps = {
    question: QuestionType,
    currentUser: UserType|null,
};

export default function Question({ question, currentUser }: QuestionProps) {
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
                {currentUser?.id === question.author.id && (
                    <Link to={`/question/${question.id}`}>
                        <Button variant='primary'>Edit Question</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}