import React, { useState, useEffect } from 'react';
import {Navigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Icon, Accordion, AccordionDetails, AccordionSummary, Divider, TextField, Button} from '@material-ui/core';
import { Edit} from '@material-ui/icons';
import { DateTimePicker, DatePicker} from "@mui/x-date-pickers";

import {listByUser, update} from './api-expense';
import * as auth from  './../Auth/auth-helper';
import DeleteExpense from './DeleteExpense';

const useStyles = makeStyles(theme => ({
	root: {
	  padding: theme.spacing(4),
	  height: '100%',
	  minHeight: 'calc(100vh - 123px)',
	  alignItems: 'center',
	  justifyContent: 'center',
	}, 
	search: {
	  diplay: 'flex',
	},
	datepicker: {
	  margin: '5px 10px !important'
	},
	panel: {
	  border: '1px solid black',
	  margin: '5px 0px'
	},
	info: {
	  margin: '5px 30px 5px 5px',
	  width: '15%'
	},
	amount: {
	  fontSize: '22px',
	  fontWeight: '600',
	  color: 'rgb(247 183 13)'
	},
	category: {},
	date: {
	  marginTop: '5px', 
	  fontWeight: '600',
	},
	heading: {
	  fontSize: '18px',
	  fontWeight: '600',
	  width: '100%'
	},
	notes: {
	  fontSize: '14px',
	  color: '#2bbd7e'
	},
	textField: {
	  margin: '5px 30px 5px 5px !important',
	  [theme.breakpoints.up('sm')]: {
		  width: '30% !important'
	  },
	},
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
		const abortController = new AbortController();
		const signal = abortController.signal;
		const jwt = auth.isAuthenticated();
		listByUser({firstDay: firstDay, lastDay: lastDay},
			{t: jwt.token}, signal)
			.then((data) => {
					if (data.error) {
						setRedirectToSignin(true);
					} else {
						setExpenses(data);
					}
			});
		return function cleanup(){
			abortController.abort();
		}
	}, []);
	
	const handleSearchFieldChange = value => date => {
		if(value === 'firstDay'){
			setFirstDay(date.$d);
		}else{
			setLastDay(date.$d);
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
	
	const handleDateChange = (date, index) => {
		const updatedExpenses = [...expenses];
			if(updatedExpenses[index]){
			updatedExpenses[index]['received_on'] = date;
			setExpenses(updatedExpenses);
			}
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
				setError([]);
			};
		});
	};

	const handleUpdate = (data) => {
		const updatedExpenses = [...expenses];
		let newExpenses = updatedExpenses.filter((v)=> v._id !== data._id);
		setExpenses(newExpenses);
	};

	if (redirectToSignin) {
		return (<Navigate to={'/signin/'}/>);
	};

return (
	<Paper className={classes.root} elevation={4}>
		<div className={classes.search}>
			<DatePicker disableFuture
						//format="dd/MM/yyyy"
						label="SHOWING RECORDS FROM"
						views={["day", "month", "year"]}
						//value={firstDay}
						onChange={handleSearchFieldChange('firstDay')}
						className={classes.datepicker}
			/>
			<DatePicker //format="dd/MM/yyyy"
						label="TO"
						views={["day", "month", "year"]}
						//value={lastDay}
						onChange={handleSearchFieldChange('lastDay')}
						className={classes.datepicker}
			/>
				<Button variant="contained" color="secondary"
						onClick= {searchClicked}> GO </Button>
		</div>
		{expenses.map((expense, index) => {
			return <span key={index}>
				<Accordion className={classes.panel}>	
					<AccordionSummary expandIcon={ <Edit /> } >
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
					</AccordionSummary>
					<Divider/>
					<AccordionDetails style={{display: 'block'}}>
						<div>
								<TextField label="Title" value={expense.title} className={classes.textField}
											onChange={handleChange('title', index)}/>
								<TextField label="Amount ($)" value={expense.amount} className={classes.textField}
											onChange={handleChange('amount', index)} type="number"/>
						</div>
						<div>
							<DateTimePicker label="Incurred on"
											views={["day", "month", "year"]}
											//value={expense.incurred_on}
											name={"received_on"}
											onChange={handleDateChange(index)}
											className={classes.textField}
											showTodayButton
							/>
							<TextField label="Category" value={expense.category} className={classes.textField}
										onChange={handleChange('category', index)}/>
						</div>
						<TextField label="Notes" multiline minRows={"2"}
									value={expense.notes} className={classes.textField}
									onChange={handleChange('notes', index)}
						/>
						<div className={classes.buttons}>
							{ error && ( <Typography component="p" color="error">
											<Icon color="error" className={classes.error}> </Icon>
												{error}
										</Typography> )
							}
							{ saved && <Typography component="span" color="secondary"> Saved </Typography> }
							<Button color="primary" variant="contained"
									onClick={()=> clickUpdate(index)}> Update </Button>
							<DeleteExpense expense={expense} updateExpense={handleUpdate}/>
						</div>
					</AccordionDetails>
				</Accordion>
			</span>
		})
	}
	</Paper>
);

};






