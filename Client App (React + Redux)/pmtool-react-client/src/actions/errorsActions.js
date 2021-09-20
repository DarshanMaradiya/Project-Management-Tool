import { CLEAR_ERRORS } from "./types"

export const cleanupErrorsState = () => async dispatch => {
    dispatch({
        type: CLEAR_ERRORS
    })
}