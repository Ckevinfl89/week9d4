import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { getQuestionById, editQuestionById, deleteQuestionById } from '../lib/apiWrapper';
import CategoryType from '../types/category';
import QuestionType from '../types/question';
import UserType from '../types/auth';

type EditQuestionProps = {
    flashMessage: (message:string, category: CategoryType) => void,
    currentUser: UserType|null,
}

export default function EditQuestion({ flashMessage, currentUser }: EditQuestionProps) {
    const { questionId } = useParams();
    const navigate = useNavigate();

    const [questionToEdit, setQuestionToEdit] = useState<QuestionType|null>(null);
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    useEffect(() => {
        async function getQuestion(){
            let response = await getQuestionById(questionId!);
            if (response.error){
                flashMessage(response.error, 'danger');
                navigate('/');
            } else {
                setQuestionToEdit(response.data!);
            }
        }
        getQuestion();
    }, [flashMessage, navigate, questionId])

    useEffect(() => {
        if (questionToEdit){
            if (questionToEdit.author.id !== currentUser?.id){
                flashMessage('You do not have permission to edit this post. Who do you think you are?!', 'danger');
                navigate('/')
            }
        }
    })

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setQuestionToEdit({...questionToEdit, [e.target.name]: e.target.value} as QuestionType)
    }

    const handleFormSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Something is happening')
        const token = localStorage.getItem('token') || ''
        const response = await editQuestionById(token, questionId!, questionToEdit!);
        if (response.error){
            flashMessage(response.error, 'danger')
        } else {
            flashMessage(`${response.data?.question} has been updated`, 'success')
            navigate('/')
        }
    }

    const handleDeleteQuestion = async () => {
        const token = localStorage.getItem('token') || ''
        const response = await deleteQuestionById(token, questionId!);
        if (response.error){
            flashMessage(response.error, 'danger')
        } else {
            flashMessage(response.data!, 'primary');
            navigate('/')
        }
    }

    return (
        <>
            <h1 className="text-center">Edit {questionToEdit?.question}</h1>
            {questionToEdit && (
                <Card>
                    <Card.Body>
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Label>Edit Question</Form.Label>
                            <Form.Control name='question' value={questionToEdit?.question} onChange={handleInputChange} />
                            <Form.Label>Edit Answer</Form.Label>
                            <Form.Control name='answer' value={questionToEdit?.answer} onChange={handleInputChange} />
                            <Button variant='success' className='mt-3 w-50' type='submit'>Edit Question</Button>
                            <Button variant='danger' className='mt-3 w-50' onClick={openModal}>Delete Question</Button>
                        </Form>
                    </Card.Body>
                </Card>
            )}
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete {questionToEdit?.question}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {questionToEdit?.question}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                    <Button variant="danger" onClick={handleDeleteQuestion}>Delete Question</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}