import {appActions} from "app/app.reducer";
import {todolistsActions, todolistsThunks} from "features/TodolistsList/todolists.reducer";
import {createSlice} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "common/actions/common.actions";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {
    AddArgTaskType, RemoveTypeTaskArgType,
    TaskType,
    todolistsAPI,
    UpdateArgTaskType,
    UpdateTaskModelType
} from "features/TodolistsList/todolists.api";
import {ResultCode, TaskPriorities, TaskStatuses} from "common/enums/enum";



const initialState: TasksStateType = {};

const slice = createSlice({
    name: "tasks",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.task.todoListId];
                tasks.unshift(action.payload.task);
            })
            .addCase(removeTask.fulfilled,(state, action)=>{
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex((t) => t.id === action.payload.taskId);
                if (index !== -1) tasks.splice(index, 1);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId];
                const index = tasks.findIndex((t) => t.id === action.payload.taskId);
                if (index !== -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel};
                }
            })
            .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = [];
            })
            .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
                delete state[action.payload.id];
            })
            .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
                action.payload.todolists.forEach((tl) => {
                    state[tl.id] = [];
                })})
            .addCase(clearTasksAndTodolists, () => {
                return {};
            });
    },
});

const fetchTasks = createAppAsyncThunk<{
    tasks: TaskType[],
    todolistId: string
}, string>("tasks/fetchTasks", async (todolistId: string, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}));
        const res = await todolistsAPI.getTasks(todolistId)
        const tasks = res.data.items;
        dispatch(appActions.setAppStatus({status: "succeeded"}));
        return {tasks, todolistId};
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    }
})

export const removeTask =createAppAsyncThunk<RemoveTypeTaskArgType, RemoveTypeTaskArgType>("tasks/remove",async (arg, thunkAPI)=>{
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}));
        const res = await todolistsAPI.deleteTask(arg)
        if (res.data.resultCode === ResultCode.Success) {
            dispatch(appActions.setAppStatus({status: "succeeded"}));
            return arg;
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    }catch (e){
       handleServerNetworkError(e, dispatch);
       return rejectWithValue(null)
   }
})



export const addTask = createAppAsyncThunk<{
    task: TaskType
}, AddArgTaskType>("tasks/addTask", async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setAppStatus({status: "loading"}));
        const res = await todolistsAPI.createTask(arg)
        if (res.data.resultCode === ResultCode.Success) {
            const task = res.data.data.item;
            dispatch(appActions.setAppStatus({status: "succeeded"}));
            return {task};
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    }
})
export const updateTask = createAppAsyncThunk<UpdateArgTaskType, UpdateArgTaskType>("tasks/updateTask", async (arg, thunkAPI) => {
    const {dispatch, getState, rejectWithValue} = thunkAPI
    try {
        const state = getState();
        const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
        if (!task) {
            dispatch(appActions.setAppError({error:"task not found in the state"}))
            return rejectWithValue(null)
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...arg.domainModel,
        };
        const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)

        if (res.data.resultCode === 0) {
            return arg;
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch);
        return rejectWithValue(null)
    }
})

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = {fetchTasks, addTask, updateTask,removeTask}
// types
export type UpdateDomainTaskModelType = {
    title?: string;
    description?: string;
    status?: TaskStatuses;
    priority?: TaskPriorities;
    startDate?: string;
    deadline?: string;
};
export type TasksStateType = {
    [key: string]: Array<TaskType>;
};
