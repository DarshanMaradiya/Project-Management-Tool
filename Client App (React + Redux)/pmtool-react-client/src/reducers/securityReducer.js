import {
	CLEAR_CURRENT_USER,
	SET_CURRENT_USER,
	SET_ROLE
} from "../actions/types"

const initialState = {
	role: null,
	user: {},
	validToken: false
}

// whether we have user in payload or not
const booleanActionPayload = (payload) => {
	if (payload) return true
	return false
}

const securityReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_CURRENT_USER:
			return {
				...state,
				validToken: booleanActionPayload(action.payload),
				user: action.payload
			}
		case CLEAR_CURRENT_USER:
			return {
				...state,
				validToken: false,
				user: {}
			}
		case SET_ROLE:
			return {
				...state,
				role: action.payload
			}
		default:
			return state
	}
}

export default securityReducer
