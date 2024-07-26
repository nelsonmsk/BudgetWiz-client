import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Button} from '@material-ui/core';
import {VictoryChart, VictoryAxis, VictoryBar, VictoryTheme} from 'victory';
import { DatePicker} from "@mui/x-date-pickers";

import {yearlyIncomes} from './../Incomes/api-income';
import * as auth from  './../Auth/auth-helper';

const useStyles = makeStyles(theme => ({
	root: {
		padding: theme.spacing(4),
		height: '100%',
		minHeight: 'calc(100vh - 123px)',
		justifyContent: 'center',
		display: 'flex'
	  },
	  
	  chartWrapper: {
		height:'500px !important',
		width:'650px !important',
		[theme.breakpoints.down('sm')]: {
			height:'400px !important',
			width:'550px !important',
		},
		[theme.breakpoints.down('xs')]: {
			width: '100% !important',
			height: '100% !important',
		},
	  },
	  search: {
		display: 'flex',
		[theme.breakpoints.down('xs')]: {
			display: 'grid',
		},
	  },
	  datepicker: {
		margin: '5px 10px !important'
	  },
	  text:{
		margin: '5px 10px !important'
	  },
	  gobutton:{
		backgroundColor: '#e7837b'
	  }
}));

export default function IncomesYearlyBar() {
	const classes = useStyles();
	const [year, setYear] = useState(new Date());
	const [yearlyIncome, setYearlyIncome] = useState([]);
	const [error, setError] = useState('');

		useEffect(() => {
			const abortController = new AbortController();
			const signal = abortController.signal;
			const jwt = auth.isAuthenticated();
				yearlyIncomes({year: year.getFullYear()},{t: jwt.token}, signal).then((data) => {
					if (data.error) {
						setError(data.error);
					}
					setYearlyIncome(data);
				});
			return function cleanup(){
				abortController.abort();
			}
		}, []);
		
		const handleSearchFieldChange = value => date => {
			if(value !== null){
				setYear(date.$d);
			}
		};
		
		const searchClicked = () => {
			const jwt = auth.isAuthenticated();
			yearlyIncomes({year: year.getFullYear()},{t: jwt.token}).then((data) => {
				if (data.error) {
					setError(data.error);
				}else{
					setYearlyIncome(data);
				}
			});
		};

	const monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

return (
	<Paper className={classes.root} elevation={4}>
		<div className={classes.chartWrapper}>
			<div className={classes.search}>
				<Typography className={classes.text}> Your monthly Income in </Typography>
				<DatePicker label="Year"
							views={["year"]}
							//value={year}
							onChange={handleSearchFieldChange('year')}
							className={classes.datepicker}
					/>
				<Button variant="contained" className={classes.gobutton}
						onClick= {searchClicked}> GO </Button>
			</div>		
			<VictoryChart  theme={VictoryTheme.material}
							domainPadding={10}
							height={300}
							width={450}>
				<VictoryAxis/>
				<VictoryBar categories={{
									x: monthStrings
								}}
							style={{ data: { fill: "#e7837b", width: 20 }, labels: {fill: "#01579b"} }}
							data={yearlyIncome.monthTot}
							x={monthStrings['x']}
							domain={{x: [0, 13]}}
							labels={({datum}) => `$${datum.y}`}
					/>
			</VictoryChart>
		</div>
	</Paper>
);

};






