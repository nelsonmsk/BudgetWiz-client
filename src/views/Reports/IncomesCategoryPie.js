import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Button} from '@material-ui/core';
import {VictoryPie, VictoryLabel, VictoryTheme} from 'victory';
import { DatePicker} from "@mui/x-date-pickers";

import * as auth from  './../Auth/auth-helper';
import {averageCategories} from './../Incomes/api-income';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	justifyContent: 'center',
	display: 'flex'
  },
  chartWrapper: {
	height:'650px !important',
	width:'600px !important',
	[theme.breakpoints.down('sm')]: {
		height:'500px !important',
		width:'500px !important',
	},
	[theme.breakpoints.down('xs')]: {
        width: '100% !important',
        height: '100% !important',
	},
  },
  search: {
	display: 'flex',
	marginBottom: '-50px',
	[theme.breakpoints.down('xs')]: {
        display: 'grid',
        marginBottom: '-10px',
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

export default function IncomesMonthlyScatter() {
	const classes = useStyles();
	const jwt = auth.isAuthenticated();
	const [error, setError] = useState('');
	const [incomes, setIncomes] = useState([]);
	const date = new Date(), y = date.getFullYear(), m = date.getMonth();
	const [firstDay, setFirstDay] = useState(new Date(y, m, 1));
	const [lastDay, setLastDay] = useState(new Date(y, m + 1, 0));

	useEffect(() => {
		const abortController = new AbortController();
		const signal = abortController.signal;
		const jwt = auth.isAuthenticated();
			averageCategories({firstDay: firstDay, lastDay: lastDay},
				{t: jwt.token}, signal).then((data) => {
					if (data.error) {
						setError(data.error);
					} else {
						setIncomes(data);
					}
				})
		return function cleanup(){
			abortController.abort()
		}
	}, []);

	const handleSearchFieldChange = value => date => {
		if(value === 'firstDay'){
			setFirstDay(date.$d);
		} else {
			setLastDay(date.$d);
		}
	};
	
	const searchClicked = () => {
		const jwt = auth.isAuthenticated();
		averageCategories({firstDay: firstDay, lastDay: lastDay},
			{t: jwt.token}).then((data) => {
				if (data.error) {
					setError(data.error);
				} else {
					setIncomes(data);
				}
			});
	};

return (
	<Paper className={classes.root} elevation={4}>
		<div className={classes.chartWrapper} >
			<div className={classes.search}>
				<Typography className={classes.text}> Income per category </Typography>
				<DatePicker disableFuture
						label="FROM"
						views={["day", "month", "year"]}
						//value={firstDay}
						onChange={handleSearchFieldChange('firstDay')}
						className={classes.datepicker}
				/>
				<DatePicker label="TO"
							views={["day", "month", "year"]}
							//value={lastDay}
							onChange={handleSearchFieldChange('lastDay')}
							className={classes.datepicker}
				/>
				<Button variant="contained" className={classes.gobutton}
						onClick= {searchClicked}> GO </Button>
			</div>
			<svg viewBox="0 0 320 320">
				<VictoryPie standalone={false} data={incomes.monthAVG} innerRadius={50}
							theme={VictoryTheme.material}
							labelRadius={(50 + 14 )}
							labelComponent={ <VictoryLabel angle={0} style={[{
																		fontSize: '11px',
																		fill: '#0f0f0f'
																	},
																	{
																		fontSize: '10px',
																		fill: '#013157'
																	}]} 
															text={({ datum }) => `${datum.x}\n $${datum.y}`}/>
									 }
				/>
					<VictoryLabel textAnchor="middle"
									style={{ fontSize: 14, fill: '#8b8b8b' }}
									x={175} y={170}
									text={`Received \nper category`}
						/>
			</svg>
		</div>
	</Paper>
);

};






