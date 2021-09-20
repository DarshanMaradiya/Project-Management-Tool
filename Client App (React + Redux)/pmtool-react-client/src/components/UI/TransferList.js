import React, { useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import List from "@material-ui/core/List"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Checkbox from "@material-ui/core/Checkbox"
import Button from "@material-ui/core/Button"
import Divider from "@material-ui/core/Divider"
import PropTypes from "prop-types"
import OutlinedCard from "./OutlinedCard"

const useStyles = makeStyles((theme) => ({
	root: {
		margin: "auto"
	},
	cardHeader: {
		padding: theme.spacing(1, 2)
	},
	list: {
		width: 400,
		height: 460,
		backgroundColor: theme.palette.background.paper,
		overflow: "auto"
	},
	button: {
		margin: theme.spacing(0.5, 0)
	}
}))

function not(a, b) {
	return a.filter(
		(user) => b.filter((u) => u.username === user.username).length === 0
	)
}

function intersection(a, b) {
	return a.filter((user) => {
		for (var i = 0; i < b.length; i++) {
			if (b[i].username === user.username) {
				return true
			}
		}
		return false
	})
}

function union(a, b) {
	return [...a, ...not(b, a)]
}

function TransferList(props) {
	const classes = useStyles()
	const [checked, setChecked] = React.useState([])
	const { left, setLeft, right, setRight } = props

	useEffect(() => {
		setLeft(left)
	}, [left])

	useEffect(() => {
		setRight(right)
	}, [right])

	const leftChecked = intersection(checked, left)
	const rightChecked = intersection(checked, right)

	const getIndex = (list, item) => {
		for (let i = 0; i < list.length; i++) {
			if (list[i].username === item.username) return i
		}
		return -1
	}

	const handleToggle = (value) => () => {
		const currentIndex = getIndex(checked, value)
		const newChecked = [...checked]

		if (currentIndex === -1) {
			newChecked.push(value)
		} else {
			newChecked.splice(currentIndex, 1)
		}

		setChecked(newChecked)
	}

	const numberOfChecked = (items) => intersection(checked, items).length

	const handleToggleAll = (items) => () => {
		if (numberOfChecked(items) === items.length) {
			setChecked(not(checked, items))
		} else {
			setChecked(union(checked, items))
		}
	}

	const handleCheckedRight = () => {
		setRight(union(right, leftChecked))
		setLeft(not(left, leftChecked))
		setChecked(not(checked, leftChecked))
	}

	const handleCheckedLeft = () => {
		setLeft(left.concat(rightChecked))
		setRight(not(right, rightChecked))
		setChecked(not(checked, rightChecked))
	}

	const customList = (title, items) => (
		<Card>
			<CardHeader
				className={classes.cardHeader}
				avatar={
					<Checkbox
						onClick={handleToggleAll(items)}
						checked={
							numberOfChecked(items) === items.length &&
							items.length !== 0
						}
						indeterminate={
							numberOfChecked(items) !== items.length &&
							numberOfChecked(items) !== 0
						}
						disabled={items.length === 0}
						inputProps={{ "aria-label": "all items selected" }}
					/>
				}
				title={title}
				subheader={`${numberOfChecked(items)}/${items.length} selected`}
			/>
			<Divider />
			<List className={classes.list} dense component='div' role='list'>
				{items.map((user) => {
					const labelId = `transfer-list-all-item-${user.username}-label`

					return (
						<ListItem
							key={user.username}
							role='listitem'
							button
							onClick={handleToggle(user)}
						>
							<ListItemIcon>
								<Checkbox
									checked={getIndex(checked, user) !== -1}
									tabIndex={-1}
									disableRipple
									inputProps={{ "aria-labelledby": labelId }}
								/>
							</ListItemIcon>
							{
								// <ListItemText id={labelId} primary={user.username} />
							}
							<OutlinedCard
								fullname={user.fullname}
								username={user.username}
								imageUrl={user.imageUrl}
							/>
						</ListItem>
					)
				})}
				<ListItem />
			</List>
		</Card>
	)

	return (
		<Grid
			container
			spacing={2}
			justify='center'
			alignItems='center'
			className={classes.root}
		>
			<Grid item>{customList("Search Results", left)}</Grid>
			<Grid item>
				<Grid container direction='column' alignItems='center'>
					<Button
						variant='outlined'
						size='small'
						className={classes.button}
						onClick={handleCheckedRight}
						disabled={leftChecked.length === 0}
						aria-label='move selected right'
					>
						&gt;&gt; Add In
					</Button>
					<Button
						variant='outlined'
						size='small'
						className={classes.button}
						onClick={handleCheckedLeft}
						disabled={rightChecked.length === 0}
						aria-label='move selected left'
					>
						&lt;&lt; Move Out
					</Button>
				</Grid>
			</Grid>
			<Grid item>{customList("Team Members", right)}</Grid>
		</Grid>
	)
}

TransferList.propTypes = {
	left: PropTypes.array.isRequired,
	right: PropTypes.array.isRequired
}

export default TransferList
