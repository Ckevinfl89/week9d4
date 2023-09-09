import UserType from "./auth"

type QuestionType = {
    id:number,
    question: string,
    answer: string,
    createdOn: string,
    userId: number,
    author: UserType,
}

export default QuestionType