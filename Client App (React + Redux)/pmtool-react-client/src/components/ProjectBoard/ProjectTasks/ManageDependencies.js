import {
	Backdrop,
	Fade,
	makeStyles,
	Modal,
	Tooltip,
	Zoom
} from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { connect, useDispatch } from "react-redux"
import ContainedButtons from "../../UI/ContainedButton"
import DependenciesTransferList from "./DependenciesTransferList"
import PropTypes from "prop-types"
import {
	cleanupPreRequisiteTasks,
	getTaskDependencies,
	updateTaskDependencies
} from "../../../actions/backlogActions"
import { deepCompare } from "../../../UDFs"
import LoadingImg from "../../UI/LoadingImg"
import { cleanupErrorsState } from "../../../actions/errorsActions"
import LibraryAddIcon from "@material-ui/icons/LibraryAdd"

const useStyle = makeStyles((theme) => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	toolTip: {
		maxWidth: 500,
		fontSize: 15
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3)
	},
	buttonIcon: {
		cursor: "pointer",
		width: "30px",
		height: "30px",
		margin: "1px"
	}
}))

function ManageDependencies(props) {
	const classes = useStyle()
	const [errors, setErrors] = useState({})
	const [open, setOpen] = useState(false)
	const [projectTasks, setProjectTasks] = useState([])
	const [preRequisiteTasks, setPreRequisiteTasks] = useState([])
	const currentTask = props.projectTasks.find(
		(task) => task.projectSequence === props.projectSequence
	)

	useEffect(() => {
		return () => {
			setErrors({})
			setProjectTasks([])
			setPreRequisiteTasks([])
			props.cleanupErrorsState()
			props.cleanupPreRequisiteTasks()
		}
	}, [])

	useEffect(() => {
		setErrors(props.errors)
	}, [props.errors])

	useEffect(() => {
		if (open) {
			props.getTaskDependencies(
				props.projectIdentifier,
				props.projectSequence
			)
		} else if (!deepCompare(errors, {})) setOpen(true)
	}, [open])

	useEffect(() => {
		setPreRequisiteTasks(props.preRequisiteTasks)
		setProjectTasks(
			props.projectTasks.filter((task) => {
				if (task.projectSequence == currentTask.projectSequence)
					return false
				for (let i = 0; i < props.preRequisiteTasks.length; i++) {
					if (
						props.preRequisiteTasks[i].projectSequence ===
						task.projectSequence
					)
						return false
				}
				return true
			})
		)
	}, [props.preRequisiteTasks])

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const handleSubmit = () => {
		props.updateTaskDependencies(
			props.projectIdentifier,
			props.projectSequence,
			preRequisiteTasks
		)
		setOpen(false)
	}

	return (
		<div>
			<Tooltip
				title='Add pre-requisite tasks'
				placement='bottom'
				TransitionComponent={Zoom}
				classes={{ tooltip: classes.toolTip }}
			>
				<LibraryAddIcon
					onClick={handleOpen}
					className={classes.buttonIcon}
				/>
				{
					// <button
					// 	type='button'
					// 	onClick={handleOpen}
					// 	className={`btn btn-secondary ${classes.absolute}`}
					// >
					// 	Manage Dependencies
					// </button>
				}
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
					{
						// loading ? (
						// <LoadingImg />
						// ) :
						<div className={classes.paper}>
							{
								<DependenciesTransferList
									left={projectTasks}
									setLeft={setProjectTasks}
									right={preRequisiteTasks}
									setRight={setPreRequisiteTasks}
								/>
							}
							<div>
								<center>
									<ContainedButtons
										text='Done'
										variant='contained'
										color='primary'
										onClick={handleSubmit}
									/>
								</center>
							</div>
						</div>
					}
				</Fade>
			</Modal>
		</div>
	)
}

ManageDependencies.propTypes = {
	projectTasks: PropTypes.array.isRequired,
	preRequisiteTasks: PropTypes.array.isRequired,
	getTaskDependencies: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
	errors: state.errors,
	projectTasks: state.backlog.project_tasks,
	preRequisiteTasks: state.backlog.pre_requisite_tasks
})

export default connect(mapStateToProps, {
	getTaskDependencies,
	updateTaskDependencies,
	cleanupErrorsState,
	cleanupPreRequisiteTasks
})(ManageDependencies)
