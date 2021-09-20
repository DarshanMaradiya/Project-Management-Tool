import axios from "axios"
import {
	CLEAR_TEAM_STATE,
	GET_ERRORS,
	GET_PROJECT_TASK,
	GET_TEAM
} from "./types"
import { cleanupErrorsState } from "./errorsActions"

export const addMembers = (teamMemberUsernames, teamId, history) => async (
	dispatch
) => {
	try {
		const res = await axios.put(`/api/team/${teamId}`, teamMemberUsernames)
		cleanupErrorsState()
		history.push("/dashboard")
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	}
}

export const updateMembers = (teamMemberUsernames, teamId, history) => async (
	dispatch
) => {
	try {
		const res = await axios.post(`/api/team/${teamId}`, teamMemberUsernames)
		cleanupErrorsState()
		history.push("/dashboard")
	} catch (err) {
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	}
}

export const getTeam = (teamId) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/team/${teamId}`)
		cleanupErrorsState()
		dispatch({
			type: GET_TEAM,
			payload: res.data
		})
	} catch (error) {
		dispatch({
			type: GET_ERRORS,
			payload: error.response.data
		})
	}
}

// export const getTeamByProjectIdentifier = (projectIdentifier) => async (
// 	dispatch
// ) => {
// 	try {
// 		const res = await axios.get(`/api/project/team/${projectIdentifier}`)
// 		cleanupErrorsState()
// 		dispatch({
// 			type: GET_TEAM,
// 			payload: res.data
// 		})
// 	} catch (error) {
// 		dispatch({
// 			type: GET_ERRORS,
// 			payload: error.response.data
// 		})
// 	}
// }

export const getTeamByProjectIdentifier = (projectIdentifier, dispatch) => ({
	requestURL: `/api/project/team/${projectIdentifier}`,
	requestMethod: "GET",
	onSuccess: (response) => {
		cleanupErrorsState()
		dispatch({
			type: GET_TEAM,
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

export const assignTask = (
	projectIdentifier,
	projectTask_Id,
	teamMemberUsername
) => async (dispatch) => {
	try {
		const res = await axios.get(
			`/api/team/assign?bg=${projectIdentifier}&pt=${projectTask_Id}&tm=${teamMemberUsername}`
		)
		dispatch({
			type: GET_PROJECT_TASK,
			payload: res.data
		})
	} catch (error) {
		dispatch({
			type: GET_ERRORS,
			payload: error.response.data
		})
	}
}

export const cleanupTeamSlice = () => async (dispatch) => {
	cleanupErrorsState()
	dispatch({
		type: CLEAR_TEAM_STATE
	})
}
