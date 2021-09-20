import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardActions from "@material-ui/core/CardActions"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import { Avatar } from "@material-ui/core"
import { blueGrey, deepPurple } from "@material-ui/core/colors"

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: 275
	},
	bullet: {
		display: "inline-block",
		margin: "0 2px",
		transform: "scale(0.8)"
	},
	title: {
		fontSize: 14
	},
	pos: {
		marginBottom: 12
	},
	orange: {
		color: theme.palette.getContrastText(blueGrey[500]),
		backgroundColor: blueGrey[500]
	},
	purple: {
		color: theme.palette.getContrastText(deepPurple[500]),
		backgroundColor: deepPurple[500]
	}
}))

export default function TaskOutlinedCard(props) {
	const classes = useStyles()

	const { task } = props

	return (
		<Card className={classes.root} variant='outlined'>
			<CardActions>
				<CardContent>
					<Typography variant='h6' component='h6'>
						{task.summary}
					</Typography>
					<Typography className={classes.pos} color='textSecondary'>
						{task.projectSequence}
					</Typography>
				</CardContent>
			</CardActions>
		</Card>
	)
}
