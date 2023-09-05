import {instance} from "common/api/common.api";
import {ResponseType} from "common/types";
import {TodolistType, UpdateTodolistTitleArgType} from "./todolists.api.type";

export const todolistsApi = {
  getTodolists() {
    return instance.get<TodolistType[]>("todo-lists");
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>("todo-lists", { title: title });
  },
  deleteTodolist(id: string) {
    return instance.delete<ResponseType>(`todo-lists/${id}`);
  },
  updateTodolist(arg: UpdateTodolistTitleArgType) {
    return instance.put<ResponseType>(`todo-lists/${arg.id}`, { title: arg.title });
  },
};

