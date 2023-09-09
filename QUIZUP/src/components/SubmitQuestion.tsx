import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import QuestionType from '../types/question';


type SubmitQuestionProps = {
    handleChange: (e:React.ChangeEvent<HTMLInputElement>) => void,
    handleSubmit: (e:React.FormEvent) => void,
    newQuestion: Partial<QuestionType>,
    isLoggedIn: boolean
}

export default function SubmitQuestion({ handleChange, handleSubmit, newQuestion, isLoggedIn }: SubmitQuestionProps) {
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Label>Question</Form.Label>
            <Form.Control name='question' placeholder='Question here' onChange={handleChange} value={newQuestion.question} />
            <Form.Control name='answer' placeholder='Answer Here'onChange={handleChange} value={newQuestion.answer} />
            <Button className='mt-3 w-100' variant='warning' type='submit' disabled={!isLoggedIn}>Create Question</Button>
        </Form>
    )
}