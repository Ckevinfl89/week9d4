import { useState, useEffect } from 'react';
import Question from "../components/Question";
import SubmitQuestion from '../components/SubmitQuestion';
import CategoryType from '../types/category';
import QuestionType from '../types/question';
import UserType from '../types/auth';
import { getAllQuestions } from '../lib/apiWrapper';

type HomeProps = {
    isLoggedIn: boolean,
    user: Partial<UserType>|null,
    flashMessage: (message:string|null, category: CategoryType|null) => void,
}

export default function Home({ isLoggedIn, user, flashMessage }: HomeProps) {
    
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [newQuestion, setNewQuestion] = useState<Partial<QuestionType>>({id: 1, question: ''})

    useEffect(() => {
        async function fetchData(){
            try {
                const response = await getAllQuestions();
    
                if(response && response.data && Array.isArray(response.data.questions)){
                    setQuestions(response.data.questions);
                }
            } catch (error) {
                console.error("Failed to fetch data: ", error);
            }
        }
        
        fetchData();
    }, []);
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewQuestion({...newQuestion, [event.target.name]: event.target.value})
    }

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        setNewQuestion({id: questions.length + 2, question: ''});

        flashMessage(`${newQuestion.question} has been created`, 'primary');
    }

    return (
        <>
            <h1>Hello {isLoggedIn ? user?.firstName + ' ' + user?.lastName : 'Friend'}</h1>
            <SubmitQuestion handleChange={handleInputChange} handleSubmit={handleFormSubmit} newQuestion={newQuestion} isLoggedIn={isLoggedIn}/>
            {questions.map((question) => (
                <Question question={question} key={question.id} />
            ))}
        </>
    )
}