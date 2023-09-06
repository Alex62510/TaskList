import {TaskActionsType, tasksReducer} from './tasks-reducer';
import {TodolistsActionsType, todolistsReducer} from './todolists-reducer';
import {AnyAction, applyMiddleware, combineReducers, createStore, legacy_createStore} from 'redux';
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})
// непосредственно создаём store
export const store = legacy_createStore(rootReducer,applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния

export type AppDispatchType=ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch=()=>useDispatch<AppDispatchType>()
export type AppRootStateType = ReturnType<typeof rootReducer>
 export type AppActionType=TodolistsActionsType | TaskActionsType

export type AppThunk<ReturnType=void> = ThunkAction<ReturnType,AppRootStateType,unknown,AppActionType>
// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
