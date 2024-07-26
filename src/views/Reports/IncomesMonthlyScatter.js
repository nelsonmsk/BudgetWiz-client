import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {Button} from '@material-ui/core';
import {VictoryChart, VictoryLabel, VictoryScatter, VictoryTooltip, VictoryTheme} from 'victory';
import { DatePicker} from "@mui/x-date-pickers";

import {plotIncomes} from './../Incomes/api-income';
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
	height:'550px !important',
	width:'650px !important',
	[theme.breakpoints.down('sm')]: {
		height:'400px !important',
		width:'450px !important',
	},
	[theme.breakpoints.down('xs')]: {
        width: '80% !important',
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

export default function IncomesMonthlyScatter() {
	const classes = useStyles();
	const [plot, setPlot] = useState([]);
	const [month, setMonth] = useState(new Date());
	const [error, setError] = useState('');

		useEffect(() => {
			const abortController = new AbortController();
			const signal = abortController.signal;
			const jwt = auth.isAuthenticated();
				plotIncomes({month: month},{t: jwt.token}, signal).then((data) => {
					if (data.error) {
						setError(data.error);
					} else {
						setPlot(data);
					}
				})
				return function cleanup(){
			abortController.abort();
		}
	}, []);


	const handleSearchFieldChange = value => date => {
		if(value !== null){
			setMonth(date.$d);
		}
	};
	
	const searchClicked = () => {
		const jwt = auth.isAuthenticated();
		plotIncomes({month: month},{t: jwt.token}).then((data) => {
			if (data.error) {
				setError(data.error);
			} else {
				setPlot(data);
			}
		});
	};

return (
	<Paper className={classes.root} elevation={4}>
		<div className={classes.chartWrapper}>
			<div className={classes.search}>
				<Typography className={classes.text}> Income scattered over </Typography>
				<DatePicker label="Month"
							views={["month"]}
							//value={month}
							onChange={handleSearchFieldChange('month')}
							className={classes.datepicker}
					/>
				<Button variant="contained" className={classes.gobutton}
						onClick= {searchClicked}> GO </Button>
			</div>
			<VictoryChart theme={VictoryTheme.material}
						height={400}
						width={550}
						domainPadding={40}>
				<VictoryScatter style={{
										data: { fill: "#e7837b", stroke: "#f44336", strokeWidth: 2 },
										labels: { fill: "#e7837b", fontSize: 10, padding:8}}}
								bubbleProperty="y"
								maxBubbleSize={15}
								minBubbleSize={5}
								labels={({ datum }) => `$${datum.y} on ${datum.x}th`}
								labelComponent={ <VictoryTooltip/> }
								data={plot}
								domain={{x: [0, 31]}}
					/>
				<VictoryLabel textAnchor="middle"
								style={{ fontSize: 14, fill: '#8b8b8b' }}
								x={270} y={390}
								text={`day of month`}
					/>
				<VictoryLabel textAnchor="middle"
								style={{ fontSize: 14, fill: '#8b8b8b' }}
								x={6} y={190}
								angle = {270}
								text={`Amount ($)`}
					/>
			</VictoryChart>
		</div>
	</Paper>
);

};






