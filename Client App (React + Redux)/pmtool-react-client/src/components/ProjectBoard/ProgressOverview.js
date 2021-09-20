import {
	Card,
	CardContent,
	CardHeader,
	Divider,
	makeStyles
} from "@material-ui/core"
import React, { useEffect, useState } from "react"
import CustomizedProgressBars from "../UI/CustomizedProgressbars"

const useStyles = makeStyles((theme) => ({
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
		width: "35%"
	},
	header: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center"
	},
	verticalDivider: {
		border: "1px solid white",
		height: "25px",
		width: "1px",
		background: "black"
	},
	flexTable: {
		display: "flex",
		flexDirection: "column"
	},
	div: {
		display: "flex",
		flexDirection: "row",
		width: "100%",
		margin: "5px",
		padding: "5px",
		border: "1px solid black"
	},
	category: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-start",
		alignContents: "center",
		alignItems: "center",
		width: "60%"
	},
	value: {
		width: "40%",
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignContents: "center",
		alignItems: "center"
	}
}))

const getStatastics = (tasks) => {
	let todo = 0
	let inprogress = 0
	let done = 0
	let assigned = 0
	let approved = 0
	let total = 0

	tasks.forEach((task) => {
		switch (task.status) {
			case "TO_DO":
				todo++
				break
			case "IN_PROGRESS":
				inprogress++
				break
			case "DONE":
				done++
				break
		}

		if (task.approved) approved++
		if (task.assignee !== null) assigned++
		total++
	})

	return [todo, inprogress, done, assigned, approved, total]
}

function ProgressOverview(props) {
	const classes = useStyles()
	const { tasks } = props
	const [_todo, _inprogress, _done, _assigned, _approved, _total] =
		getStatastics(tasks)

	const [todo, setTodo] = useState(_todo)
	const [inprogress, setInprogress] = useState(_inprogress)
	const [done, setDone] = useState(_done)
	const [assigned, setAssigned] = useState(_assigned)
	const [approved, setApproved] = useState(_approved)
	const [total, setTotal] = useState(_total)

	return (
		<Card className={classes.paper}>
			<CardHeader
				title={
					<div className={classes.header}>
						<h3>Project Progress</h3>
					</div>
				}
			/>
			<CustomizedProgressBars
				value1={total !== 0 ? Math.round((done / total) * 100) : 100}
				value2={
					total !== 0
						? Math.round(((done + inprogress) / total) * 100)
						: 100
				}
			/>
			<br />

			<Divider />

			<CardContent>
				<div className={classes.flexTable}>
					<div className={classes.div}>
						<div className={classes.category}>To Do</div>
						<div className={classes.value}>{todo}</div>
					</div>
					<div className={classes.div}>
						<div className={classes.category}>In Progress</div>
						<div className={classes.value}>{inprogress}</div>
					</div>
					<div className={classes.div}>
						<div className={classes.category}>Done</div>
						<div className={classes.value}>{done}</div>
					</div>
					<div className={classes.div}>
						<div className={classes.category}>Assigned</div>
						<div className={classes.value}>{assigned}</div>
					</div>
					<div className={classes.div}>
						<div className={classes.category}>Approved</div>
						<div className={classes.value}>{approved}</div>
					</div>
					<div className={classes.div}>
						<div className={classes.category}>Total</div>
						<div className={classes.value}>{total}</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default ProgressOverview
