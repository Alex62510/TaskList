import {EditableSpan} from "../../../../../../common/components";
import {IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import React, {FC} from "react";
import {useActions} from "../../../../../../common/hooks";
import {TodolistDomainType, todolistsThunks} from "../../../model/todolists.reducer";
type Props={
    todolist: TodolistDomainType;
}
export const TodolistTitle:FC<Props>=({todolist})=>{
    const {removeTodolist, changeTodolistTitle} = useActions(todolistsThunks);
    const removeTodolistCallBack = () => {
        removeTodolist(todolist.id);
    };

    const changeTodolistTitleCallBack = (title: string) => {
        changeTodolistTitle({id: todolist.id, title});
    }
    return(
        <h3>
            <EditableSpan value={todolist.title} onChange={changeTodolistTitleCallBack}/>
            <IconButton onClick={removeTodolistCallBack} disabled={todolist.entityStatus === "loading"}>
                <Delete/>
            </IconButton>
        </h3>
    )
}