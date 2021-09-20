import {
	CLEAR_TASK_DEPENDENCIES,
	DELETE_PROJECT_TASK,
	GET_ASSIGNED_TASK,
	GET_BACKLOG,
	GET_PROJECT_TASK,
	GET_TASK_DEPENDENCIES,
	UPDATE_TASK_DEPENDENCIES
} from "../actions/types"

const initialState = {
	project_tasks: [],
	project_task: {},
	pre_requisite_tasks: []
}

const backlogReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_BACKLOG:
			return {
				...state,
				project_tasks: action.payload
			}
		case GET_PROJECT_TASK:
			return {
				...state,
				project_task: action.payload,
				project_tasks: state.project_tasks.map((task) =>
					task.id === action.payload.id ? action.payload : task
				)
			}
		case DELETE_PROJECT_TASK:
			return {
				...state,
				project_tasks: state.project_tasks.filter(
					(task) => task.projectSequence != action.payload
				)
			}
		case GET_ASSIGNED_TASK:
			return {
				...state,
				project_tasks: action.payload
			}
		case GET_TASK_DEPENDENCIES:
			return {
				...state,
				pre_requisite_tasks: action.payload
			}
		// case UPDATE_TASK_DEPENDENCIES:
		// 	return {
		// 		...state,
		// 		pre_requisite_tasks: action.payload
		// 	}
		case CLEAR_TASK_DEPENDENCIES:
			return {
				...state,
				pre_requisite_tasks: []
			}
		default:
			return state
	}
}

export default backlogReducer
