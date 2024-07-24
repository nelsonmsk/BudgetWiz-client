import {React, useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Icon } from '@material-ui/core';
import { DateTimePicker} from "@mui/x-date-pickers";

import {create} from './api-income';
import * as auth from  './../Auth/auth-helper';

const useStyles = makeStyles(theme => ({
  root: {
	display: 'flex',
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important'
  }, 
  card: {
    height: '50%',
	display: 'grid',
	justifyContent:'center',
    alignContent: 'stretch',
    alignItems: 'center',
    justifyItems: 'center',
    "@media (min-width: 768px)": {
      width: "350px"
    },
    "@media (min-width: 992px)": {
      width: "450px"
    },
    "@media (min-width: 1200px)": {
      width: "450px"
    },
  },
   title:{
	marginLeft:'3rem',
  }
}));

export default function NewIncome() {
	const classes = useStyles();
	const jwt = auth.isAuthenticated();
	const [redirect, setRedirect] = useState(false);
	const [values, setValues] = useState({
		title: '',
		amount: '',
		category: '',
		received_on: '',
		notes:'',
		error: ''
	});

	const handleChange = name => event => {
		setValues({ ...values, [name]: event.target.value });
	};

	const handleDateChange = date => {
		setValues({...values, received_on: date });
	};
	
	const clickCancel = () => {
		setRedirect(true);
	};

	const clickSubmit = () => {
		const income = {
			title: values.title || undefined,
			amount: values.amount || undefined,
			category: values.category || undefined,
			received_on: values.received_on || undefined,
			notes: values.notes || undefined,
		};
		create({t: jwt.token},income).then((data) => {
			if (data.error) {
				setValues({ ...values, error: data.error});
			} else {
				setValues({ ...values, error: ''});
				clickCancel();
			}
		})
	};
	
	if (redirect) {
		return (<Navigate to={'/incomes/all'}/>);
	};

return ( 

	<div className={classes.root}>
		<Card className={classes.card}>
			<CardContent>
				<Typography variant="h6" className={classes.title}>
					New Income
				</Typography>
				<TextField id="title" label="Title"
					className={classes.textField}
					value={values.title} onChange={handleChange('title')}
					margin="normal"/>
				<br/>
				<TextField id="amount" type="number" label="Amount"
					className={classes.textField} value={values.amount} onChange={handleChange('amount')}
					margin="normal"/>
				<br/>
				<TextField id="category" label="Category"
					className={classes.textField} value={values.category} onChange={handleChange('category')}
					margin="normal"/>
				<br/>
				<DateTimePicker label="Incurred on"
								views={["day", "month", "year"]}
								value={values.received_on}
								onChange={handleDateChange}
								showTodayButton
				/>
				<br/>
				<TextField id="multiline-flexible"label="Notes" multiline
						minRows="2" value={values.notes} onChange={handleChange('notes')}/>
				<br/>
				{
					values.error && (<Typography component="p" color="error">
						<Icon color="error" className={classes.error}>error</Icon>
							{values.error}</Typography>)
				}
			</CardContent>
			<CardActions>
				<Button color="primary" variant="contained" onClick={clickSubmit}
					className={classes.submit}>Submit</Button>
				<Button color="secondary" variant="contained" onClick={clickCancel}
					className={classes.submit}>Cancel</Button>
			</CardActions>
		</Card>
	</div>
);

};
