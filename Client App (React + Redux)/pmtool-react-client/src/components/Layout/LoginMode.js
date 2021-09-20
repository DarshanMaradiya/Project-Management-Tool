import { Button, makeStyles } from "@material-ui/core"
import React from "react"
import classnames from "classnames"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { loginAs } from "../../actions/SecurityActions"
import PersonIcon from "@material-ui/icons/Person"
import GroupIcon from "@material-ui/icons/Group"

const useStyle = makeStyles((theme) => ({
	loginButton: {
		display: "flex",
		flexDirection: "row",
		width: "100%",
		justifyContent: "space-between",
		height: "100%",
		padding: "0px",
		height: "100%",
		"& span": {
			height: "100%"
		},
		background: "#009DE6"
	},
	textButton: {
		width: "100%",
		height: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		alignContent: "center",
		justifyContent: "center",
		"&:hover": {
			background: "white",
			color: "#009DE6",
			"& svg": {
				width: "35vh",
				height: "35vh"
			}
		},
		color: "white",
		background: "#009DE6",
		fontSize: "large"
	},
	verticalDivider: {
		border: "1px solid white",
		height: "25px",
		width: "1px",
		background: "white"
		// right: "249px",
		// top: "10px"
	},
	icon: {
		"& svg": {
			width: "25vh",
			height: "25vh",
			transition: "width 0.4s, height 0.4s"
		}
	}
}))

function LoginMode(props) {
	const classes = useStyle()

	const handleSubmit = (role) => {
		props.loginAs(role, props.history)
	}

	return (
		<div style={{ height: "100%" }}>
			<Button variant='contained' className={classes.loginButton}>
				<span
					onClick={() => handleSubmit("leader")}
					className={classes.textButton}
				>
					<div className={classes.icon}>
						<PersonIcon />
					</div>
					{"Login as Team Leader"}
				</span>

				<span
					onClick={() => handleSubmit("member")}
					className={classes.textButton}
				>
					<div className={classes.icon}>
						<GroupIcon />
					</div>
					{"Login as Team Member"}
				</span>
			</Button>
		</div>
	)
}

LoginMode.propTypes = {
	loginAs: PropTypes.func.isRequired
}

export default connect(null, { loginAs })(LoginMode)
