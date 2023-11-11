import React, { useState, useEffect } from 'react';
import {Link, Navigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Avatar, Icon} from '@material-ui/core';
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Divider, TextField, Button} from '@material-ui/core';
import {ArrowForward,Person, Edit} from '@material-ui/icons';
import { DateTimePicker, DatePicker} from "@mui/x-date-pickers";

import {listByUser, update, remove} from './api-expense';
import * as auth from  './../Auth/auth-helper';
import DeleteExpense from './DeleteExpense';

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

export default function Expenses() {
	const classes = useStyles();
	const date = new Date(), y = date.getFullYear(), m = date.getMonth();
	const [firstDay, setFirstDay] = useState(new Date(y, m, 1));
	const [lastDay, setLastDay] = useState(new Date(y, m + 1, 0));
	const jwt = auth.isAuthenticated();
	const [redirectToSignin, setRedirectToSignin] = useState(false);
	const [expenses, setExpenses] = useState([]);
	const [saved, setSaved] = useState(false);
	const [error, setError] = useState([]);
	
	useEffect(() => {
		const abortController = new AbortController()
		const signal = abortController.signal
		listByUser({firstDay: firstDay, lastDay: lastDay},
			{t: jwt.token}, signal)
			.then((data) => {
					if (data.error) {
						setRedirectToSignin(true);
					} else {
						setExpenses(data);
					}
			})
		return function cleanup(){
			abortController.abort();
		}
	}, []);
	
	const handleSearchFieldChange = value => date => {
		if(value == 'firstDay'){
			setFirstDay(date);
		}else{
			setLastDay(date);
		}
	};
	
	const searchClicked = () => {
		listByUser({firstDay: firstDay, lastDay: lastDay},{t: jwt.token}).then((data) => {
			if (data.error) {
				setRedirectToSignin(true);
			} else {
				setExpenses(data);
			}
		});
	};
	
	const handleChange = (name,index) => event => {
		const updatedExpenses = [...expenses];
			updatedExpenses[index][name] = event.target.value;
			setExpenses(updatedExpenses);
	};
	
	const handleDateChange = date => {
		setExpenses({...expenses, incurred_on: date });
	};
	
	const clickUpdate = (index) => {
		let expense = expenses[index];
		update({
			expenseId: expense._id
		}, {
			t: jwt.token
		}, expense).then((data) => {
			if (data.error) {
				setError(data.error);
			} else {
				setSaved(true);
				setTimeout(() => {setSaved(false)}, 3000);
			};
		});
	};

	const removeExpense = (index) => {
			let expense = expenses[index];
				remove({
					expenseId: expense._id
				}, {t: jwt.token}).then((data) => {
						if (data && data.error) {
							setError(data.error);
					} else {
						console.log('expense' + expense._id + 'deleted');
						setExpenses(data);
					}
				})
	};
	if (redirectToSignin) {
		return (<Navigate to={'/signin/'}/>);
	};
return (
	<Paper className={classes.root} elevation={4}>
		<div className={classes.search}>
			<DatePicker disableFuture
						format="dd/MM/yyyy"
						label="SHOWING RECORDS FROM"
						views={["year", "month", "date"]}
						value={firstDay}
						onChange={handleSearchFieldChange('firstDay')}
			/>
			<DatePicker format="dd/MM/yyyy"
						label="TO"
						views={["year", "month", "date"]}
						value={lastDay}
						onChange={handleSearchFieldChange('lastDay')}
			/>
				<Button variant="contained" color="secondary"
						onClick= {searchClicked}> GO </Button>
		</div>
		{expenses.map((expense, index) => {
			return <span key={index}>
				<ExpansionPanel className={classes.panel}>	
					<ExpansionPanelSummary expandIcon={ <Edit /> } >
						<div className={classes.info}>
							<Typography className={classes.amount}> $ {expense.amount} </Typography>
							<Divider style={{marginTop: 4, marginBottom: 4}}/>
							<Typography> {expense.category} </Typography>
							<Typography className={classes.date}>
									{new Date(expense.incurred_on).toLocaleDateString()}
							</Typography>
						</div>
						<div>
							<Typography className={classes.heading}> {expense.title} </Typography>
							<Typography className={classes.notes}> {expense.notes} </Typography>
						</div>
					</ExpansionPanelSummary>
					<Divider/>
					<ExpansionPanelDetails style={{display: 'block'}}>
						<div>
								<TextField label="Title" value={expense.title}
											onChange={handleChange('title', index)}/>
								<TextField label="Amount ($)" value={expense.amount}
											onChange={handleChange('amount', index)} type="number"/>
						</div>
						<div>
							<DateTimePicker label="Incurred on"
											views={["year", "month", "date"]}
											value={expense.incurred_on}
											onChange={handleDateChange(index)}
											showTodayButton
							/>
							<TextField label="Category" value={expense.category}
										onChange={handleChange('category', index)}/>
						</div>
						<TextField label="Notes" multiline rows="2"
									value={expense.notes}
									onChange={handleChange('notes', index)}
						/>
						<div className={classes.buttons}>
							{ error && ( <Typography component="p" color="error">
											<Icon color="error" className={classes.error}> error </Icon>
												{error}
										</Typography> )
							}
							{ saved && <Typography component="span" color="secondary"> Saved </Typography> }
							<Button color="primary" variant="contained"
									onClick={()=> clickUpdate(index)}> Update </Button>
							<DeleteExpense expense={expense} onRemove={removeExpense}/>
						</div>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			</span>
		})
	}
	</Paper>
);

};






