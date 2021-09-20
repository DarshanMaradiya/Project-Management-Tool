import axios from "axios"
import jwtDecode from "jwt-decode"
import setJWTToken from "../securityUtils/setJWTToken"
import {
	CLEAR_CURRENT_USER,
	GET_ERRORS,
	SET_CURRENT_USER,
	SET_ROLE
} from "./types"
import { cleanupErrorsState } from "./errorsActions"

export const createNewUser = (newUser, history, path) => async (dispatch) => {
	try {
		const res = await axios.post("/api/users/register", newUser)
		// history.push("/login")
		// cleanupErrorsState()
		const { token } = res.data
		handleToken(token)(dispatch)
		history && history.push(path || "/dashboard")
	} catch (error) {
		dispatch({
			type: GET_ERRORS,
			payload: error.response.data
		})
	}
}

export const setUserVerified = (history, path, dispatch) => ({
	requestURL: "api/users/verify",
	requestMethod: "GET",
	onSuccess: (response) => {
		const { token } = response.data
		handleToken(token)(dispatch)
		history && history.push(path || "/dashboard")
	},
	onFailure: (error) => {
		dispatch({
			type: GET_ERRORS,
			payload: error.response.data
		})
	}
})

export const handleToken = (token, history, path) => async (dispatch) => {
	// store the token in local storage
	localStorage.setItem("jwtToken", token)
	// set out token headers onwards
	setJWTToken(token)
	// decode the token on React
	const decoded = jwtDecode(token)
	cleanupErrorsState()
	// dispatch to our securityReducer
	dispatch({
		type: SET_CURRENT_USER,
		payload: decoded
	})
	history && history.push(path)
}

export const login = (LoginRequest, history) => async (dispatch) => {
	try {
		// post the endpoint
		const res = await axios.post("/api/users/login", LoginRequest)
		// extract the token from res data
		const { token } = res.data

		handleToken(token)(dispatch)
		history && history.push("/dashboard")
	} catch (error) {
		dispatch({
			type: GET_ERRORS,
			payload: error.response.data
		})
	}
}

export const logout = (history) => (dispatch) => {
	dispatch({
		type: CLEAR_CURRENT_USER
	})
	cleanupErrorsState()
	localStorage.removeItem("jwtToken")
	localStorage.removeItem("role")
	setJWTToken(false)

	// history && history.push("/")
}

export const loginAs = (role, history) => async (dispatch) => {
	try {
		const response = await axios.get(`/api/users/login/${role}`)
		localStorage.setItem("role", response.data)
		dispatch({
			type: SET_ROLE,
			payload: response.data
		})
		// history
		// 	? history.push("/dashboard")
		// 	: console.log("history is not provided")
		window.location = "/dashboard"
	} catch (error) {
		dispatch({
			type: GET_ERRORS,
			payload: error.response.data
		})
	}
}

export const resetPassword = (passwordResetRequest, history, dispatch) => ({
	requestURL: "/api/users/password/reset",
	requestMethod: "POST",
	requestPayload: passwordResetRequest,
	onSuccess: (response) => {
		const { token } = response.data
		handleToken(token)(dispatch)
		history && history.push("/dashboard")
	},
	onFailure: (error) => {
		dispatch({
			type: GET_ERRORS,
			payload: error.response.data
		})
	}
})
