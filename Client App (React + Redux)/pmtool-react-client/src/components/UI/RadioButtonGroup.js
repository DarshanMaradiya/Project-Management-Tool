import React, { useEffect } from "react"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import OutlinedCard from "./OutlinedCard"
import { List, ListItem, makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
	formControl: {
		// margin: theme.spacing(1),
		display: "flex",
		justifyContent: "space-between",
		width: "100%",
		backgroundColor: theme.palette.background.paper
	},
	list: {
		width: 400,
		height: 460,
		backgroundColor: theme.palette.background.paper,
		overflow: "auto"
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	},
	outlinedCard: {
		// margin: theme.spacing(1),
		minWidth: "100%"
	}
}))

export default function RadioButtonsGroup(props) {
	const classes = useStyles()
	const { assigneeUsername, setAssigneeUsername } = props

	useEffect(() => {
		return () => {
			setAssigneeUsername("")
		}
	}, [])

	const handleChange = (event) => {
		setAssigneeUsername(event.target.value)
	}

	return (
		<FormControl component='fieldset'>
			<FormLabel component='legend'>Team Members</FormLabel>
			<RadioGroup
				aria-label='assignee'
				name='assignee'
				value={assigneeUsername}
				onChange={handleChange}
			>
				<List className={classes.list}>
					{props.members.map((member) => (
						<ListItem button key={member.username}>
							<FormControlLabel
								value={member.username}
								control={
									<Radio
										checked={
											member.username === assigneeUsername
										}
									/>
								}
								label={
									<OutlinedCard
										className={classes.outlinedCard}
										username={member.username}
										fullname={member.fullname}
									/>
								}
							></FormControlLabel>
						</ListItem>
					))}
				</List>
			</RadioGroup>
		</FormControl>
	)
}
