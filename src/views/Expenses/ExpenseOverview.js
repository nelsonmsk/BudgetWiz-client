import React, { useState, useEffect } from 'react';
import {Link, Navigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Avatar, IconButton, Divider} from '@material-ui/core';

import {currentMonthPreview, expenseByCategory} from './api-expense';
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
		border: '1px solid aliceblue',
		backgroundColor: 'aliceblue',
		borderRadius: '20px',
		marginBottom: '15px',
	  	overflow: 'hidden'
	},
	title: {
	  padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
	  color: theme.palette.primary,
	  width: '100%',
	  marginLeft: '30%',
	  [theme.breakpoints.down('xs')]: {
		marginLeft: '3%',
		fontSize: '28px',
	  },
	},
	subtitle:{
	  fontWeight: '600',
	  textAlign: 'left',
	  padding: '10px 15px',
	  fontFamily: 'inherit',
	  border: '1px solid #e0e0e0',
	  [theme.breakpoints.down('xs')]: {
		  padding: '5px 10px',
		  fontSize: '18px'
	  },
	},
	statusBox: {
	  textAlign: 'center',
	  height: '360px',
	  width: '100%',
	  display: 'flex',
	  marginTop: '10px',
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
	  color: '#fafafa !important',
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
	  backgroundColor: '#3f4771',
	  [theme.breakpoints.down('xs')]: {
		  margin: '15px',
		  width: '75%'
	  },
	},
	statusYesterday: { 
	  padding: '10px',
	  borderRadius: '10px',
	  margin: '30px',
	  fontSize: '20px',
	  width: '100%',
	  backgroundColor: 'rgb(247 183 13) !important',
	  [theme.breakpoints.down('xs')]: {
		  margin: '15px',
		  width: '75%'
	  },
	},
	allLink: {
	  textDecoration: 'none',
	  color: 'black !important'
	},
	data: {
	  textAlign: 'center',
	  margin: '2% 10%',
	  [theme.breakpoints.down('xs')]: {
		  margin: '10px 0px'
	  },
	},
	header: {
	  width: '100%',
	  display: 'flex',
	},
	totals: {
	  width: '100%',
	  display: 'flex',
	  textAlign: 'center',
	  fontWeight: '600',
	  padding: '5px 0px',
	},
	headerAve: {
	  width: '33%',
	  marginTop: '5px',
	  backgroundColor: '#2bbd7e',
	  border: '3px solid white'
	},
	headerThis: {
	  width: '33%',
	  marginTop: '5px',
	  backgroundColor: '#2bbd7e',
	  border: '3px solid white'
	},
	headerBal: {
	  width: '33%',
	  marginTop: '5px',
	  backgroundColor: '#2bbd7e',
	  border: '3px solid white'
	},
	totalsAve:{
	  width: '33%',
	  fontWeight: 'bold',
	  [theme.breakpoints.down('xs')]: {
		  fontWeight: '300',
		  fontSize: '12px'
	  },	
	},
	totalsThis:{
	  width: '33%',
	  fontWeight: 'bold',
	  backgroundColor: '#2bbd7e',
	  [theme.breakpoints.down('xs')]: {
		  fontWeight: '300',
		  fontSize: '12px'
	  },	
	}, 
	totalsBal:{
	  width: '33%',
	  fontWeight: 'bold',
	  [theme.breakpoints.down('xs')]: {
		  fontWeight: '300',
		  fontSize: '12px'
	  },	
	},
  }));

export default function ExpenseOverview() {
	const classes = useStyles();
	const [redirectToSignin, setRedirectToSignin] = useState(false);
	const [expensePreview, setExpensePreview] = useState([]);
	const [expenseCategories, setExpenseCategories] = useState([]);
	
	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		const jwt = auth.isAuthenticated();
			currentMonthPreview({t: jwt.token}, signal).then((data) => {
				if (data.error) {
					console.log('data3:', data);
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
			expenseByCategory({t: jwt.token}, signal).then((data) => {
				if (data.error) {
					setRedirectToSignin(true);
				} else {	
					setExpenseCategories(data);
				}
			});
			return function cleanup(){
				abortController.abort();
			}
	}, []);
	
	const indicateExpense = (values) => {
		let color = '#4f83cc';
		if(values.total){
			const diff = values.total - values.average;
			if( diff < 0){
				color = '#e9858b';
			}
			if( diff > 0 ){
				color = '#2bbd7e';
			}
		}
		return color;
	};

	if (redirectToSignin) {
		return (<Navigate to={'/signin/'}/>);
	};

return (
	<Paper className={classes.root} elevation={4}>
		<div className={classes.cover}>
			<Typography variant="h4" className={classes.title} color="textPrimary"> You've spent !</Typography>
			<Divider style={{backgroundColor:'#2bbd7e'}}/>
			<div className={classes.statusBox}>
				<Typography component="span" className={classes.status}>
					${expensePreview.month ? expensePreview.month.totalSpent : '0'}
							<span className={classes.statusLead}> so far this month </span>
				</Typography>
				<div className={classes.statusText}>
					<Typography variant="h5" className={classes.statusToday}>
						${expensePreview.today ? expensePreview.today.totalSpent :'0'}
							<span className={classes.day}> today </span>
					</Typography>
					<Typography variant="h5" className={classes.statusYesterday}>
							${expensePreview.yesterday ? expensePreview.yesterday.totalSpent: '0'}
								<span className={classes.day}> yesterday </span>
					</Typography>
					<Link to="/expenses/all" className={classes.allLink}> <Typography variant="h6"> See more ... </Typography> </Link>
				</div>
			</div>
		</div>
		{expenseCategories.map((expense, index) => {
			return( <div className={classes.data} key={index}>
					<Typography variant="h5" className={classes.subtitle}> {expense._id} </Typography>
					<Divider style={{ backgroundColor: indicateExpense(expense.mergedValues), height: '5px'}}/>
					<div className={classes.header}>
						<Typography component="span" className={classes.headerAve}> past average </Typography>
						<Typography component="span" className={classes.headerThis}> this month </Typography>
						<Typography component="span" className={classes.headerBal}> {expense.mergedValues.total
								&& expense.mergedValues.total-expense.mergedValues.average > 0 ?
										"spent extra" : "saved" }
						</Typography>
					</div>
					<div className={classes.totals}>
						<Typography component="span" className={classes.totalsAve}> ${expense.mergedValues.average} </Typography>
						<Typography component="span" className={classes.totalsThis}> ${expense.mergedValues.total ?
												expense.mergedValues.total : 0}
						</Typography>
						<Typography component="span" className={classes.totalsBal}> ${expense.mergedValues.total ?
												Math.abs(expense.mergedValues.total-expense.mergedValues.average) :
													expense.mergedValues.average}
						</Typography>
					</div>
					<Divider/>
			</div> )
			})
		}
	</Paper>
);

};






