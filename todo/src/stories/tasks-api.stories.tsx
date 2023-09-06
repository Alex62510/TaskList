import React, {useEffect, useState} from "react";
import {TasksApi} from "../api/tasks-api";

export default {
    title: 'api'
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId='652c6b47-1437-45f0-a31e-83ba0fc57c0d'
      TasksApi.getTasks(todolistId)
            .then((res)=>{
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title="task_New"
        const todolistId='652c6b47-1437-45f0-a31e-83ba0fc57c0d'
TasksApi.createTasks(todolistId,title)
    .then((res)=>{
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId='652c6b47-1437-45f0-a31e-83ba0fc57c0d'
        const taskId='1fa232b2-0ce0-4601-bcc1-d100ea7e2cfa'
            TasksApi.deleteTasks(todolistId,taskId)
            .then((res)=>{
                setState(res.data)
            })
            .catch((rej)=>{console.log("no task")})
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const ChangeTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title="taskName"
        const todolistId='652c6b47-1437-45f0-a31e-83ba0fc57c0d'
        const taskId='1fa232b2-0ce0-4601-bcc1-d100ea7e2cfa'
            TasksApi.changeTasks(title,todolistId,taskId)
            .then((res)=>{
                setState(res.data)
            })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}