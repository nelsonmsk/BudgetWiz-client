import React from 'react';
import {Link, useLocation, Navigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, IconButton,Button } from '@material-ui/core';
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
	}
}));

export const Menu = withRouter(() => {
	
const classes = useStyles();

return(
	<AppBar position="static" className={classes.menubar}>
		<Toolbar>
			<Typography variant="h5" color="inherit" className={classes.title}>
				BudgetWiz
			</Typography>
			<Link to="/" >
				<IconButton aria-label="Home" style={IsActive("/")}>
					<HomeIcon/>
				</IconButton>
			</Link>
			{
			!auth.isAuthenticated ?			
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
				<Link to={"/user/" + auth.isAuthenticated.user._id}>
					<Button style={IsActive("/user/" + auth.isAuthenticated.user._id
					)}>
						My Profile
					</Button>
				</Link>
				<Button color="inherit"
					onClick={() => { auth.clearJWT(() => Navigate('/')) }}>
						Sign out
				</Button>
			</span>)
			}
		</Toolbar>
</AppBar>)});
	
	function IsActive (path){
		let location = useLocation();
		if (location.pathname === path){
			return {color: '#000000'};
		}else{
			return {color: '#ffffff'};
		}
	};