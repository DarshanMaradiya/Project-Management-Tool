import { GET_TEAM, CLEAR_TEAM_STATE } from "../actions/types"

const initialState = {
    team: {}
}

const teamReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TEAM:
            return {
                ...state,
                team: action.payload
            }
        case CLEAR_TEAM_STATE:
            return {
                ...state,
                team: {}
            }
        default:
            return state
    }
}

export default teamReducer