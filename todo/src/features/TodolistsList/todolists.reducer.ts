import {appActions, RequestStatusType} from "app/app.reducer";

import {AppThunk} from "app/store";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {todolistsAPI, TodolistType} from "features/TodolistsList/todolists.api";
import {ResultCode} from "common/enums/enum";



const initialState: TodolistDomainType[] = [];

const slice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id);
            if (todo) {
                todo.filter = action.payload.filter;
            }
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
            const todo = state.find((todo) => todo.id === action.payload.id);
            if (todo) {
                todo.entityStatus = action.payload.entityStatus;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodolists.fulfilled,(state, action)=>{
              return action.payload.todolists.map((tl) => ({...tl, filter: "all", entityStatus: "idle"}));
            })
            .addCase(removeTodolist.fulfilled,(state, action)=>{
                const index = state.findIndex((todo) => todo.id === action.payload.id);
                if (index !== -1) state.splice(index, 1);
            })
            .addCase(addTodolist.fulfilled,(state, action)=>{
                const newTodolist: TodolistDomainType = {...action.payload.todolist, filter: "all", entityStatus: "idle"};
                state.unshift(newTodolist);
            })
            .addCase(clearTasksAndTodolists, () => {
            return [];
        })
            .addCase(changeTodolistTitle.fulfilled,(state, action)=>{
                const todo = state.find((todo) => todo.id === action.payload.id);
                if (todo) {
                    todo.title = action.payload.title;
                }
            })
    },
});

export const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, void >("todo/fetchTodolists", async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}));
        const res = await todolistsAPI.getTodolists()
      dispatch(appActions.setAppStatus({status: "succeeded"}));
        return {todolists:res.data}
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    }
})
export const removeTodolist=createAppAsyncThunk<{ id:string },string>('todos/removeTodolist',async (id:string, thunkAPI)=>{
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}));
        dispatch(todolistsActions.changeTodolistEntityStatus({id, entityStatus: "loading"}));
        const res= await  todolistsAPI.deleteTodolist(id)
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(appActions.setAppStatus({status: "succeeded"}));
            return {id}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    }
    catch (e) {
            handleServerNetworkError(e, dispatch);
            return rejectWithValue(null)
    }
})
export const addTodolist=createAppAsyncThunk<{ todolist:TodolistType },string>("todos/addTodolist",async (title: string, thunkAPI)=>{
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}));
        const res=await  todolistsAPI.createTodolist(title)
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(appActions.setAppStatus({status: "succeeded"}));
           return {todolist:res.data.data.item}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    }
    catch (e){
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    }
})

export const changeTodolistTitle=createAppAsyncThunk<UpdateTodolistTitleArgType, UpdateTodolistTitleArgType>('todos/changeTitleTodolist',async (arg, thunkAPI)=>{
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}));
        const res= await todolistsAPI.updateTodolist(arg)
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(appActions.setAppStatus({status: "succeeded"}));
            return arg
        }else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    }
    catch (e){
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    }
})

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = {fetchTodolists,removeTodolist,addTodolist,changeTodolistTitle}
// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType;
    entityStatus: RequestStatusType;
};
export type UpdateTodolistTitleArgType = {
    id: string;
    title: string;
}