import axios from "axios";

const instanse=axios.create({
    baseURL:'https://social-network.samuraijs.com/api/1.1/todo-lists/',
    withCredentials:true
})
export const TasksApi={
    getTasks(todolistId:string){
        return   instanse.get(`${todolistId}/tasks`)
    },
    createTasks(todolistId:string,title:string){
        return   instanse.post(`${todolistId}/tasks`,{title})
    },
    deleteTasks(todolistId:string,taskId:string){
        return   instanse.delete(`${todolistId}/tasks/${taskId}`)
    },
    changeTasks(title:string,todolistId:string,taskId:string){
        return   instanse.put(`${todolistId}/tasks/${taskId}`)
    }
}