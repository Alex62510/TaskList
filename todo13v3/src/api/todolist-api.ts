import axios from "axios";

const instanse = axios.create({
    baseURL: ' https://social-network.samuraijs.com/api/1.1/',
    withCredentials: true
})
export const TodolistApi = {
    getTodolists() {
        return instanse.get<TodolistType[]>('todo-lists')
    },
    createTodolist(title: string) {
        return instanse.post<ResponseType<{item: TodolistType}>>('todo-lists', {title})
    },
    deleteTodolist(todoid: string) {
        return instanse.delete<ResponseType>(`todo-lists/${todoid}`)
    },
    updateTodolistTitle(todolistId: string, title: string) {
        return instanse.put<ResponseType>(`todo-lists/${todolistId}`, {title})
    }
}

type TodolistType = {
    id: string,
    title: string,
    addedDate: Date,
    order: number
}
type ResponseType<T={}>={
    resultCode: number
    fieldsErrors: []
    messages: string[],
    data: T
}


