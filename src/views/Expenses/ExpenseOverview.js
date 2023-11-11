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
	padding: '0px !important',
  }
}));

export default function ExpenseOverview() {
	const classes = useStyles();
	const jwt = auth.isAuthenticated;
	const [redirectToSignin, setRedirectToSignin] = useState(false);
	const [expensePreview, setExpensePreview] = useState([]);
	const [expenseCategories, setExpenseCategories] = useState([]);
	
	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
			currentMonthPreview({t: jwt.token}, signal).then((data) => {
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
				<Link to="/expenses/all"> <Typography variant="h6"> See more </Typography> </Link>
			</div>
		</div>
		{expenseCategories.map((expense, index) => {
			return( <div key={index}>
					<Typography variant="h5"> {expense._id} </Typography>
					<Divider style={{ backgroundColor: indicateExpense(expense.mergedValues)}}/>
					<div>
						<Typography component="span"> past average </Typography>
						<Typography component="span"> this month </Typography>
						<Typography component="span"> {expense.mergedValues.total
								&& expense.mergedValues.total-expense.mergedValues.average > 0 ?
										"spent extra" : "saved" }
						</Typography>
					</div>
					<div>
						<Typography component="span"> ${expense.mergedValues.average} </Typography>
						<Typography component="span"> ${expense.mergedValues.total ?
												expense.mergedValues.total : 0}
						</Typography>
						<Typography component="span"> ${expense.mergedValues.total ?
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






