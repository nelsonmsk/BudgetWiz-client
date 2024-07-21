import React, {Fragment,useEffect, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';

import * as auth from './../Auth/auth-helper';
import withRouter from './withRouter';

const useStyles = makeStyles(theme => ({
	menubar: {
		backgroundColor: "rgb(247 183 13) !important",
	},
  	title: {
		marginRight: '15% ',
		fontStyle: 'italic',
		fontWeight: '700'
	},
	links: {
		textDecoration: 'none !important'
	},
	linky: {
		textDecoration: 'white !important'
	},
	headWrap: {
		marginLeft: '80px'
	},
	toolbar_lg: {
		visibility: 'visible',
		display: 'flex',
		[theme.breakpoints.down('sm')]: {
			visibility: 'hidden',
			display: 'none'
		},
	},
	toolbar_sm: {
		visibility: 'visible',
		[theme.breakpoints.up('md')]: {
			visibilty: 'hidden',
			display: 'none'
		},
		backgroundColor: 'rgb(247 183 13) !important'
	},
	menuButton: {
		marginLeft: '45%',
		marginRight: '-12px'
	}

}));

export const MenuBar = withRouter(() => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [anchor, setAnchor] = useState(null);
	const [screenWidth, setScreenWidth] = useState(0);

	const closeMenu = () => setAnchor(null);

	useEffect(()=>{
		const handleResize = () => setScreenWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	},[]);

	const IsActive = (path) =>{
		let location = useLocation();
		if (location.pathname === path){
			return {color: '#ff4081'};
		}else{
			if(screenWidth && screenWidth > 992){
				return {color: '#ffffff'};
			}else if(screenWidth && screenWidth < 992){
				return {color: '#3f4771'};
			}else{
				return {color: '#000000',};
			}
		}
	};

	const MenuItems = (props) => (

		!auth.isAuthenticated() ? 
		<Fragment>
			<MenuItem onClick={props.onClose}>			
				<Link to="/" >
					<IconButton aria-label="Home" style={IsActive("/")}>
						<HomeIcon/>
					</IconButton>
				</Link>
			</MenuItem>
			<MenuItem onClick={props.onclose}>
				<Link to="/signup" className={classes.links}>
					<Button style={IsActive("/signup")}> Sign Up </Button>
				</Link>
			</MenuItem>
			<MenuItem onClick={props.onclose}>
				<Link to="/signin" className={classes.links}>
					<Button style={IsActive("/signin")}> Sign In </Button>
				</Link> 
			</MenuItem>
		</Fragment>
		: <Fragment>
			<MenuItem onClick={props.onclose}>			
				<Link to="/" >
					<IconButton aria-label="Home" style={IsActive("/")}>
						<HomeIcon/>
					</IconButton>
				</Link>
			</MenuItem>
			<MenuItem onClick={props.onclose}>
				<Link to="/expenses/current/preview" className={classes.links} >
					<Button style={IsActive( "/expenses/current/preview")}>Expenses</Button>
				</Link>
			</MenuItem>
			<MenuItem onClick={props.onclose}>
				<Link to="/incomes/current/preview" className={classes.links} >
					<Button style={IsActive( "/incomes/current/preview")}>Incomes</Button>
				</Link>
			</MenuItem>
			<MenuItem onClick={props.onclose}>
				<Link to="/expenses/category/average" className={classes.links} >
					<Button style={IsActive( "/expenses/category/average")}>Reports</Button>
				</Link>
			</MenuItem>
			<MenuItem onClick={props.onclose}>
				<Link to="/expenses/new"  className={classes.linky}>
					<Button style={IsActive( "/expenses/new")}>Add Expense</Button>
				</Link>
			</MenuItem>
			<MenuItem onClick={props.onclose}>
				<Link to="/incomes/new"  className={classes.linky}>
					<Button style={IsActive( "/incomes/new")}>Add Income</Button>
				</Link>
			</MenuItem>
			<MenuItem onClick={props.onclose}>
				<Link to="/users" className={classes.links} >
					<Button style={IsActive( "/users")}>Users</Button>
				</Link>
			</MenuItem>
			<MenuItem onClick={props.onclose}>
			<Link to={"/users/" + auth.isAuthenticated().user._id}>
					<Button style={IsActive("/users/" + auth.isAuthenticated().user._id
					)}>
						My Profile
					</Button>
				</Link>
			</MenuItem>
			<MenuItem onClick={props.onclose}>
				<Button color="inherit"
					onClick={() => { auth.clearJWT(() =>navigate('/signin') ); }}>
						Sign out
				</Button>
			</MenuItem>
		</Fragment>
	);

return(
	<AppBar position="static" className={classes.menubar}>
		<Toolbar className={classes.toolbar_lg}>
			<Typography variant="h5" color="inherit" className={classes.title}>
				BudgetWiz
			</Typography>
			<Link to="/" >
				<IconButton aria-label="Home" style={IsActive("/")}>
					<HomeIcon/>
				</IconButton>
			</Link>
			{
			!auth.isAuthenticated() ?			
			(<span>
				<Link to="/signup" className={classes.links}>
					<Button style={IsActive("/signup")}> Sign Up </Button>
				</Link>
				<Link to="/signin" className={classes.links}>
					<Button style={IsActive("/signin")}> Sign In </Button>
				</Link>
			</span>)
			:			  
			(<span className={classes.headWrap} >
				<Link to="/expenses/current/preview" className={classes.links} >
					<Button style={IsActive( "/expenses/current/preview")}>Expenses</Button>
				</Link>
				<Link to="/incomes/current/preview" className={classes.links} >
					<Button style={IsActive( "/incomes/current/preview")}>Incomes</Button>
				</Link>
				<Link to="/expenses/category/average" className={classes.links} >
					<Button style={IsActive( "/expenses/category/average")}>Reports</Button>
				</Link>
				<Link to="/expenses/new"  className={classes.linky}>
					<Button style={IsActive( "/expenses/new")}>Add Expense</Button>
				</Link>
				<Link to="/incomes/new"  className={classes.linky}>
					<Button style={IsActive( "/incomes/new")}>Add Income</Button>
				</Link>				
				<Link to={"/users/" + auth.isAuthenticated().user._id}>
					<Button style={IsActive("/users/" + auth.isAuthenticated().user._id
					)}>
						My Profile
					</Button>
				</Link>
				<Button color="inherit"
					onClick={() => { auth.clearJWT(() => navigate('/')) }}>
						Sign out
				</Button>
			</span>)
			}
		</Toolbar>
		<Toolbar className={classes.toolbar_sm}>
			<Typography variant="h6" color="inherit" className={classes.title}>
				BudetWiz
			</Typography>
			<Menu anchorEl={anchor} open={Boolean(anchor)} 
					onClose={closeMenu}>
				<MenuItems onclose={closeMenu} />
			</Menu>
			<IconButton className={classes.menuButton} color={"inherit"} aria-label={"Menu"}
					onClick={e =>setAnchor(e.currentTarget )}>
				<MenuIcon />
			</IconButton>
		</Toolbar>
</AppBar>
)});
	