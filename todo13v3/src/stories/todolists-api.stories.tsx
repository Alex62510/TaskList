import React, {useEffect, useState} from 'react'
import {TodolistApi} from "../api/todolist-api";

export default {
    title: 'api'
}
export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
       TodolistApi.getTodolists()
       .then((res)=>{
            setState(res.data)
        })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title="JSX"
        TodolistApi.createTodolist(title)
        .then((res)=> {
            setState(res.data)
        })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}


export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoid='3f792c9d-dcc6-4d87-a6c8-9da8b73d430e'
            TodolistApi.deleteTodolist(todoid)
        .then((res)=>{
            setState(res.data)
        })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const title="SCSS"
        const todolistId='652c6b47-1437-45f0-a31e-83ba0fc57c0d'
            TodolistApi.updateTodolistTitle(todolistId,title)
            .then((res)=> {
                setState(res.data)
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

