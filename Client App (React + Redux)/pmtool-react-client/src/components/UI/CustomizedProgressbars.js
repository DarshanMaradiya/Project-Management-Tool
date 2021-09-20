import React, { useEffect, useState } from "react"
import { makeStyles, withStyles } from "@material-ui/core/styles"
import CircularProgress from "@material-ui/core/CircularProgress"
import LinearProgress from "@material-ui/core/LinearProgress"
import { Box, Fade, Tooltip, Typography } from "@material-ui/core"
import { blue, grey, lightBlue } from "@material-ui/core/colors"
import classnames from "classnames"

const BorderLinearProgress = withStyles((theme) => ({
	root: {
		height: 10,
		borderRadius: 5
	},
	colorPrimary: {
		backgroundColor:
			theme.palette.grey[theme.palette.type === "light" ? 200 : 700]
	},
	bar: {
		borderRadius: 5,
		backgroundColor: "#1a90ff"
	}
}))(LinearProgress)

const useStyles = makeStyles({
	root: {
		flexGrow: 1
	}
})

const progressBarClasses = ({ value1, value2 }) =>
	makeStyles((theme) => ({
		container: {
			width: "100%",
			height: "10px",
			position: "relative"
		},
		box: {
			width: "100%",
			height: "100%",
			position: "absolute",
			top: 0,
			left: 0,
			background: grey[200],
			borderRadius: "5px 5px 5px 5px",
			transition: "width 2s"
		},
		overlay1: {
			zIndex: 9,
			width: value1 + "%",
			background: lightBlue[800]
		},
		overlay2: {
			zIndex: 8,
			width: value2 + "%",
			background: blue[200]
		}
	}))

const ProgressBar = ({ value1 = 40, value2 = 100 }) => {
	const classes = progressBarClasses({ value1, value2 })()
	const [open, setOpen] = useState(false)

	useEffect(() => {
		setTimeout(() => {
			setOpen(true)
		}, 2010)
	}, [])

	return (
		<div className={classes.container}>
			<Tooltip
				arrow
				// onMouseEnter={() => setOpen(true)}
				// onMouseOut={() => setOpen(false)}
				// title={value2 != 100 ? "100%" : ""}
				title={""}
				// TransitionComponent={Fade}
				placement='bottom-end'
				open={open}
			>
				<div className={classes.box}></div>
			</Tooltip>
			<Tooltip
				arrow
				onMouseEnter={() => setOpen(true)}
				onMouseOut={() => setOpen(false)}
				title={"Done: " + value1 + "%"}
				TransitionComponent={Fade}
				placement='bottom-end'
				open={open}
			>
				<div
					className={classnames(classes.box, classes.overlay1)}
				></div>
			</Tooltip>
			<Tooltip
				arrow
				// onMouseEnter={() => setOpen(true)}
				// onMouseOut={() => setOpen(false)}
				title={value1 != 100 ? "In Progress: " + value2 + "%" : ""}
				TransitionComponent={Fade}
				placement='bottom-end'
				open={open}
			>
				<div
					className={classnames(classes.box, classes.overlay2)}
				></div>
			</Tooltip>
		</div>
	)
}

const useProgressBarStyles = makeStyles((theme) => ({
	root: {
		height: 10,
		borderRadius: 5
	},
	colorPrimary: {
		backgroundColor:
			theme.palette.grey[theme.palette.type === "light" ? 200 : 700]
	},
	bar: {
		borderRadius: 5,
		backgroundColor: "#1a90ff"
	}
}))

export default function CustomizedProgressBars({
	value1 = 40,
	value2 = 70,
	color
}) {
	const classes = useStyles()
	const [progressBarClasses, setProgressBarClasses] = useState(
		useProgressBarStyles()
	)
	const [progress1, setProgress1] = useState(0)
	const [progress2, setProgress2] = useState(0)
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		if (progress < value1)
			setTimeout(() => {
				setProgress(progress + 0.05 * value1)
			}, 20)
	}, [progress])

	useEffect(() => {
		setProgress1(value1)
		setProgress2(value2)
	}, [])

	return (
		<div className={classes.root}>
			<Box display='flex' alignItems='center'>
				<Box width='100%' mr={1}>
					<ProgressBar value1={progress1} value2={progress2} />
				</Box>
				<Box minWidth={35}>
					<Typography
						variant='body2'
						color='textSecondary'
					>{`${Math.round(progress)}%`}</Typography>
				</Box>
			</Box>
		</div>
	)
}
