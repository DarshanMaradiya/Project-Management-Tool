import React, { createRef, useEffect, useRef, useState } from "react"
import SearchBar from "../../UI/SearchBar"
import SimpleSelect from "../../UI/SimpleSelect"
import TaskAssignmentModal from "../../UI/TaskAssignmentModal"
import PropTypes from "prop-types"
import classnames from "classnames"
import { connect, useDispatch } from "react-redux"
import {
	cleanupSearchResultSlice,
	getUsersByKeyword
} from "../../../actions/searchResultActions"
import { assignTask } from "../../../actions/teamActions"
import ContainedButtons from "../../UI/ContainedButton"
import RadioButtonsGroup from "../../UI/RadioButtonGroup"
import {
	Avatar,
	Card,
	CardContent,
	CardHeader,
	Divider,
	Link,
	makeStyles
} from "@material-ui/core"
import { deepOrange, deepPurple } from "@material-ui/core/colors"
import Button from "@material-ui/core/Button"
import useLoader from "../../../hooks/useLoader"

const useStyles = makeStyles((theme) => ({
	transitionsModal: {
		display: "flex",
		justifyContent: "space-between",
		width: "100%",
		height: "100%",
		backgroundColor: theme.palette.background.paper
	},
	cardHeader: {
		padding: theme.spacing(1, 2)
	},
	searchBar: {
		width: 400,
		height: 70,
		backgroundColor: theme.palette.background.paper
	},
	button: {
		width: "100%"
	}
}))

function AssignTask(props) {
	const classes = useStyles()

	const [assigneeUsername, setAssigneeUsername] = useState(
		props.assignee ? props.assignee.user.username : ""
	)
	const [searchKeyword, setSearchKeyword] = useState("")
	const [notFound, setNotFound] = useState(false)
	const [newResults, setNewResults] = useState([])
	const [leader, setLeader] = useState(props.leader)
	const [open, setOpen] = useState(false)
	const searchBarRef = useRef()

	useEffect(() => {
		setAssigneeUsername(props.assignee ? props.assignee.user.username : "")
	}, [props.assignee, open])

	useEffect(() => {
		if (searchBarRef.current) {
			console.log("From here")
			searchBarRef.current.focus()
		}
	}, [searchBarRef.current])

	useEffect(() => {
		if (open && props.team.teamMembers) {
			setNewResults(props.team.teamMembers.map((member) => member.user))
		}
	}, [open])

	useEffect(() => {
		if (!open) {
			setSearchKeyword("")
			setNotFound(false)
		}
	}, [open])

	useEffect(() => {
		if (open && props.team.teamMembers)
			if (searchKeyword === "") {
				setNewResults(
					props.team.teamMembers.map((member) => member.user)
				)
			} else {
				let filteredResult = []
				props.team.teamMembers.forEach((member) => {
					if (
						member.user.username
							.toLowerCase()
							.includes(searchKeyword.toLowerCase()) ||
						member.user.fullname
							.toLowerCase()
							.includes(searchKeyword.toLowerCase())
					)
						filteredResult.push(member.user)
				})
				setNewResults(filteredResult)
			}
	}, [props.team.teamMembers, searchKeyword])

	useEffect(() => {
		setNotFound(searchKeyword !== "" && newResults.length == 0)
	}, [newResults])

	const searchUser = () => {
		let filteredResult = []
		props.team.teamMembers.forEach((member) => {
			if (
				member.user.username
					.toLowerCase()
					.includes(searchKeyword.toLowerCase()) ||
				member.user.fullname
					.toLowerCase()
					.includes(searchKeyword.toLowerCase())
			)
				filteredResult.push(member.user)
		})
		setNewResults(filteredResult)
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		console.log(props.backlog_id, props.projectTask_id, assigneeUsername)

		props.assignTask(
			props.backlog_id,
			props.projectTask_id,
			assigneeUsername
		)

		setOpen(false)
	}

	return (
		<div>
			<TaskAssignmentModal
				className={classes.transitionsModal}
				open={open}
				setOpen={setOpen}
				assignee={props.assignee}
				searchBarRef={searchBarRef}
			>
				<Card>
					<CardHeader
						className={classes.cardHeader}
						title={"Select Assignee"}
						subheader={
							props.assignee
								? `Assigned to ${props.assignee.user.fullname}`
								: "Not Assigned"
						}
					/>
					<Divider />

					<CardContent>
						<div
							className={classnames(
								"form-group",
								classes.searchBar
							)}
						>
							<SearchBar
								ref={searchBarRef}
								onChange={(value) => {
									setSearchKeyword(value)
									setNotFound(false)
								}}
								onRequestSearch={(value) =>
									value !== "" && searchUser()
								}
								className={classnames(
									"form-control form-control-lg ",
									{
										"is-invalid": notFound
									}
								)}
								style={{
									margin: "0 auto",
									maxWidth: 800
								}}
							/>
							{notFound && (
								<div className='invalid-feedback'>
									No further match Found
								</div>
							)}
						</div>
						<div className='form-group'>
							{props.team.teamMembers &&
							props.team.teamMembers.length == 0 ? (
								<Link
									style={{ cursor: "pointer" }}
									// to={`/updateTeamMembers/${props.backlog_id}`}
									onClick={() =>
										(window.location = `/updateTeamMembers/${props.backlog_id}`)
									}
								>
									Add Team Members
								</Link>
							) : (
								<RadioButtonsGroup
									assigneeUsername={assigneeUsername}
									setAssigneeUsername={setAssigneeUsername}
									members={newResults}
								/>
							)}
						</div>

						<Button
							className={classes.button}
							variant='contained'
							color='primary'
							onClick={handleSubmit}
							disabled={assigneeUsername == ""}
						>
							Assign Task
						</Button>
					</CardContent>
				</Card>
			</TaskAssignmentModal>
		</div>
	)
}

AssignTask.propTypes = {
	getUsersByKeyword: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	searchResult: PropTypes.array.isRequired,
	leader: PropTypes.object.isRequired,
	team: PropTypes.object.isRequired,
	cleanupSearchResultSlice: PropTypes.func.isRequired,
	assignTask: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
	team: state.team.team,
	leader: state.security.user,
	searchResult: state.searchResult,
	errors: state.errors
})

export default connect(mapStateToProps, {
	getUsersByKeyword,
	cleanupSearchResultSlice,
	assignTask
})(AssignTask)
