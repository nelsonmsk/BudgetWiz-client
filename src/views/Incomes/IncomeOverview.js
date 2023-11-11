import React, { useState, useEffect } from 'react';
import {Link, Navigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Avatar, IconButton, Divider} from '@material-ui/core';

import {currentMonthPreview, incomeByCategory} from './api-income';
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

export default function IncomeOverview() {
	const classes = useStyles();
	const jwt = auth.isAuthenticated;
	const [redirectToSignin, setRedirectToSignin] = useState(false);
	const [incomePreview, setIncomePreview] = useState([]);
	const [incomeCategories, setIncomeCategories] = useState([]);
	
	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
			currentMonthPreview({t: jwt.token}, signal).then((data) => {
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
	
	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
			incomeByCategory({t: jwt.token}, signal).then((data) => {
				if (data.error) {
					setRedirectToSignin(true);
				} else {	
					setIncomeCategories(data);
				}
			});
			return function cleanup(){
				abortController.abort();
			}
	}, []);
	
	const indicateIncome = (values) => {
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
				<Link to="/incomes/all"> <Typography variant="h6"> See more </Typography> </Link>
			</div>
		</div>
		{incomeCategories.map((income, index) => {
			return( <div key={index}>
					<Typography variant="h5"> {income._id} </Typography>
					<Divider style={{ backgroundColor: indicateIncome(income.mergedValues)}}/>
					<div>
						<Typography component="span"> past average </Typography>
						<Typography component="span"> this month </Typography>
						<Typography component="span"> {income.mergedValues.total
								&& income.mergedValues.total-income.mergedValues.average > 0 ?
										"spent extra" : "received" }
						</Typography>
					</div>
					<div>
						<Typography component="span"> ${income.mergedValues.average} </Typography>
						<Typography component="span"> ${income.mergedValues.total ?
												income.mergedValues.total : 0}
						</Typography>
						<Typography component="span"> ${income.mergedValues.total ?
												Math.abs(income.mergedValues.total-income.mergedValues.average) :
													income.mergedValues.average}
						</Typography>
					</div>
					<Divider/>
			</div> )
			})
		}
	</Paper>
);

};






