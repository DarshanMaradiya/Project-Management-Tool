import { combineReducers } from "redux"
import backlogReducer from "./backlogReducer"
import errorReducer from "./errorReducer"
import projectReducer from "./projectReducer"
import securityReducer from "./securityReducer"
import searchResultReducer from "./searchResultReducer"
import teamReducer from "./teamReducer"
import mailboxReducer from "./mailboxReducer"

const rootReducer = combineReducers({
	errors: errorReducer,
	project: projectReducer,
	backlog: backlogReducer,
	security: securityReducer,
	searchResult: searchResultReducer,
	team: teamReducer,
	mailbox: mailboxReducer
})

export default rootReducer
