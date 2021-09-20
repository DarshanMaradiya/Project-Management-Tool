import { makeStyles } from "@material-ui/core"
import React from "react"
import loaderGIF from "../../assets/loader3.gif"

const useStyles = makeStyles((theme) => ({
	loader: {
		display: "flex",
		flexDirection: "row",
		alignContent: "space-around",
		justifyContent: "space-around"
	}
}))

function LoadingImg() {
	const classes = useStyles()
	return (
		<div className={"col-md-8 m-auto"}>
			<img src={loaderGIF} />
		</div>
	)
}

export default LoadingImg
