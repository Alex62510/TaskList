import {Task} from "./task/task";
import React, {FC} from "react";
import {TaskStatuses} from "../../../../../../common/enums";
import {TaskType} from "../../../../tasks/api/tasks.api.type";
import {TodolistDomainType} from "../../../model/todolists.reducer";

type Props = {
    tasks: TaskType[];
    todolist: TodolistDomainType;
}
export const Tasks: FC<Props> = ({tasks, todolist}) => {
    let tasksForTodolist = tasks;

    if (todolist.filter === "active") {
        tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.New);
    }
    if (todolist.filter === "completed") {
        tasksForTodolist = tasks.filter((t) => t.status === TaskStatuses.Completed);
    }
    return (
        <>
            {tasksForTodolist.map((t) => (
                <Task
                    key={t.id}
                    task={t}
                    todolistId={todolist.id}

                />))}
        </>
    )


}