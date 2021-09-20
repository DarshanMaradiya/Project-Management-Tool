import {
	GET_ERRORS,
	GET_INBOX_MAILS,
	GET_OUTBOX_MAILS,
	GET_TRASH_MAILS
} from "./types"
import { cleanupErrorsState } from "./errorsActions"

export const getInboxMails = (page = 1, per_page = 10, dispatch) => ({
	requestURL: `/api/appmail/inbox?page=${page}&per_page=${per_page}`,
	requestMethod: "GET",
	requestPayload: null,
	onSuccess: (res) => {
		cleanupErrorsState()
		dispatch({
			type: GET_INBOX_MAILS,
			payload: { mails: res.data, page }
		})
	},
	onFailure: (err) =>
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
})

export const getOutboxMails = (page = 1, per_page = 10, dispatch) => ({
	requestURL: `/api/appmail/outbox?page=${page}&per_page=${per_page}`,
	requestMethod: "GET",
	requestPayload: null,
	onSuccess: (res) => {
		cleanupErrorsState()
		dispatch({
			type: GET_OUTBOX_MAILS,
			payload: { mails: res.data, page }
		})
	},
	onFailure: (err) =>
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
})

export const getTrashMails = (page = 1, per_page = 10, dispatch) => ({
	requestURL: `/api/appmail/trash?page=${page}&per_page=${per_page}`,
	requestMethod: "GET",
	requestPayload: null,
	onSuccess: (res) => {
		cleanupErrorsState()
		dispatch({
			type: GET_TRASH_MAILS,
			payload: { mails: res.data, page }
		})
	},
	onFailure: (err) =>
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
})

export const sendMail = (appmail, dispatch) => ({
	requestURL: `/api/appmail/send`,
	requestMethod: "POST",
	requestPayload: appmail,
	onSuccess: (res) => {
		cleanupErrorsState()(dispatch)
	},
	onFailure: (err) =>
		dispatch({
			type: GET_ERRORS,
			payload: err.response.data
		})
})
