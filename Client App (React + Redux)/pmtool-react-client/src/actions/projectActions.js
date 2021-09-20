import { getTeamByProjectIdentifier } from "./teamActions"

const { default: axios } = require("axios")
const {
	GET_ERRORS,
	GET_PROJECTS,
	GET_PROJECT,
	DELETE_PROJECT,
	CLEAR_ERRORS,
	GET_TEAM
} = require("./types")
const { cleanupErrorsState } = require("./errorsActions")

// It is taking project object and history
// history allows us to redirect once we submit the form
// since we use route to render the UI comp
// Async dispatch is passed cause we want to dispatch
// Async will return promise and we use await to wait for its result
export const createProject = (project, history) => async (dispatch) => {
	// wrapping in try catch block
	try {
		// use of await
		const response = await axios.post(
			// route for posting the valid project object
			"/api/project",
			project
		)
		cleanupErrorsState()
		dispatch({
			type: GET_PROJECT,
			payload: response.data
		})
		history &&
			history.push(`/addTeamMembers/${response.data.projectIdentifier}`)
	} catch (err) {
		// If error, dispatch error action object
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	}
}

export const updateProject = (project, history) => async (dispatch) => {
	// wrapping in try catch block
	try {
		// use of await
		const response = await axios.post(
			// route for posting the valid project object
			"/api/project",
			project
		)
		cleanupErrorsState()
		dispatch({
			type: GET_PROJECT,
			payload: response.data
		})
		getTeamByProjectIdentifier(response.data.projectIdentifier)
		// redirecting to the dashboard
		history.push("/dashboard")
	} catch (err) {
		// If error, dispatch error action object
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
	}
}

// export const getProjects = () => async (dispatch) => {
// 	// we have set a proxy in package.json
// 	const res = await axios.get("/api/project/all")
// 	dispatch({
// 		type: GET_PROJECTS,
// 		payload: res.data
// 	})
// }

export const getProjects = (dispatch) => ({
	requestURL: "/api/project/all",
	requestMethod: "GET",
	onSuccess: (response) => {
		dispatch({
			type: GET_PROJECTS,
			payload: response.data
		})
	}
})

export const getProject = (id, history) => async (dispatch) => {
	try {
		// we have set a proxy in package.json
		const res = await axios.get(`/api/project/${id}`)
		dispatch({
			type: GET_PROJECT,
			payload: res.data
		})
	} catch (error) {
		history.push("/dashboard")
	}
}

// export const getProject = (id, history, projects) => async dispatch => {
//     const project = projects.find(project => {
//         return project.projectIdentifier === id
//     })

//     if(project) {
//         dispatch({
//             type: GET_PROJECT,
//             payload: project
//         })
//     } else {
//         history.push("/dashboard")
//     }
// }

export const deleteProject = (id) => async (dispatch) => {
	if (
		window.confirm(
			"Are you sure? This will delete the project and all the data related to it"
		)
	) {
		// we have set a proxy in package.json
		const res = await axios.delete(`/api/project/${id}`)
		dispatch({
			type: DELETE_PROJECT,
			payload: id
		})
	}
}
