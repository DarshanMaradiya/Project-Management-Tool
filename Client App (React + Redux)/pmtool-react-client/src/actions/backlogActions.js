import axios from "axios"
import {
	CLEAR_ERRORS,
	CLEAR_TASK_DEPENDENCIES,
	DELETE_PROJECT_TASK,
	GET_ASSIGNED_TASK,
	GET_BACKLOG,
	GET_ERRORS,
	GET_PROJECT_TASK,
	GET_TASK_DEPENDENCIES,
	UPDATE_TASK_DEPENDENCIES
} from "./types"
import { cleanupErrorsState } from "./errorsActions"

export const addProjectTask = (backlog_id, project_task, history) => async (
	dispatch
) => {
	try {
		await axios.post(`/api/backlog/${backlog_id}`, project_task)
		history.push(`/projectBoard/${backlog_id}`)
		cleanupErrorsState()
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	}
}

// export const getBacklog = (backlog_id) => async (dispatch) => {
// 	try {
// 		const res = await axios.get(`/api/backlog/${backlog_id}`)
// 		cleanupErrorsState()
// 		dispatch({
// 			type: GET_BACKLOG,
// 			payload: res.data
// 		})
// 	} catch (err) {
// 		dispatch({
// 			type: GET_ERRORS,
// 			payload: err.response.data
// 		})
// 	}
// }

export const getBacklog = (backlog_id, dispatch) => ({
	requestURL: `/api/backlog/${backlog_id}`,
	requestMethod: "GET",
	requestPayload: null,
	onSuccess: (res) => {
		cleanupErrorsState()
		dispatch({
			type: GET_BACKLOG,
			payload: res.data
		})
	},
	onFailure: (err) =>
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
})

// export const getProjectTask = (backlog_id, projectTask_id, history) => async (
// 	dispatch
// ) => {
// 	try {
// 		const res = await axios.get(
// 			`/api/backlog/${backlog_id}/${projectTask_id}`
// 		)
// 		cleanupErrorsState()
// 		dispatch({
// 			type: GET_PROJECT_TASK,
// 			payload: res.data
// 		})
// 	} catch (err) {
// 		history && history.push("/dashboard")
// 		dispatch({
// 			type: GET_ERRORS,
// 			payload: err.response.data
// 		})
// 	}
// }

export const getProjectTask = (backlog_id, projectTask_id, dispatch) => ({
	requestURL: `/api/backlog/${backlog_id}/${projectTask_id}`,
	requestMethod: "GET",
	onSuceess: (response) => {
		cleanupErrorsState()
		dispatch({
			type: GET_PROJECT_TASK,
			payload: response.data
		})
	},
	onFailure: (error) => {
		dispatch({
			type: GET_ERRORS,
			payload: error.response.data
		})
	}
})

export const updateProjectTask = (backlog_id, project_task, history) => async (
	dispatch
) => {
	try {
		const res = await axios.put(`/api/backlog/${backlog_id}`, project_task)
		history && history.push(`/projectBoard/${backlog_id}`)
		cleanupErrorsState()
		dispatch({
			type: GET_PROJECT_TASK,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	}
}

export const updateTask = (backlog_id, project_task, dispatch) => ({
	requestURL: `/api/backlog/${backlog_id}`,
	requestMethod: "POST",
	requestPayload: project_task,
	onSuccess: (response) => {
		cleanupErrorsState()
		dispatch({
			type: GET_PROJECT_TASK,
			payload: response.data
		})
	},
	onFailure: (error) => {
		dispatch({
			type: GET_ERRORS,
			payload: error.response.data
		})
	}
})

export const deleteProjectTask = (backlog_id, projectTask_id) => async (
	dispatch
) => {
	if (
		window.confirm(
			`You are deleting project task ${projectTask_id}, this action can not be undone!`
		)
	) {
		await axios.delete(`/api/backlog/${backlog_id}/${projectTask_id}`)
		dispatch({
			type: DELETE_PROJECT_TASK,
			payload: projectTask_id
		})
	}
}

export const getAssignedTask = (dispatch) => ({
	requestMethod: "GET",
	requestURL: "/api/backlog/project_tasks",
	onSuccess: (response) => {
		dispatch({
			type: GET_ASSIGNED_TASK,
			payload: response.data
		})
	},
	onFailure: (error) => {
		dispatch({
			type: GET_ERRORS,
			payload: error.response.data
		})
	}
})

// export const getTaskDependencies = (
// 	projectIdentifier,
// 	projectSequence,
// 	dispatch
// ) => ({
// 	requestMethod: "GET",
// 	requestURL: `/api/backlog/${projectIdentifier}/${projectSequence}`,
// 	onSuccess: (response) => {
// 		dispatch({
// 			type: GET_TASK_DEPENDENCIES,
// 			payload: response.data
// 		})
// 	},
// 	onFailure: (error) => {
// 		dispatch({
// 			type: GET_ERRORS,
// 			payload: error.response.data
// 		})
// 	}
// })

export const getTaskDependencies = (
	projectIdentifier,
	projectSequence
) => async (dispatch) => {
	try {
		const res = await axios.get(
			`/api/backlog/dependecies/${projectIdentifier}/${projectSequence}`
		)
		cleanupErrorsState()
		dispatch({
			type: GET_TASK_DEPENDENCIES,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	}
}

export const updateTaskDependencies = (
	projectIdentifier,
	projectSequence,
	preRequisiteTasks
) => async (dispatch) => {
	try {
		const res = await axios.post(
			`/api/backlog/dependecies/${projectIdentifier}/${projectSequence}`,
			preRequisiteTasks
		)
		cleanupErrorsState()
		dispatch({
			type: GET_PROJECT_TASK,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	}
}

export const approveTask = (
	projectIdentifier,
	projectTask_id,
	approval
) => async (dispatch) => {
	try {
		const res = await axios.get(
			`/api/backlog/approve/${projectIdentifier}/${projectTask_id}/${approval}`
		)
		cleanupErrorsState()
		dispatch({
			type: GET_PROJECT_TASK,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	}
}

export const cleanupPreRequisiteTasks = () => async (dispatch) => {
	dispatch({
		type: CLEAR_TASK_DEPENDENCIES
	})
}

export const updateStatusProjectTask = (
	backlog_id,
	projectSequence,
	status,
	history
) => async (dispatch) => {
	try {
		const res = await axios.put(
			`/api/backlog/status/${backlog_id}/${projectSequence}/${status}`
		)
		history && history.push(`/projectBoard/${backlog_id}`)
		cleanupErrorsState()
		dispatch({
			type: GET_PROJECT_TASK,
			payload: res.data
		})
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	}
}
