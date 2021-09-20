import axios from "axios"
import {
	CLEAR_SEARCH_RESULT,
	GET_ERRORS,
	SEARCH_USERS_BY_KEYWORD
} from "./types"
import { cleanupErrorsState } from "./errorsActions"

export const getUsersByKeyword = (keyword) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/users/search/${keyword}`)
		cleanupErrorsState()
		dispatch({
			type: SEARCH_USERS_BY_KEYWORD,
			payload: res.data
		})
	} catch (errors) {
		dispatch({
			type: CLEAR_SEARCH_RESULT
		})
		dispatch({
			type: GET_ERRORS,
			payload: errors.response.data
		})
	}
}

export const cleanupSearchResultSlice = () => async (dispatch) => {
	cleanupErrorsState()
	dispatch({
		type: CLEAR_SEARCH_RESULT
	})
}
