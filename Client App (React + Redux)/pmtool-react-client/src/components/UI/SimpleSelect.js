import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import FormHelperText from "@material-ui/core/FormHelperText"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import OutlinedCard from "./OutlinedCard"
import { Link } from "@material-ui/icons"

const useStyles = makeStyles((theme) => ({
	formControl: {
		// margin: theme.spacing(1),
		display: "flex",
		justifyContent: "space-between",
		minWidth: "100%"
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	},
	outlinedCard: {
		// margin: theme.spacing(1),
		minWidth: "100%"
	}
}))

export default function SimpleSelect(props) {
	const classes = useStyles()
	const { assignee, setAssignee } = props

	const handleChange = (event) => {
		setAssignee(event.target.value)
	}

	return (
		<div>
			<FormControl variant='outlined' className={classes.formControl}>
				<InputLabel id='demo-simple-select-outlined-label'>
					Select Assignee
				</InputLabel>
				<Select
					labelId='demo-simple-select-outlined-label'
					id='demo-simple-select-outlined'
					value={assignee.username}
					onChange={handleChange}
					label='Assignee'
				>
					{
						// <MenuItem value=''>
						// 	<em>None</em>
						// </MenuItem>
					}
					{props.members.length == 0 ? (
						<Link to=''>Add Team members</Link>
					) : (
						props.members.map((member) => (
							<MenuItem value={member.username}>
								<OutlinedCard
									className={classes.outlinedCard}
									username={member.username}
									fullname={member.fullname}
									imageUrl={member.imageUrl}
								/>
							</MenuItem>
						))
					)}
				</Select>
			</FormControl>
		</div>
	)
}
