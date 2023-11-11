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
	padding: '0px !important',
  }
}));

export default function GeneralOverview() {
	const classes = useStyles();
	const jwt = auth.isAuthenticated;
	const [redirectToSignin, setRedirectToSignin] = useState(false);
	const [incomePreview, setIncomePreview] = useState([]);
	const [expensePreview, setExpensePreview] = useState([]);
	const [incomeCategories, setIncomeCategories] = useState([]);
	
	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
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
		<Typography variant="h4" color="textPrimary"> You've received </Typography>
		<div>
			<Typography component="span">
				${incomePreview.month ? incomePreview.month.totalReceived : '0'}
						<span> so far this month </span>
			</Typography>
			<div>
				<Typography variant="h5" color="primary">
					${incomePreview.today ? incomePreview.today.totalReceived :'0'}
						<span> today </span>
				</Typography>
				<Typography variant="h5" color="primary">
						${incomePreview.yesterday ? incomePreview.yesterday.totalReceived: '0'}
							<span className={classes.day}> yesterday </span>
				</Typography>
				<Link to="/incomes/current/preview"> <Typography variant="h6"> See more </Typography> </Link>
			</div>
		</div>
		<Divider/>
		<Typography variant="h4" color="textPrimary"> You've spent </Typography>
		<div>
			<Typography component="span">
				${expensePreview.month ? expensePreview.month.totalSpent : '0'}
						<span> so far this month </span>
			</Typography>
			<div>
				<Typography variant="h5" color="primary">
					${expensePreview.today ? expensePreview.today.totalSpent :'0'}
						<span> today </span>
				</Typography>
				<Typography variant="h5" color="primary">
						${expensePreview.yesterday ? expensePreview.yesterday.totalSpent: '0'}
							<span className={classes.day}> yesterday </span>
				</Typography>
				<Link to="/expenses/current/preview"> <Typography variant="h6"> See more </Typography> </Link>
			</div>
		</div>

	</Paper>
);

};






