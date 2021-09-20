import { CircularProgress } from "@material-ui/core"
import { SettingsInputCompositeRounded } from "@material-ui/icons"
import React, { useEffect, useState } from "react"
import { connect } from "react-redux"
import { handleToken } from "../../actions/SecurityActions"
import { getUrlParameter } from "../../UDFs"
import CustomizedSnackbars from "../UI/CustomizedSnackBar"

const OAuth2RedirectHandler = (props) => {
	console.log(props.location.search)
	const duration = 10000
	const token = getUrlParameter(props.location.search, "token")
	const error = getUrlParameter(props.location.search, "error")
	const [snackBar, showSnackBar] = CustomizedSnackbars({
		severity: "warning",
		message: error,
		vertical: "top",
		horizontal: "center",
		duration: duration
	})
	// const [progress, setProgress] = useState(0)

	useEffect(() => {
		let timer, interval
		if (token) {
			console.log(token)
			props.handleToken(token)
			props.history.push("/role")
		} else {
			showSnackBar(true)

			timer = setTimeout(() => {
				props.history.push("/")
				// window.location.href = "/"
			}, duration)
			const period = (duration / 12) * 100
			// interval = setInterval(() => {
			// 	console.log(progress)
			// 	setProgress((prevProgress) => prevProgress + period)
			// }, duration / 12)
		}
		return () => {
			clearTimeout(timer)
			clearInterval(interval)
		}
	}, [])

	// const getTimeLeft = (timer) => {
	// 	return timer
	// 		? Math.ceil(
	// 				(timer._idleStart + timer._idleTimeout - Date.now()) / 1000
	// 		  )
	// 		: 0
	// }

	return (
		<div>
			{snackBar}
			{
				// <CircularProgress variant='determinate' value={50} />
			}
		</div>
	)
}

export default connect(null, { handleToken })(OAuth2RedirectHandler)
