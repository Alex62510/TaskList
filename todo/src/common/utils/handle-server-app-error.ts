import {Dispatch} from "redux";
import {appActions} from "app/app.reducer";
import {ResponseType} from "common/types/common.types";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
    if (showError) {
        if (data.messages.length) {
            dispatch(appActions.setAppError({error: data.messages[0]}));
        } else {
            dispatch(appActions.setAppError({error: "Some error occurred"}));
        }
    }
    dispatch(appActions.setAppStatus({status: "failed"}));
};
