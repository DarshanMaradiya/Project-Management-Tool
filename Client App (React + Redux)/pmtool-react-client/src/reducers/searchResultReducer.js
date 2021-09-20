import { CLEAR_SEARCH_RESULT, SEARCH_USERS_BY_KEYWORD } from "../actions/types"

const initialState = []

const searchResultReducer = (state = initialState, action) => {
	switch (action.type) {
		case SEARCH_USERS_BY_KEYWORD:
			return action.payload
		case CLEAR_SEARCH_RESULT:
			return []
		default:
			return state
	}
}

export default searchResultReducer
