import React, { useEffect, useState } from "react"
import { connect, useDispatch } from "react-redux"
import {
	getAssignedTask,
	updateStatusProjectTask
} from "../actions/backlogActions"
import useLoader from "../hooks/useLoader"
import PropTypes from "prop-types"
import LoadingImg from "./UI/LoadingImg"
import {
	Button,
	Divider,
	makeStyles,
	Menu,
	MenuItem,
	Paper,
	Tab,
	Tabs,
	Typography,
	useTheme
} from "@material-ui/core"
import TabPanel from "./UI/TabPanel"
// import { TabPanel } from "@material-ui/lab"

const useStyle = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	container: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-start"
	},
	header: {
		display: "grid",
		gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
	},
	property: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	},
	item: {
		display: "grid",
		gridTemplateColumns: "3fr 1fr 1fr 1fr 1fr"
	}
}))

const getPriority = (level) => {
	switch (level) {
		case 1:
			return "HIGH"
		case 2:
			return "MEDIUM"
		case 3:
			return "LOW"
		default:
			return "LOW"
	}
}

function a11yProps(index) {
	return {
		id: `full-width-tab-${index}`,
		"aria-controls": `full-width-tabpanel-${index}`
	}
}

function MemberDashboard(props) {
	const classes = useStyle()
	const theme = useTheme()
	const loaderArgs = getAssignedTask(useDispatch())
	const [loading, response, error, getTasks] = useLoader(loaderArgs)
	const [anchorEl, setAnchorEl] = React.useState(null)
	const [projectSequence, setProjectSequence] = useState("")
	const [tab, setTab] = useState(0)

	const handleChange = (event, newTab) => {
		setTab(newTab)
	}
	const handleChangeIndex = (index) => {
		setTab(index)
	}

	const handleClick = (event, projectSequence) => {
		console.log("clicked")
		setProjectSequence(projectSequence)
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	useEffect(() => {
		getTasks()
	}, [])

	const statusMenu = (
		<Menu
			id='simple-menu'
			anchorEl={anchorEl}
			keepMounted
			open={Boolean(anchorEl)}
			onClose={handleClose}
			anchorOrigin={{
				vertical: "center",
				horizontal: "center"
			}}
			transformOrigin={{
				vertical: "center",
				horizontal: "center"
			}}
			getContentAnchorEl={null}
		>
			<MenuItem onClick={() => changeStatus("TO_DO")}>TO DO</MenuItem>
			<MenuItem onClick={() => changeStatus("IN_PROGRESS")}>
				IN PROGRESS
			</MenuItem>
			<MenuItem onClick={() => changeStatus("DONE")}>DONE</MenuItem>
		</Menu>
	)
	const changeStatus = (status) => {
		setAnchorEl(null)
		const projectTask = props.project_tasks.find(
			(task) => task.projectSequence === projectSequence
		)
		if (status == "DONE") {
			if (
				(projectTask.completionDate == "" ||
					projectTask.completionDate == null) &&
				window.confirm(
					"As you are marking task status to 'DONE',\nAre you sure you want to submit this task for approval to the leader?"
				)
			) {
				projectTask.status !== status &&
					props.updateStatusProjectTask(
						projectTask.projectIdentifier,
						projectSequence,
						status
					)
			}
		} else {
			if (
				projectTask.completionDate != "" &&
				projectTask.completionDate != null
			) {
				if (
					window.confirm(
						"You already have submitted this task for approval to the leader,\nAre you sure you want to pull off the task from approval and\nadd it again to your pending tasks?"
					)
				) {
					projectTask.status !== status &&
						props.updateStatusProjectTask(
							projectTask.projectIdentifier,
							projectSequence,
							status
						)
				}
			} else {
				projectTask.status !== status &&
					props.updateStatusProjectTask(
						projectTask.projectIdentifier,
						projectSequence,
						status
					)
			}
		}
	}

	const pending_tasks = props.project_tasks.filter(
		(task) => task.status !== "DONE" && task.available
	)
	const future_tasks = props.project_tasks.filter(
		(task) => task.status !== "DONE" && !task.available
	)
	const PendingTasks =
		pending_tasks.length !== 0 ? (
			<div className={classes.container}>
				<div className={classes.header}>
					<div className={classes.property}>Task Summary</div>
					<div className={classes.property}>Status</div>
					<div className={classes.property}>Priority</div>
					<div className={classes.property}>Due Date</div>
					<div className={classes.property}></div>
				</div>
				<Divider />
				{pending_tasks.map((task) => (
					<div className={classes.item}>
						<div>
							<Typography variant='h6' component='h6'>
								{task.summary}
							</Typography>
							<Typography
								className={classes.pos}
								color='textSecondary'
							>
								{task.projectName}
							</Typography>
						</div>

						<Button
							className={classes.property}
							onClick={(e) =>
								handleClick(e, task.projectSequence)
							}
						>
							{task.status}
						</Button>
						{statusMenu}
						<div className={classes.property}>
							{getPriority(task.priority)}
						</div>
						<div className={classes.property}>{task.dueDate}</div>
						<div className={classes.property}>:::</div>
					</div>
				))}
			</div>
		) : (
			<div>
				<center>
					<div>No tasks are here</div>
				</center>
			</div>
		)

	const FutureTasks =
		future_tasks.length !== 0 ? (
			<div className={classes.container}>
				<div className={classes.header}>
					<div className={classes.property}>Task Summary</div>
					<div className={classes.property}>Status</div>
					<div className={classes.property}>Priority</div>
					<div className={classes.property}>Due Date</div>
					<div className={classes.property}></div>
				</div>
				<Divider />
				{future_tasks.map((task) => (
					<div className={classes.item}>
						<div>
							<Typography variant='h6' component='h6'>
								{task.summary}
							</Typography>
							<Typography
								className={classes.pos}
								color='textSecondary'
							>
								{task.projectName}
							</Typography>
						</div>

						<div
							className={classes.property}
							// onClick={(e) =>
							// 	handleClick(e, task.projectSequence)
							// }
						>
							{task.status}
						</div>
						<div className={classes.property}>
							{getPriority(task.priority)}
						</div>
						<div className={classes.property}>{task.dueDate}</div>
						<div className={classes.property}>:::</div>
					</div>
				))}
			</div>
		) : (
			<div>
				<center>
					<div>No tasks are here</div>
				</center>
			</div>
		)

	const pending_approvals = props.project_tasks.filter(
		(task) => task.status === "DONE" && task.approved == false
	)
	const PendingApprovals =
		pending_approvals.length !== 0 ? (
			<div className={classes.container}>
				<div className={classes.header}>
					<div className={classes.property}>Task Summary</div>
					<div className={classes.property}>Status</div>
					<div className={classes.property}>Priority</div>
					<div className={classes.property}>Due Date</div>
					<div className={classes.property}>Completion Date</div>
				</div>
				<Divider />
				{pending_approvals.map((task) => (
					<div className={classes.item}>
						<div>
							<Typography variant='h6' component='h6'>
								{task.summary}
							</Typography>
							<Typography color='textSecondary'>
								{task.projectName}
							</Typography>
						</div>

						<Button
							className={classes.property}
							onClick={(e) =>
								handleClick(e, task.projectSequence)
							}
						>
							{task.status}
						</Button>
						{statusMenu}
						<div className={classes.property}>
							{getPriority(task.priority)}
						</div>
						<div className={classes.property}>{task.dueDate}</div>
						<div className={classes.property}>
							{task.completionDate}
						</div>
					</div>
				))}
			</div>
		) : (
			<div>
				<center>
					<div>No tasks are here</div>
				</center>
			</div>
		)
	const approved_tasks = props.project_tasks.filter(
		(task) => task.status === "DONE" && task.approved == true
	)
	const ApprovedTasks =
		approved_tasks.length !== 0 ? (
			<div className={classes.container}>
				<div className={classes.header}>
					<div className={classes.property}>Task Summary</div>
					<div className={classes.property}>Priority</div>
					<div className={classes.property}>Due Date</div>
					<div className={classes.property}>Completion Date</div>
					<div className={classes.property}>Approval Date</div>
				</div>
				<Divider />
				{approved_tasks.map((task) => (
					<div className={classes.item}>
						<div>
							<Typography variant='h6' component='h6'>
								{task.summary}
							</Typography>
							<Typography color='textSecondary'>
								{task.projectName}
							</Typography>
						</div>
						<div className={classes.property}>
							{getPriority(task.priority)}
						</div>
						<div className={classes.property}>{task.dueDate}</div>
						<div className={classes.property}>
							{task.completionDate}
						</div>
						<div className={classes.property}>
							{task.approvalDate}
						</div>
					</div>
				))}
			</div>
		) : (
			<div>
				<center>
					<div>No tasks are here</div>
				</center>
			</div>
		)

	const TaskTabs = (
		<Paper className={classes.root}>
			<Button onClick={() => getTasks()} className='btn bg-info'>
				Refresh
			</Button>
			<Tabs
				value={tab}
				onChange={handleChange}
				indicatorColor='primary'
				textColor='primary'
				centered
			>
				<Tab label='Pending Tasks' />
				<Tab label='Pending Approvals' />
				<Tab label='Approved Tasks' />
			</Tabs>
			{
				// <SwipeableViews
				// 	axis={theme.direction === "rtl" ? "x-reverse" : "x"}
				// 	index={tab}
				// 	onChangeIndex={handleChangeIndex}
				// 	>
			}
			<TabPanel value={tab} index={0} dir={theme.direction}>
				<h3>Available Tasks</h3>
				{PendingTasks}
				<br />
				<br />
				<h3>Future Tasks</h3>
				{FutureTasks}
			</TabPanel>
			<TabPanel value={tab} index={1} dir={theme.direction}>
				{PendingApprovals}
			</TabPanel>
			<TabPanel value={tab} index={2} dir={theme.direction}>
				{ApprovedTasks}
			</TabPanel>
			{
				// </SwipeableViews>
			}
		</Paper>
	)

	const dashboard = <div>{TaskTabs}</div>

	return <div>{loading ? <LoadingImg /> : dashboard}</div>
}

MemberDashboard.propTypes = {
	project_tasks: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
	project_tasks: state.backlog.project_tasks
})

export default connect(mapStateToProps, {
	getAssignedTask,
	updateStatusProjectTask
})(MemberDashboard)
