import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import SubmitQuestion from '../components/SubmitQuestion'
import Question from '../components/Question'
import CategoryType from '../types/category';
import QuestionType from '../types/question';
import UserType from '../types/auth';
import { getAllQuestions, createQuestion } from '../lib/apiWrapper';


type HomeProps = {
    isLoggedIn: boolean,
    user: UserType|null,
    flashMessage: (message:string|null, category: CategoryType|null) => void,
}

export default function Home({ isLoggedIn, user, flashMessage }: HomeProps) {
    
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [newQuestion, setNewQuestion] = useState<Partial<QuestionType>>({id: 1, question: '', answer: ''})
    const [displayForm, setDisplayForm] = useState(false);

    useEffect(() => {
        async function fetchData(){
            const response = await getAllQuestions();
            console.log(response);
            if (response && response.data && Array.isArray(response.data.questions)){
                const questions = response.data
                setQuestions(questions.questions);
            }
        }

        fetchData();
    }, [newQuestion.id])

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewQuestion({...newQuestion, [event.target.name]: event.target.value})
    }

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // setPosts([...posts, newPost]);
        const token = localStorage.getItem('token') || ''
        const response = await createQuestion(token, newQuestion);
        if (response.error){
            flashMessage(response.error, 'danger')
        } else {
            setNewQuestion({id: questions.length + 2, question: '', answer: ''});
            flashMessage(`${newQuestion.question} has been created`, 'primary');
            setDisplayForm(false);
        }
    }


    return (
        <>
            <h1>Hello {isLoggedIn ? user?.firstName + ' ' + user?.lastName : 'Friend'}</h1>
            {isLoggedIn && <Button variant='success' className='w-100' onClick={() => setDisplayForm(!displayForm)}>Create New Question</Button>}
            { displayForm && (
                <SubmitQuestion handleChange={handleInputChange} handleSubmit={handleFormSubmit} newQuestion={newQuestion} isLoggedIn={isLoggedIn}/>
            )}
            {questions.map( p => <Question question={p}  key={p.id} currentUser={user} /> )}
        </>
    )
}