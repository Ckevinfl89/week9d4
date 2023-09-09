import axios from 'axios';
import QuestionType from '../types/question';
import UserType from '../types/auth';



const base: string = 'https://cae-bookstore.herokuapp.com';
const allQuestionsEndpoint: string = '/question/all';
const userEndpoint: string = '/user';
const tokenEndpoint: string = '/login';
const questionEndpoint: string = '/question';


const apiClientNoAuth = () => axios.create({
    baseURL: base
})

const apiClientBasicAuth = (email:string, password:string) => axios.create({
    baseURL: base,
    headers: {
        Authorization: 'Basic ' + btoa(`${email}:${password}`)
    }
})

const apiClientTokenAuth = (token:string) => axios.create({
    baseURL: base,
    headers: {
        Authorization: 'Bearer ' + token
    }
})

type APIResponse<T> = {
    error?: string,
    data?: T
}

type TokenType = {
    token: string,
    tokenExpiration: string
}


async function getAllQuestions(): Promise<APIResponse<QuestionType[]>> {
    let error;
    let data;
    try{
        const response = await apiClientNoAuth().get(allQuestionsEndpoint);
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.message
        } else {
            error = 'Something went wrong'
        }
    }
    return {error, data}
}

async function register(newUserData:Partial<UserType>): Promise<APIResponse<UserType>> {
    let error;
    let data;
    try {
        const myObj = {
            first_name: newUserData.firstName,
            last_name: newUserData.lastName,
            email: newUserData.email,
            password: newUserData.password
        }
        console.log(myObj)
        const response = await apiClientNoAuth().post(userEndpoint, myObj)
        console.log('Here is the response data:', data)
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return {error, data}
}

async function login(email:string, password:string): Promise<APIResponse<TokenType>> {
    let error;
    let data;
    try{
        const response = await apiClientBasicAuth(email, password).get(tokenEndpoint);
        data = response.data
    } catch(err){
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong'
        }
    }
    return {error, data}
}




async function createQuestion(token:string, newQuestion: Partial<QuestionType>): Promise<APIResponse<QuestionType>> {
    let error;
    let data;
    try {
        const myObj = {
            question: newQuestion.question,
            answer: newQuestion.answer,
    
        }
        const response = await apiClientTokenAuth(token).post(questionEndpoint, myObj);
        data = response.data
    } catch(err) {
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong';
        }
    }
    return {error, data}
}

async function getQuestionById(token:string): Promise<APIResponse<QuestionType>> {
    let error;
    let data;
    try{
        const response = await apiClientTokenAuth(token).get(questionEndpoint);
        data = response.data;
    } catch(err){
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong';
        }
    }
    return {error, data}
}


async function editQuestionById(id: string, answer: string, token: string) {
    const url = `https://cae-bookstore.herokuapp.com/question/${id}`;
    const data = {
        answer: answer
    };
    const config = {
        headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.put(url, data, config);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

async function deleteQuestionById(token:string, questionId:string|number): Promise<APIResponse<string>>{
    let error;
    let data;
    try {
        const response = await apiClientTokenAuth(token).delete(questionEndpoint + '/' + questionId);
        data = response.data.success
    } catch(err){
        if (axios.isAxiosError(err)){
            error = err.response?.data.error
        } else {
            error = 'Something went wrong';
        }
    }
    return {error, data}
}

export {
    getAllQuestions,
    register,
    login,
    createQuestion,
    getQuestionById,
    editQuestionById,
    deleteQuestionById,
}