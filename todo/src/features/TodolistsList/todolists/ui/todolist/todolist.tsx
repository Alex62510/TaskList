import React, {FC, memo, useEffect} from "react";
import {TodolistDomainType,} from "features/todolistsList/todolists/model/todolists.reducer";
import {tasksThunks} from "features/todolistsList/tasks/model/tasks.reducer";
import {useActions} from "common/hooks";
import {AddItemForm} from "common/components";
import {TaskType} from "../../../tasks/api/tasks.api.type";
import {FilterTaskButtons} from "./filterTaskButton";
import {Tasks} from "./tasks/tasks";
import {TodolistTitle} from "./todolistTitle/todolistTitle";

type Props = {
    todolist: TodolistDomainType;
    tasks: TaskType[];
};

export const Todolist: FC<Props> = memo(({todolist, tasks}) => {
    const {fetchTasks, addTask} = useActions(tasksThunks);

    useEffect(() => {
        fetchTasks(todolist.id);
    }, []);

    const addTaskCallBack = (title: string) => addTask({title, todolistId: todolist.id}).unwrap();

    return (
        <div>
            <TodolistTitle todolist={todolist}/>
            <AddItemForm addItem={addTaskCallBack} disabled={todolist.entityStatus === "loading"}/>
            <Tasks tasks={tasks} todolist={todolist}/>
            <FilterTaskButtons todolist={todolist}/>
        </div>
    );
});
