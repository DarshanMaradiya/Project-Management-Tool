import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"

const useStyles = makeStyles((theme) => ({
	root: {
		"& > *": {
			// margin: theme.spacing(1)
		}
	}
}))

export default function ContainedButtons({
	text,
	variant,
	color,
	onClick,
	disabled
}) {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<Button
				variant={variant}
				color={color}
				onClick={onClick}
				disabled={disabled}
			>
				{text}
			</Button>
		</div>
	)
}
