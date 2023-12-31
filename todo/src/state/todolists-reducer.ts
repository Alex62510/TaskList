import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppThunk} from "./store";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    todolists: TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}

export type TodolistsActionsType = RemoveTodolistActionType | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistType

const initialState: Array<TodolistDomainType> = [
    /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
    {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: TodolistsActionsType): Array<TodolistDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.id)
        }
        case 'ADD-TODOLIST': {
            return [{...action.todolists, filter: "all"}, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state]
        }
        case "SET-TODOS":
            return action.todos.map((tl) => ({...tl, filter: "all"}))
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return {type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (todolists: TodolistType): AddTodolistActionType => {
    return {type: 'ADD-TODOLIST', todolists}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}

export type SetTodolistType = ReturnType<typeof setTodolistAC>
export const setTodolistAC = (todos: TodolistType[]) => {
    return {type: "SET-TODOS", todos} as const
}
// export const getTodosTC=() => (dispatch: Dispatch<TodolistsActionsType>) => {
//     todolistsAPI.getTodolists()
//         .then((res) => {
//             dispatch(setTodolistAC(res.data))
//         })
// }
export const getTodosTC = (): AppThunk => async dispatch => {
    const res = await todolistsAPI.getTodolists()
    dispatch(setTodolistAC(res.data))
}
export const addTodosTC = (title: string): AppThunk => async dispatch => {
    const res = await todolistsAPI.createTodolist(title)
    dispatch(addTodolistAC(res.data.data.item))
    dispatch(getTodosTC)
}
export const removeTodosTC = (todoId: string): AppThunk => async dispatch => {
    const res = await todolistsAPI.deleteTodolist(todoId)
    dispatch(removeTodolistAC(todoId))
}
export const updateTitleTodolistTC = (todoId: string, title: string): AppThunk => async dispatch => {
    const res = await todolistsAPI.updateTodolist(todoId, title)
    dispatch(changeTodolistTitleAC(todoId, title))

}