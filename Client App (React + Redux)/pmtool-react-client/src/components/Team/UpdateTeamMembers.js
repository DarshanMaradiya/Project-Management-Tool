import React, { useEffect, useState } from "react"
import {
	cleanupSearchResultSlice,
	getUsersByKeyword
} from "../../actions/searchResultActions"
import SearchBar from "../UI/SearchBar"
import PropTypes from "prop-types"
import { connect, useDispatch } from "react-redux"
import classnames from "classnames"
import TransferList from "../UI/TransferList"
import ContainedButtons from "../UI/ContainedButton"
import {
	updateMembers,
	cleanupTeamSlice,
	getTeamByProjectIdentifier
} from "../../actions/teamActions"
import OutlinedCard from "../UI/OutlinedCard"
import useLoader from "../../hooks/useLoader"
import LoadinImg from "../UI/LoadingImg"
import LoadingImg from "../UI/LoadingImg"

function UpdateTeamMembers(props) {
	const [searchKeyword, setSearchKeyword] = useState("")
	const [notFound, setNotFound] = useState(false)
	const [newResults, setNewResults] = useState([])
	const [users, setUsers] = useState([])
	const [leader, setLeader] = useState(props.leader)
	const [members, setMembers] = useState([])

	const dispatch = useDispatch()
	const { project_identifier } = props.match.params
	const loaderArgs = getTeamByProjectIdentifier(project_identifier, dispatch)
	const [loading, response, error, getTeam] = useLoader(loaderArgs)

	useEffect(() => {
		// const { project_identifier } = props.match.params
		// props.getTeamByProjectIdentifier(project_identifier)
		getTeam()
		return () => {
			props.cleanupSearchResultSlice()
			// props.cleanupTeamSlice()
		}
	}, [])

	useEffect(() => {
		props.team.teamMembers &&
			setMembers(props.team.teamMembers.map((member) => member.user))
	}, [props.team])

	useEffect(() => {
		if (notFound) setTimeout(() => setNotFound(false), 10000)
	}, [notFound])

	useEffect(() => {
		setNotFound(searchKeyword !== "" && newResults.length == 0)
	}, [newResults])

	useEffect(() => {
		setNewResults(
			props.searchResult.filter((user) => {
				if (user.username === leader.username) return false

				let found = false
				for (var i = 0; i < members.length; i++) {
					if (members[i].username === user.username) {
						found = true
						break
					}
				}
				return !found
			})
		)
	}, [props.searchResult])

	useEffect(() => {
		setUsers(newResults)
	}, [newResults])

	const searchUser = () => {
		props.getUsersByKeyword(searchKeyword)
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const teamMemberUsernames = members.map((member) => member.username)
		// console.log(teamMemberUsernames, props.team.id)
		props.updateMembers(teamMemberUsernames, props.team.id, props.history)
	}

	return (
		<div className='register'>
			<div className='container'>
				<div className='row'>
					<div className='col-md-8 m-auto'>
						<h5 className='display-4 text-center'>
							Update Team Form
						</h5>
						<div>
							Team Leader:
							<OutlinedCard
								fullname={leader.fullName}
								username={leader.username}
								imageUrl={leader.imageUrl}
							/>
						</div>
						<hr />
						<div className='form-group'>
							<SearchBar
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
					</div>
					{loading ? (
						<LoadingImg />
					) : (
						<TransferList
							left={users}
							setLeft={setUsers}
							right={members}
							setRight={setMembers}
						/>
					)}
				</div>
				<div>
					<center>
						<ContainedButtons
							text='Update Team'
							variant='contained'
							color='primary'
							onClick={handleSubmit}
						/>
					</center>
				</div>
			</div>
		</div>
	)
}

UpdateTeamMembers.propTypes = {
	getUsersByKeyword: PropTypes.func.isRequired,
	errors: PropTypes.object.isRequired,
	searchResult: PropTypes.array.isRequired,
	leader: PropTypes.object.isRequired,
	team: PropTypes.object.isRequired,
	updateMembers: PropTypes.func.isRequired,
	cleanupSearchResultSlice: PropTypes.func.isRequired,
	cleanupTeamSlice: PropTypes.func.isRequired,
	getTeamByProjectIdentifier: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
	team: state.team.team,
	leader: state.security.user,
	searchResult: state.searchResult,
	errors: {
		...state.errors
	}
})

export default connect(mapStateToProps, {
	getUsersByKeyword,
	updateMembers,
	cleanupSearchResultSlice,
	cleanupTeamSlice,
	getTeamByProjectIdentifier
})(UpdateTeamMembers)
