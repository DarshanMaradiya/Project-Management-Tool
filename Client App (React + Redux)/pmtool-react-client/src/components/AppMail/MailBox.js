import {
	AppBar,
	Button,
	CssBaseline,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	makeStyles,
	Toolbar,
	Typography,
	useTheme
} from "@material-ui/core"
import clsx from "clsx"
import React, { useState } from "react"
import MenuIcon from "@material-ui/icons/Menu"
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import InboxIcon from "@material-ui/icons/MoveToInbox"
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded"
import SendRoundedIcon from "@material-ui/icons/SendRounded"
import MenuRoundedIcon from "@material-ui/icons/MenuRounded"
import MailSection from "./MailSection"
import ComposeMailForm from "./ComposeMailForm"

const drawerWidth = "20%"

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
		height: "100%"
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		})
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	menuButton: {
		marginRight: 36
	},
	hide: {
		display: "none"
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: "nowrap",
		marginTop: "9.5vh"
	},
	drawerOpen: {
		width: drawerWidth,
		marginTop: "9.5vh",
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	drawerClose: {
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}),
		overflowX: "hidden",
		marginTop: "9.5vh",
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up("sm")]: {
			width: theme.spacing(9) + 1
		}
	},
	toolbar: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3)
	},
	container: {
		display: "flex",
		flexDirection: "row",
		height: "100%",
		width: "100%"
	},
	sideBar: {
		height: "100%",
		width: "20%",
		border: "1px solid black"
	},
	mailSection: {
		height: "100%",
		width: "-webkit-fill-available",
		border: "1px solid black",
		display: "flex"
	}
}))

function MailBox() {
	const classes = useStyles()
	const theme = useTheme()
	theme.direction = "ltr"
	const [open, setOpen] = useState(true)
	const [selected, setSelected] = useState("inbox")

	const handleDrawerOpen = () => {
		console.log("opening")
		setOpen(true)
	}

	const handleDrawerClose = () => {
		console.log("closing")
		setOpen(false)
	}

	return (
		<div className={classes.root}>
			<CssBaseline />
			<Drawer
				variant='permanent'
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open
					})
				}}
			>
				<div className={classes.toolbar}>
					<ListItem
						button
						key={"MailBox"}
						onClick={
							open == false ? handleDrawerOpen : handleDrawerClose
						}
					>
						<ListItemIcon>
							<MenuRoundedIcon />
						</ListItemIcon>
						<ListItemText primary={"MailBox"} />
					</ListItem>
				</div>
				<Divider />
				<List>
					<ListItem
						button
						key={"Inbox"}
						selected={selected === "inbox"}
						onClick={() => setSelected("inbox")}
					>
						<ListItemIcon>
							<InboxIcon />
						</ListItemIcon>
						<ListItemText primary={"Inbox"} />
					</ListItem>
					<ListItem
						button
						key={"Outbox"}
						selected={selected === "outbox"}
						onClick={() => setSelected("outbox")}
					>
						<ListItemIcon>
							<SendRoundedIcon />
						</ListItemIcon>
						<ListItemText primary={"Outbox"} />
					</ListItem>
					<ListItem
						button
						key={"Trash"}
						selected={selected === "trash"}
						onClick={() => setSelected("trash")}
					>
						<ListItemIcon>
							<DeleteRoundedIcon />
						</ListItemIcon>
						<ListItemText primary={"Trash"} />
					</ListItem>
				</List>
				<Divider />
				<ComposeMailForm />
			</Drawer>
			<div className={classes.mailSection}>
				<MailSection selected={selected} />
			</div>
		</div>
	)
}

export default MailBox
