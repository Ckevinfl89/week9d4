import UserType from "./auth";

type QuestionType = {
    answer: string,
    author: UserType
    createdOn: string,
    id: number,
    question: string,
}

export default QuestionType