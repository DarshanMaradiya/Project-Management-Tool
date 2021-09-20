import React, { Component, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getBacklog } from "../../actions/backlogActions"
import Backlog from "./Backlog"
import PropTypes from "prop-types"
import { connect, useDispatch } from "react-redux"
import { boardAlgorithm, deepCompare } from "../../UDFs"
import useLoader from "../../hooks/useLoader"
import LoadingImg from "../UI/LoadingImg"
import { getTeamByProjectIdentifier } from "../../actions/teamActions"
import { getProject } from "../../actions/projectActions"
import {
	Backdrop,
	Button,
	Fade,
	makeStyles,
	Modal,
	Tooltip,
	Zoom
} from "@material-ui/core"
import ContainedButtons from "../UI/ContainedButton"
import RefreshIcon from "@material-ui/icons/Refresh"
import DonutLargeIcon from "@material-ui/icons/DonutLarge"
import ProgressOverview from "./ProgressOverview"

const useStyles = makeStyles((theme) => ({
	rightButtonTray: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		alignContent: "center"
	},
	operation: {
		display: "flex",
		justifyContent: "center",
		flexDirection: "column",
		alignItems: "center",
		alignContent: "center",
		margin: "10px",
		padding: "5px",
		height: "50px",
		width: "50px",
		cursor: "pointer",
		"&:hover": {
			background: "#CCCCCC",
			borderRadius: "50%"
		}
	},
	bootstrapToolTip: {
		arrow: {
			color: theme.palette.common.black
		},
		tooltip: {
			backgroundColor: theme.palette.common.black,
			fontSize: "5"
		}
	},
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	}
}))

const ProjectBoard = (props) => {
	const classes = useStyles()
	const dispatch = useDispatch()
	const [open, setOpen] = useState(false)

	const { id } = props.match.params
	let loaderArgs = getBacklog(id, dispatch)
	const [PTLoading, PTResponse, PTError, getProject_tasks] =
		useLoader(loaderArgs)
	loaderArgs = getTeamByProjectIdentifier(id, dispatch)
	const [TeamLoading, TeamResponse, Teamerror, getTeam] =
		useLoader(loaderArgs)
	// loaderArgs = getProject(id, dispatch)
	// const [TeamLoading, TeamResponse, Teamerror, getTeam] = useLoader(
	// 	loaderArgs
	// )

	useEffect(() => {
		props.getProject(id, props.history)
		getProject_tasks()
		console.log("getting team")
		getTeam()
	}, [])

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const { project_tasks } = props.backlog
	const errors = PTError ? PTError.response.data : {}
	const [BoardContent, project_found] = boardAlgorithm(errors, project_tasks)

	return (
		<div className='container'>
			<center>
				<h2>{props.project.projectName}</h2>
			</center>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<Link
					to={
						project_found
							? `/addProjectTask/${id}`
							: `/projectBoard/${id}`
					}
					className='btn btn-primary mb-3'
				>
					<i className='fas fa-plus-circle'> Create Project Task</i>
				</Link>

				<div className={classes.rightButtonTray}>
					<Tooltip
						title='Progress Overview'
						placement='top'
						TransitionComponent={Zoom}
						classes={classes.bootstrapToolTip}
					>
						<div onClick={handleOpen} className={classes.operation}>
							<DonutLargeIcon
								style={{
									background:
										"-webkit-linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)",
									WebkitBackgroundClip: "text",
									WebkitTextFillColor: "transparent"
								}}
							/>
						</div>
					</Tooltip>

					<Modal
						aria-labelledby='transition-modal-title'
						aria-describedby='transition-modal-description'
						className={classes.modal}
						open={open}
						onClose={handleClose}
						closeAfterTransition
						BackdropComponent={Backdrop}
						BackdropProps={{
							timeout: 500
						}}
					>
						<Fade in={open}>
							<ProgressOverview tasks={project_tasks} />
						</Fade>
					</Modal>
					<Tooltip
						title='Refresh Board'
						placement='top'
						TransitionComponent={Zoom}
					>
						<div
							onClick={getProject_tasks}
							className={classes.operation}
						>
							<RefreshIcon />
						</div>
					</Tooltip>
				</div>
			</div>
			<br />
			<hr />
			{PTLoading && TeamLoading ? <LoadingImg /> : BoardContent}
		</div>
	)
}

ProjectBoard.propTypes = {
	backlog: PropTypes.object.isRequired,
	project: PropTypes.object.isRequired,
	getBacklog: PropTypes.func.isRequired,
	getProject: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
	backlog: state.backlog,
	errors: {
		...state.errors
	},
	project: state.project.project
})

export default connect(mapStateToProps, {
	getBacklog,
	getProject
})(ProjectBoard)
