import React from 'react';
import { Navigate} from 'react-router-dom';
import * as auth from './auth-helper';

const PrivateRoute = ( props ) => { 
	return (auth.isAuthenticated() ? (
				props.element
			) : (
				<Navigate to={{pathname: '/signin' }}/>
			)
		);
};
export default PrivateRoute;