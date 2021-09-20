import {
	GET_INBOX_MAILS,
	GET_OUTBOX_MAILS,
	GET_TRASH_MAILS,
	SEND_MAIL
} from "../actions/types"

const initialState = {
	inbox: [],
	outbox: [],
	trash: [],
	mail: {}
}

const mailboxReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_INBOX_MAILS: {
			const { page, mails } = action.payload
			if (state.inbox.length <= page) state.inbox[page - 1] = mails
			else state.inbox.push(mails)
			return {
				...state,
				inbox: [...state.inbox]
			}
		}
		case GET_OUTBOX_MAILS: {
			const { page, mails } = action.payload
			if (state.outbox.length <= page) state.outbox[page - 1] = mails
			else state.outbox.push(mails)
			return {
				...state,
				outbox: [...state.outbox]
			}
		}
		case GET_TRASH_MAILS: {
			const { page, mails } = action.payload
			if (state.trash.length <= page) state.trash[page - 1] = mails
			else state.trash.push(mails)
			return {
				...state,
				trash: [...state.trash]
			}
		}
		default:
			return state
	}
}

export default mailboxReducer
