import { Checkbox, makeStyles, Tooltip, Zoom } from "@material-ui/core"
import { Delete, MailRounded } from "@material-ui/icons"
import React, { useState } from "react"
import DraftsRoundedIcon from "@material-ui/icons/DraftsRounded"
import classnames from "classnames"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { lightBlue } from "@material-ui/core/colors"

const useStyles = makeStyles((theme) => ({
	mail: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		margin: "1px 1px 1px 1px",
		padding: "5px 1px 5px 1px",
		width: "100%",
		background: "white"
	},
	mailHover: {
		boxShadow: "1px 1px 1px 1px grey"
	},
	mailBody: {
		width: "30%",
		width: "-webkit-fill-available",
		padding: "0px 10px 0px 50px"
		// "&:hover": {
		// 	width: "25%"
		// }
	},
	mailSubject: {
		// width: "-webkit-fill-available",
		// alignContent: "center",
		// alignItems: "center",
		width: "20%",
		padding: "0px 10px 0px 50px",
		overflow: "hidden",
		textOverflow: "-o-ellipsis-lastline",
		display: "-webkit-box",
		WebkitLineClamp: 1,
		WebkitBoxOrient: "vertical",
		wordWrap: "break-word",
		wordBreak: "break-all",
		whiteSpace: "nowrap"
	},
	singleMailOperation: {
		display: "none"
	},
	singleMailOperationHover: {
		display: "flex",
		float: "right",
		zIndex: "2",
		flexDirection: "row",
		// justifyContent: "space-between",
		alignItems: "center",
		justifySelf: "flex-end",
		width: "10%"
	},
	operation: {
		margin: "5px 10px 5px 10px",
		padding: "5px 5px 5px 5px",
		cursor: "pointer",
		"&:hover": {
			background: "#CCCCCC",
			borderRadius: "50%"
		}
	},
	user: {
		width: "30%",
		overflow: "hidden",
		textOverflow: "-o-ellipsis-lastline",
		display: "-webkit-box",
		WebkitLineClamp: 1,
		WebkitBoxOrient: "vertical",
		wordWrap: "break-word",
		wordBreak: "break-all",
		whiteSpace: "nowrap"
	},
	read: {
		background: "#EBEBEB"
	},
	selected: {
		background: lightBlue[50]
	}
}))

function Mail(props) {
	const classes = useStyles()
	const { mail, box, loggedInUser } = props
	const [hover, setHover] = useState(false)
	const [selected, setSelected] = useState(false)
	const [read, setRead] = useState(mail.read)

	return (
		<div
			className={classnames(
				classes.mail,
				hover && classes.mailHover,
				read && classes.read,
				selected && classes.selected
			)}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<div>
				<Checkbox
					checked={selected}
					onChange={(e) => setSelected(e.target.checked)}
					inputProps={{
						"aria-label": "decorative checkbox"
					}}
					color='default'
				/>
			</div>
			<div className={classes.user}>
				{
					// "darshan250999@gmail.com"
					box === "inbox"
						? `From: ${mail.sender}`
						: `To: ${mail.receiver}`
				}
			</div>
			<div className={classes.mailSubject}>
				{
					// "[No Subject]"
					mail.subject
				}
			</div>
			<div className={classes.mailBody}>
				{
					// "this is sample body of the mail. body body body body body body"
					mail.message
				}
			</div>
			<div
				className={classnames(
					classes.singleMailOperation,
					hover && classes.singleMailOperationHover
				)}
			>
				{read ? (
					<Tooltip
						title='Mark as Unread'
						placement='top'
						TransitionComponent={Zoom}
					>
						<div
							className={classes.operation}
							onClick={() => setRead(false)}
						>
							<MailRounded color='action' />
						</div>
					</Tooltip>
				) : (
					<Tooltip
						title='Mark as Read'
						placement='top'
						TransitionComponent={Zoom}
					>
						<div
							className={classes.operation}
							onClick={() => setRead(true)}
						>
							<DraftsRoundedIcon color='action' />
						</div>
					</Tooltip>
				)}
				<Tooltip
					title='Move to Trash'
					placement='top'
					TransitionComponent={Zoom}
				>
					<div className={classes.operation}>
						<Delete color='action' />
					</div>
				</Tooltip>
			</div>
		</div>
	)
}

Mail.propTypes = {
	loggedInUser: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
	loggedInUser: state.security.user.username
})

export default connect(mapStateToProps, null)(Mail)
