import React, { useEffect, useState } from "react"
import { connect, useDispatch } from "react-redux"
import {
	getInboxMails,
	getOutboxMails,
	getTrashMails
} from "../../actions/mailboxActions"
import useLoader from "../../hooks/useLoader"
import PropTypes from "prop-types"
import {
	Button,
	Checkbox,
	Divider,
	makeStyles,
	Menu,
	MenuItem,
	Select,
	Tooltip,
	Zoom
} from "@material-ui/core"
import { blueGrey, lightBlue } from "@material-ui/core/colors"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import DraftsRoundedIcon from "@material-ui/icons/DraftsRounded"
import { Delete, MailRounded } from "@material-ui/icons"
import classnames from "classnames"
import RefreshIcon from "@material-ui/icons/Refresh"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import Mail from "./Mail"

const useStyles = makeStyles((theme) => ({
	mailSection: {
		display: "flex",
		flexDirection: "column",
		height: "100%",
		width: "100%"
	},
	operationBar: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		height: "50px"
		// border: "2px solid black"
	},
	mailList: {
		display: "flex",
		flexDirection: "column",
		height: "-webkit-fill-available",
		width: "100%"
	},
	mailOperations: {
		display: "flex",
		// border: "2px solid black",
		justifyItems: "space-between",
		alignItems: "center"
	},
	pageOperations: {
		display: "flex",
		// border: "2px solid black",
		justifyItems: "space-between",
		alignItems: "center"
	},
	checkbox: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		color: blueGrey[600],
		"& $checked": {
			color: lightBlue[600]
		},
		"& > *": {
			margin: "0px",
			padding: "0px",
			cursor: "pointer"
		},
		"&:hover": {
			background: "#CCCCCC",
			borderRadius: "10%"
		},
		options: {
			padding: "0px",
			margin: "0px"
		},
		margin: "5px",
		padding: "5px"
	},
	operation: {
		margin: "10px",
		padding: "5px",
		cursor: "pointer",
		"&:hover": {
			background: "#CCCCCC",
			borderRadius: "50%"
		}
	},
	verticalDivider: {
		border: "0.5px solid #CCCCCC",
		height: "80%",
		width: "1px",
		background: "white",
		margin: "2px"
		// right: "249px",
		// top: "10px"
	},
	noselect: {
		WebkitTouchCallout: "none" /* iOS Safari */,
		WebkitUserSelect: "none" /* Safari */,
		KhtmlUserSelect: "none" /* Konqueror HTML */,
		MozUserSelect: "none" /* Old versions of Firefox */,
		MsUserSelect: "none" /* Internet Explorer/Edge */,
		userSelect: "none" /* Non-prefixed version, currently
										supported by Chrome, Edge, Opera and Firefox */
	},
	perPageSelection: {
		margin: "15px",
		// padding: "5px",
		cursor: "pointer",
		"&:hover": {
			background: "#CCCCCC",
			borderRadius: "10%"
		}
	}
}))

const compareArrayItemsById = (a, b) => {
	if (a.length !== b.length) return false

	for (let index = 0; index < a.length; index++) {
		if (a[index].id !== b[index].id) return false
	}

	return true
}

function MailSection(props) {
	const classes = useStyles()
	const [inbox, setInbox] = useState(props.inbox)
	const [outbox, setOutbox] = useState(props.outbox)
	const [trash, setTrash] = useState(props.trash)
	const [mail, setMail] = useState({})
	const [page, setPage] = useState(1)
	const [per_page, setPer_page] = useState(10)
	const [checkedAll, setCheckedAll] = useState(false)
	const [anchorElCheckedAll, setAnchorElCheckedAll] = useState(null)

	const [currentPage, setCurrentPage] = useState([])

	const [inboxLoading, inboxResponse, inboxError, getInbox] = useLoader(
		getInboxMails(page, per_page, useDispatch())
	)
	const [outboxLoading, outboxResponse, outboxError, getOutbox] = useLoader(
		getOutboxMails(page, per_page, useDispatch())
	)
	const [trashLoading, trashResponse, trashError, getTrash] = useLoader(
		getTrashMails(page, per_page, useDispatch())
	)

	useEffect(() => {
		setInbox(props.inbox)
	}, [compareArrayItemsById(props.inbox, inbox)])

	useEffect(() => {
		setOutbox(props.outbox)
	}, [compareArrayItemsById(props.outbox, outbox)])

	useEffect(() => {
		setTrash(props.trash)
	}, [compareArrayItemsById(props.trash, trash)])

	useEffect(() => {
		if (!inboxLoading) {
			page <= inbox.length && setCurrentPage(inbox[page - 1])
		}
	}, [inboxLoading])

	useEffect(() => {
		if (!outboxLoading) {
			page <= outbox.length && setCurrentPage(outbox[page - 1])
		}
	}, [outboxLoading])

	useEffect(() => {
		if (!trashLoading) {
			page <= trash.length && setCurrentPage(trash[page - 1])
		}
	}, [trashLoading])

	useEffect(() => {
		if (page != 1)
			switch (props.selected) {
				case "inbox":
					inbox.length < page
						? getInbox()
						: setCurrentPage(inbox[page - 1])
					break
				case "outbox":
					outbox.length < page
						? getOutbox()
						: setCurrentPage(outbox[page - 1])
					break
				case "trash":
					trash.length < page
						? getTrash()
						: setCurrentPage(trash[page - 1])
					break
				default:
					inbox.length < page
						? getInbox()
						: setCurrentPage(inbox[page - 1])
					break
			}
	}, [page])

	const func = () => {
		console.log("updating current outbox page")
		setCurrentPage(outbox[0])
	}

	useEffect(() => {
		setPage(1)
		switch (props.selected) {
			case "inbox":
				inbox.length < 1 && getInbox()
				1 <= inbox.length && setCurrentPage(inbox[0])
				break
			case "outbox":
				outbox.length < 1 && getOutbox()
				1 <= outbox.length ? func() : console.log(outbox.length)
				break
			case "trash":
				trash.length < 1 && getTrash()
				1 <= trash.length && setCurrentPage(trash[0])
				break
			default:
				inbox.length < 1 && getInbox()
				1 <= inbox.length && setCurrentPage(inbox[0])
				break
		}
	}, [props.selected])

	const selectAll = () => {
		console.log("select all")
		setAnchorElCheckedAll(null)
	}
	const selectRead = () => {
		console.log("select read")
		setAnchorElCheckedAll(null)
	}
	const selectUnread = () => {
		console.log("select unread")
		setAnchorElCheckedAll(null)
	}

	const getCurrentBox = () => {
		switch (props.selected) {
			case "inbox":
				return inbox
			case "outbox":
				return outbox
			case "trash":
				return trash
			default:
				return inbox
		}
	}

	const goToPrevPage = () => {
		if (page > 1) setPage(page - 1)
	}
	const goToNextPage = () => {
		if (
			page <= getCurrentBox().length &&
			getCurrentBox()[page - 1].length === per_page
		)
			setPage(page + 1)
	}

	const onCheckboxChange = (e) => {}

	return (
		<div className={classes.mailSection}>
			<div className={classes.operationBar}>
				<div className={classes.mailOperations}>
					<Tooltip
						title='Select All'
						placement='top'
						TransitionComponent={Zoom}
					>
						<div className={classnames(classes.checkbox)}>
							<Checkbox
								checked={checkedAll}
								onChange={(e) =>
									setCheckedAll(e.target.checked)
								}
								inputProps={{
									"aria-label": "decorative checkbox"
								}}
								color='default'
							/>

							<div
								className={classes.checkbox.options}
								aria-controls='checkedAll'
								aria-haspopup='true'
								onClick={(e) =>
									setAnchorElCheckedAll(e.currentTarget)
								}
							>
								<KeyboardArrowDownIcon />
							</div>

							<Menu
								id='checkedAll'
								anchorEl={anchorElCheckedAll}
								keepMounted
								open={Boolean(anchorElCheckedAll)}
								onClose={() => setAnchorElCheckedAll(null)}
								anchorOrigin={{
									vertical: "bottom",
									horizontal: "center"
								}}
								transformOrigin={{
									vertical: "top",
									horizontal: "center"
								}}
								getContentAnchorEl={null}
							>
								<MenuItem onClick={selectAll}>All</MenuItem>
								<MenuItem onClick={selectRead}>Read</MenuItem>
								<MenuItem onClick={selectUnread}>
									Unread
								</MenuItem>
							</Menu>
						</div>
					</Tooltip>
					<div className={classes.verticalDivider}></div>
					<Tooltip
						title='Mark as Unread'
						placement='top'
						TransitionComponent={Zoom}
					>
						<div className={classes.operation}>
							<DraftsRoundedIcon color='action' />
						</div>
					</Tooltip>
					<Tooltip
						title='Mark as Read'
						placement='top'
						TransitionComponent={Zoom}
					>
						<div className={classes.operation}>
							<MailRounded color='action' />
						</div>
					</Tooltip>
					<Tooltip
						title='Move to Trash'
						placement='top'
						TransitionComponent={Zoom}
					>
						<div className={classes.operation}>
							<Delete color='action' />
						</div>
					</Tooltip>
					<div className={classes.verticalDivider}></div>
					<Tooltip
						title='Refresh'
						placement='top'
						TransitionComponent={Zoom}
					>
						<div className={classes.operation}>
							<RefreshIcon color='action' />
						</div>
					</Tooltip>
				</div>

				<div className={classes.pageOperations}>
					<Tooltip
						title='Previous Page'
						placement='top'
						TransitionComponent={Zoom}
					>
						<div
							className={classes.operation}
							onClick={goToPrevPage}
							disabled={page == 1}
						>
							<ChevronLeftIcon
								color={page == 1 ? "disabled" : "action"}
							/>
						</div>
					</Tooltip>
					<Tooltip
						title='Current Page'
						placement='top'
						TransitionComponent={Zoom}
					>
						<div className={classes.noselect}>{page}</div>
					</Tooltip>
					<Tooltip
						title='Next Page'
						placement='top'
						TransitionComponent={Zoom}
					>
						<div
							className={classes.operation}
							onClick={goToNextPage}
							disabled={
								page > getCurrentBox().length ||
								getCurrentBox()[page - 1].length !== per_page
							}
						>
							<ChevronRightIcon
								color={
									page > getCurrentBox().length ||
									getCurrentBox()[page - 1].length !==
										per_page
										? "disabled"
										: "action"
								}
							/>
						</div>
					</Tooltip>
					<div className={classes.verticalDivider}></div>
					<Tooltip
						title='Mails per page'
						placement='top'
						TransitionComponent={Zoom}
					>
						<Select
							disabled
							labelId='per_page'
							id='per_page'
							value={per_page}
							onChange={(e) => setPer_page(e.target.value)}
							label='Per Page'
							className={classes.perPageSelection}
						>
							<MenuItem value={10}>10</MenuItem>
							<MenuItem value={20}>20</MenuItem>
							<MenuItem value={30}>30</MenuItem>
							<MenuItem value={50}>50</MenuItem>
						</Select>
					</Tooltip>
				</div>
			</div>
			<Divider />
			<div className={classes.mailList}>
				{currentPage.length === 0 ? (
					<center>No mails are here</center>
				) : (
					currentPage.map((mail) => (
						<Mail key={mail.id} mail={mail} box={props.selected} />
					))
				)}
			</div>
			{
				// 	{props.selected}
				// <div>page: {page}</div>
				// <div>per_page: {per_page}</div>
				// <div></div>
			}
		</div>
	)
}

MailSection.propTypes = {
	inbox: PropTypes.array.isRequired,
	outbox: PropTypes.array.isRequired,
	trash: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
	inbox: state.mailbox.inbox,
	outbox: state.mailbox.outbox,
	trash: state.mailbox.trash
})

export default connect(mapStateToProps, null)(MailSection)
