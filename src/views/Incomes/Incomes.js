import React, { useState, useEffect } from 'react';
import {Navigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Icon} from '@material-ui/core';
import {Accordion, AccordionDetails, AccordionSummary, Divider, TextField, Button} from '@material-ui/core';
import {Edit} from '@material-ui/icons';
import { DateTimePicker, DatePicker} from "@mui/x-date-pickers";

import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {listByUser, update} from './api-income';
import * as auth from  './../Auth/auth-helper';
import DeleteIncome from './DeleteIncome';

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
	color: '#e7837b'
  },
  textField: {
	margin: '5px 30px 5px 5px !important',
	[theme.breakpoints.up('sm')]: {
		width: '30% !important'
	},
  },
}));

export default function Incomes() {
	const classes = useStyles();
	const date = new Date(), y = date.getFullYear(), m = date.getMonth();
	const [firstDay, setFirstDay] = useState(new Date(y, m, 1));
	const [lastDay, setLastDay] = useState(new Date(y, m + 1, 0));
	const [redirectToSignin, setRedirectToSignin] = useState(false);
	const [incomes, setIncomes] = useState([]);
	const [saved, setSaved] = useState(false);
	const [error, setError] = useState([]);

	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		const jwt = auth.isAuthenticated();
		listByUser({firstDay: firstDay, lastDay: lastDay},
			{t: jwt.token}, signal)
			.then((data) => {
					if (data && data.error) {
						setRedirectToSignin(true);
					} else {
						setIncomes(data);
					}
			});
		return function cleanup(){
			abortController.abort();
		}
	},[]);
	
	const handleSearchFieldChange = name => date => {
		if(name === 'firstDay'){
			setFirstDay(date.$d);
		}else{
			setLastDay(date.$d);
		}
	};
	
	const searchClicked = () => {
	const jwt = auth.isAuthenticated();
		listByUser({firstDay: firstDay, lastDay: lastDay},{t: jwt.token}).then((data) => {
			if (data.error) {
				setRedirectToSignin(true);
			} else {
				setIncomes(data);
			}
		});
	};
	
	const handleChange = (name,index) => event => {
		const updatedIncomes = [...incomes];
			updatedIncomes[index][name] = event.target.value;
			setIncomes(updatedIncomes);
	};
	
	const handleDateChange = (date, index) => {
		const updatedIncomes = [...incomes];
			if(updatedIncomes[index]){
			updatedIncomes[index]['received_on'] = date;
			setIncomes(updatedIncomes);
			}
	};
	
	const clickUpdate = (index) => {
	const jwt = auth.isAuthenticated();
		let income = incomes[index];
		update({
			incomeId: income._id
		}, {
			t: jwt.token
		}, income).then((data) => {
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
		const updatedIncomes = [...incomes];
		let newIncomes = updatedIncomes.filter((v)=> v._id !== data._id);
		setIncomes(newIncomes);
	};

	if (redirectToSignin) {
		return (<Navigate to={'/signin/'}/>);
	};	
	
return (
	<Paper className={classes.root} elevation={4}>
		<div className={classes.search}>
			<DatePicker disableFuture
						//format="dd/MM/yyyy"
						label={"SHOWING RECORDS FROM"}
						views={["day", "month", "year"]}
						value={''}
						name={'firstDay'}
						onChange={handleSearchFieldChange('firstDay')}
						className={classes.datepicker}
			/>
			<DatePicker //format={"dd/MM/yyyy"}
						label={"TO"}
						views={["day", "month", "year"]}
						value={''}
						name={'lastDay'}
						onChange={handleSearchFieldChange('lastDay')}
						className={classes.datepicker}
			/>
				<Button variant="contained" color="secondary"
						onClick= {searchClicked}> GO </Button>
		</div>
		{incomes? (incomes.map((income, index) => {
			return <span key={index}>
				<Accordion className={classes.panel}>	
					<AccordionSummary expandIcon={ <Edit /> } >
						<div className={classes.info}>
							<Typography className={classes.amount}> $ {income.amount} </Typography>
							<Divider style={{marginTop: 4, marginBottom: 4}}/>
							<Typography> {income.category} </Typography>
							<Typography className={classes.date}>
									{new Date(income.received_on).toLocaleDateString()}
							</Typography>
						</div>
						<div >
							<Typography className={classes.heading}> {income.title} </Typography>
							<Typography className={classes.notes}> {income.notes} </Typography>
						</div>
					</AccordionSummary>
					<Divider/>
					<AccordionDetails style={{display: 'block'}}>
						<div>
								<TextField label={"Title"} value={income.title} className={classes.textField}
											onChange={handleChange('title', index)}/>
								<TextField label="Amount ($)" value={income.amount} className={classes.textField}
											onChange={handleChange('amount', index)} type="number"/>
						</div>
						<div>
							<DateTimePicker label="Incurred on"
											views={["day", "month", "year"]}
											//value={income.received_on}
											name={"received_on"}
											onChange={handleDateChange(index)}
											showTodayButton
											className={classes.textField}                                                                                                                       

							/>
							<TextField label="Category" value={income.category} className={classes.textField}
										onChange={handleChange('category', index)}/>
						</div>
						<TextField label="Notes" multiline minRows={"2"} maxRows={"4"}
									value={income.notes} className={classes.textField}
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
							<DeleteIncome income={income} updateIncome={handleUpdate}/>
						</div>
					</AccordionDetails>
				</Accordion>
			</span>
		})
		):(
			<Accordion className={classes.panel}>	
				<AccordionSummary>
					<div className={classes.info}>
						<Typography className={classes.heading}> No income data found, Please Add some incomes for this month! </Typography>
					</div>
				</AccordionSummary>
			</Accordion>		
		)
	}
	</Paper>
);

};






