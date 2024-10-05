import React, { useState, useEffect } from 'react';
import {Link, Navigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Avatar, IconButton, Divider} from '@material-ui/core';

import {currentMonthPreview as incomeCurrentMonthPreview, incomeByCategory} from './api-income';
import {currentMonthPreview as expenseCurrentMonthPreview, expenseByCategory} from './../Expenses/api-expense';
import * as auth from  './../Auth/auth-helper';

const useStyles = makeStyles(theme => ({
	root: {
	  padding: theme.spacing(4),
	  height: '100%',
	  minHeight: 'calc(100vh - 123px)',
	  alignItems: 'center',
	  justifyContent: 'center',
	},
	cover: {
		width: '100%',
		backgroundColor: 'antiquewhite',
		borderRadius: '20px',
		marginBottom: '15px',
	  	overflow: 'hidden'
	},
	cover1: {
		width: '100%',
		backgroundColor: 'aliceblue',
		borderRadius: '20px',
		marginBottom: '15px',
	  	overflow: 'hidden'
	},
	title: {
	  padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
	  color: '#e7837b',
	  width: '100%',
	  marginLeft: '30%',
	  [theme.breakpoints.down('xs')]: {
		marginLeft: '3%',
		fontSize: '28px',
	  },
	},
	title1: {
		padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
		color: '#2bbd7e',
		width: '100%',
		marginLeft: '30%',
		[theme.breakpoints.down('xs')]: {
			marginLeft: '3%',
			fontSize: '28px',
		},
	  },
	statusBox: {
	  textAlign: 'center',
	  height: '360px',
	  width: '100%',
	  display: 'flex',
	  marginTop: '10px',
	  padding: '10px',
	  [theme.breakpoints.down('xs')]: {
		  display: 'grid',
		  height: '500px'
	  },
	},

	status: {
		backgroundColor: 'rgb(247 183 13) !important',
		borderRadius: '100%',
		height: '240px',
		width: '240px',
		padding: '40px',
		fontSize: '48px',
		marginLeft: '30%',
		alignContent: 'center',
		color: '#ffffff ',
		[theme.breakpoints.down('sm')]: {
			padding: '32px',
			fontSize: '36px',
			height: '160px',
			width: '160px',
			marginLeft: '3%'
		},
	  },

	statusLead: {
	  display: 'block',
	  paddingTop: '10px',
	  fontSize: '40% !important'
	},
	statusText: {
	  color: '#ffffff !important',
	  [theme.breakpoints.down('xs')]: {
		  display: 'block'
	  },
	},
	day:{
	  fontStyle: 'italic'
	},
	statusToday: {
	  padding: '10px',
	  borderRadius: '10px',
	  margin: '30px',
	  fontSize: '20px',
	  width: '100%',
	  color: '#ffffff',
	  backgroundColor: '#3f4771',
	  [theme.breakpoints.down('xs')]: {
		  margin: '15px',
		  width: '70%'
	  },
	},
	statusToday1: {
		padding: '10px',
		borderRadius: '10px',
		margin: '30px',
		fontSize: '20px',
		color: '#ffffff',
		width: '100%',
		backgroundColor: '#3f4771',
		[theme.breakpoints.down('xs')]: {
			margin: '15px',
			width: '70%'
		},
	  },
	statusYesterday: { 
	  padding: '10px',
	  borderRadius: '10px',
	  margin: '30px',
	  fontSize: '20px',
	  width: '100%',
	  color: '#ffffff',
	  backgroundColor: 'rgb(247 183 13)',
	  [theme.breakpoints.down('xs')]: {
		  margin: '15px',
		  width: '70%'
	  },
	},
	statusYesterday1: { 
		padding: '10px',
		borderRadius: '10px',
		margin: '30px',
		fontSize: '20px',
		width: '100%',
		color: '#ffffff',
		backgroundColor: 'rgb(247 183 13)',
		[theme.breakpoints.down('xs')]: {
			margin: '15px',
			width: '70%'
		},
	  },
	allLink: {
	  color: '#000000 !important',
	},
  }));

export default function GeneralOverview() {
	const classes = useStyles();
	const [redirectToSignin, setRedirectToSignin] = useState(false);
	const [incomePreview, setIncomePreview] = useState([]);
	const [expensePreview, setExpensePreview] = useState([]);
	
	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		const jwt = auth.isAuthenticated();
			expenseCurrentMonthPreview({t: jwt.token}, signal).then((data) => {
				if (data.error) {
					setRedirectToSignin(true);
				} else {
					setExpensePreview(data);
				}
			});
		return function cleanup(){
			abortController.abort();
		}
	}, []);
	
	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		const jwt = auth.isAuthenticated();
			incomeCurrentMonthPreview({t: jwt.token}, signal).then((data) => {
				if (data.error) {
					setRedirectToSignin(true);
				} else {
					setIncomePreview(data);
				}
			});
		return function cleanup(){
			abortController.abort();
		}
	}, []);

	if (redirectToSignin) {
		return (<Navigate to={'/signin/'}/>);
	};	

return (
	<Paper className={classes.root} elevation={4}>
		<div className={classes.cover}>
			<Typography variant="h4" className={classes.title}> You've received !</Typography>
			<Divider style={{backgroundColor:'#e7837b'}}/>
			<div className={classes.statusBox}>
				<Typography component="span" className={classes.status}>
					${incomePreview.month ? incomePreview.month.totalReceived : '0'}
							<span className={classes.statusLead}> so far this month </span>
				</Typography>
				<div>
					<Typography variant="h5" className={classes.statusToday}>
						${incomePreview.today ? incomePreview.today.totalReceived :'0'}
							<span className={classes.day}> today </span>
					</Typography>
					<Typography variant="h5" className={classes.statusYesterday}>
							${incomePreview.yesterday ? incomePreview.yesterday.totalReceived: '0'}
								<span className={classes.day}> yesterday </span>
					</Typography>
					<Link to="/incomes/current/preview" className={classes.allLink}> <Typography variant="h6"> View incomes </Typography> </Link>
				</div>
			</div>
		</div>
		<div className={classes.cover1}>
			<Typography variant="h4" className={classes.title1}> You've spent ! </Typography>
			<Divider style={{backgroundColor:'#2bbd7e'}}/>
			<div className={classes.statusBox}>
				<Typography component="span" className={classes.status}>
					${expensePreview.month ? expensePreview.month.totalSpent : '0'}
							<span className={classes.statusLead}> so far this month </span>
				</Typography>
				<div>
					<Typography variant="h5" className={classes.statusToday1}>
						${expensePreview.today ? expensePreview.today.totalSpent :'0'}
							<span className={classes.day}> today </span>
					</Typography>
					<Typography variant="h5" className={classes.statusYesterday1}>
							${expensePreview.yesterday ? expensePreview.yesterday.totalSpent: '0'}
								<span className={classes.day}> yesterday </span>
					</Typography>
					<Link to="/expenses/current/preview" className={classes.allLink}> <Typography variant="h6"> View expenses</Typography> </Link>
				</div>
			</div>
		</div>
	</Paper>
);

};






