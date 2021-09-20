import React, { Component, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import { connect, useDispatch } from "react-redux"
import { loginAs, logout } from "../../actions/SecurityActions"
import { Avatar, Button, makeStyles, Menu, MenuItem } from "@material-ui/core"
import classnames from "classnames"
import {
	amber,
	blue,
	blueGrey,
	common,
	cyan,
	deepOrange,
	deepPurple,
	green,
	grey,
	indigo,
	lightBlue,
	lightGreen,
	lime,
	pink,
	purple,
	red,
	teal,
	yellow
} from "@material-ui/core/colors"
import MailIcon from "@material-ui/icons/Mail"
import useLoader from "../../hooks/useLoader"
import { getInboxMails } from "../../actions/mailboxActions"
import LoadingImg from "../UI/LoadingImg"
import ResetPassword from "./ResetPassword"

const useStyle = makeStyles((theme) => ({
	navBar: {
		Overflow: "hidden",
		position: "fixed",
		zIndex: 2,
		width: "100%"
	},
	sticky: {
		position: "fixed",
		top: "0",
		width: "100%"
	},
	flex: {
		display: "flex",
		justifyContent: "space-between",
		alignContent: "center",
		// width: "140px",
		alignItems: "center"
	},
	flexItems: {
		textAlign: "center",
		marginRight: "0.2cm"
		// color: "white"
	},
	avatarColor: {
		color: theme.palette.getContrastText(blueGrey[500]),
		backgroundColor: blueGrey[500]
	},
	navButton: {
		// margin: "0px",
		textTransform: "none",
		fontSize: "100%"
	},
	navItem: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		cursor: "pointer"
	}
}))

const Header = (props) => {
	const classes = useStyle()
	const [anchorEl, setAnchorEl] = React.useState(null)
	const [anchorEl2, setAnchorEl2] = React.useState(null)
	const [profileMenu, setProfileMenu] = useState(false)
	const [notificationMenu, setNotificationMenu] = useState(false)
	const loaderArgs = getInboxMails(1, 5, useDispatch())
	const [loading, response, error, getMails] = useLoader({
		...loaderArgs,
		onSuccess: null
	})

	useEffect(() => {
		getMails()
	}, [])

	const handleClose = () => {
		setAnchorEl(null)
		setAnchorEl2(null)
		setNotificationMenu(false)
		setProfileMenu(false)
	}

	const handleLogout = () => {
		setAnchorEl(null)
		logout(props.history)
	}

	const changeLoginMode = () => {
		setAnchorEl(null)
		props.security.role === "member"
			? props.loginAs("leader", props.history)
			: props.loginAs("member", props.history)
	}

	const handleSelect = () => {}

	const logout = () => {
		props.logout()
		window.location.href = "/"
	}
	const { validToken, user } = props.security

	let avatarText = ""

	if (user.fullName) {
		user.fullName.split(" ").forEach((text) => {
			avatarText += text[0]
		})
	}

	const userIsAuthenticated = (
		<div className='collapse navbar-collapse' id='mobile-nav'>
			<ul className='navbar-nav mr-auto'>
				<li className='nav-item'>
					<Link className='nav-link' to='/dashboard'>
						Dashboard
					</Link>
				</li>
			</ul>

			<ul className='navbar-nav ml-auto'>
				{
					<li className={classnames("nav-item", classes.navItem)}>
						<div
							className={classnames(
								"nav-link",
								classes.navButton
							)}
							aria-controls='notification'
							aria-haspopup='true'
							onClick={(e) => {
								setNotificationMenu(true)
								setAnchorEl2(e.currentTarget)
							}}
						>
							<div className={classes.flex}>
								<MailIcon />
							</div>
						</div>
						<Menu
							id='notification'
							anchorEl={anchorEl2}
							keepMounted
							open={Boolean(anchorEl2 && notificationMenu)}
							onClose={handleClose}
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
							{
								// 	loading ? (
								// 	<LoadingImg />
								// ) : (
								// 	response &&
								// 	(response.data.length !== 0 ? (
								// 		response.data.map((mail) => (
								// 			<MenuItem key={mail.id}>
								// 				{mail.message}
								// 			</MenuItem>
								// 		))
								// 	) : (
								// 		<div style={{ padding: "5px" }}>
								// 			You have no unread mails
								// 		</div>
								// 	))
								// 	)
							}

							<Link className='nav-link' to='/mailbox'>
								<center>Go to Mailbox</center>
							</Link>
						</Menu>
					</li>
				}
				{
					// <li className='nav-item'>
					// 	<Link className='nav-link ' to='/dashboard'>
					// 		<div className={classes.flex}>
					// 			<Avatar
					// 				src={user.imageUrl}
					// 				className={classnames(
					// 					classes.flexItems,
					// 					classes.avatarColor
					// 				)}
					// 			>
					// 				{avatarText}
					// 			</Avatar>
					// 			<span className={classes.flexItems}>
					// 				{user.fullName}
					// 			</span>
					// 		</div>
					// 	</Link>
					// </li>
				}

				<li className='nav-item'>
					<Button
						className={classnames("nav-link", classes.navButton)}
						aria-controls='profile'
						aria-haspopup='true'
						onClick={(e) => {
							setProfileMenu(true)
							setAnchorEl(e.currentTarget)
						}}
					>
						<div className={classes.flex}>
							<Avatar
								src={user.imageUrl}
								className={classnames(
									classes.flexItems,
									classes.avatarColor
								)}
							>
								{avatarText}
							</Avatar>
							<span className={classes.flexItems}>
								{user.fullName}
							</span>
						</div>
					</Button>

					<Menu
						id='profile'
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl && profileMenu)}
						onClose={handleClose}
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
						<MenuItem onClick={changeLoginMode}>
							Login as Team{" "}
							{props.security.role === "leader"
								? "Member"
								: "Leader"}
						</MenuItem>
						{props.localEmailUser && (
							<MenuItem onClick={handleClose}>
								<ResetPassword buttonText='Reset Password' />
							</MenuItem>
						)}

						<MenuItem onClick={handleLogout}>Logout</MenuItem>
					</Menu>
				</li>
			</ul>
		</div>
	)

	const userIsNotAuthenticated = (
		<div className='collapse navbar-collapse' id='mobile-nav'>
			<ul className='navbar-nav ml-auto'>
				<li className='nav-item'>
					<Link className='nav-link ' to='/register'>
						Sign Up
					</Link>
				</li>
				<li className='nav-item'>
					<Link className='nav-link' to='/login'>
						Login
					</Link>
				</li>
			</ul>
		</div>
	)

	let headerLinks

	if (validToken && user) {
		headerLinks = userIsAuthenticated
	} else {
		headerLinks = userIsNotAuthenticated
	}

	return (
		<nav
			className={classnames(
				"navbar navbar-expand-sm navbar-dark bg-primary mb-4",
				classes.navBar
			)}
		>
			<div className='container'>
				<Link className='navbar-brand' to='/'>
					Project Management Tool
				</Link>
				<button
					className='navbar-toggler'
					type='button'
					data-toggle='collapse'
					data-target='#mobile-nav'
				>
					<span className='navbar-toggler-icon' />
				</button>

				{headerLinks}
			</div>
		</nav>
	)
}

Header.propTypes = {
	logout: PropTypes.func.isRequired,
	security: PropTypes.object.isRequired,
	loginAs: PropTypes.func.isRequired,
	localEmailUser: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
	security: state.security,
	inbox: state.mailbox.inbox,
	localEmailUser: state.security.user.imageUrl == null
})

export default connect(mapStateToProps, { logout, loginAs })(Header)
