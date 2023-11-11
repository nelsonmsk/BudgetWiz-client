import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import qs from 'qs';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';

import theme from './theme/theme';
import MainRouter from './Routes';

export default class App extends Component {
  render() {
	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<MainRouter/>
				</LocalizationProvider>
			</ThemeProvider>
		</BrowserRouter>
    );
  }
};
