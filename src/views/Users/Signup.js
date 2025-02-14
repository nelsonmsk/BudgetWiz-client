import {React, useState,useEffect} from 'react';
import {Link as RouterLink,Navigate, redirect} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Grid,Link, IconButton,FormHelperText,Checkbox, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import registerImg from './../../assets/images/register.jpeg';

import Schema from 'validate';
import {create} from './api-user';

const schema = new Schema({
  name: {
    type: String,
    required: true,
    length: {min: 3, max: 64},
    message: {
      required: 'Name is required.'
    }
  },
  email: {
    type: String,
    required: true,
    length: {min: 3, max: 64},
    message: {
      required: 'Email is required.'
    }
  },
  password: {
    type: String,
    required: true,
    length: {min: 3, max: 128},
    message: {
      required: 'Password is required.'
    }
  },
  policy: {
    type: Boolean,
    checked: true,
    required:false,
  }
});

const useStyles = makeStyles(theme => ({
  root: {
	display: 'flex',
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
	backgroundColor: theme.palette.background.default,
	backgroundImage:'url('+ registerImg + ')',
    backgroundRepeat: 'no-repeat',
	backgroundAttachment: 'scroll',
	backgroundSize: 'cover',	
  }, 
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.neutral,
    height: '100%',
    minHeight: 'calc(100vh - 123px)',	
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(/images/roundtable.jpg)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '600px'
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {
	height: '100%',
    display: 'flex',
    flexDirection: 'column',
	backgroundColor: theme.palette.background.default,	
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  policy: {
    marginTop: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  },
  policyCheckbox: {
    marginLeft: '-14px'
  },
  signUpButton: {
    margin: theme.spacing(2, 0),
	backgroundColor: 'rgb(247 183 13) !important',
	color: 'rgb(255 255 255) !important'
  }
}));

export default function Signup() {
	const classes = useStyles();
	const [formState, setFormState] = useState({
		isValid: false,
		values: {},
		touched: {},
		errors: {},
		open: false
	});	

	useEffect(() => {
		const verrors = schema.validate(formState.values);
    const errors = getErrors(verrors);
		setFormState(formState => ({...formState,
												isValid: verrors.length > 0 ? false : true,
												errors: errors || {}
									}));
	}, [formState.values]);	
		
  const getErrors = (verrors) => {
    let errors = {};
    if (!verrors.length === 0){
        errors = {
          email: verrors[0] && verrors[0].path === 'email' ? verrors[0].message : undefined,
          password: (verrors[0] && verrors[0].path === 'password') || (verrors[1].path === 'password') ? verrors[0].message || verrors[1].message : undefined
      };
      return errors;
    } else {
      return errors = {};
    }
};

	const handleChange = event => {
		setFormState(formState => ({ ...formState, values: {
													...formState.values,[event.target.name]: event.target.type === 'checkbox'? 
														event.target.checked : event.target.value
												},
												touched: {...formState.touched,[event.target.name]: true
												}
		}));
	};

  const hasError = field => {
    if ( formState.touched[field] && formState.errors[field]) {
        return true;
    } else {
      return false;	
    }
  };

	const clickSubmit = (event) => {
    event.preventDefault();
		const user = {
			name: formState.values.name || undefined,
			email: formState.values.email || undefined,
			password: formState.values.password || undefined
		};
		create(user).then((data) => {
			if (data.error) {
				setFormState({...formState, errors:data.error});
				console.log('Error: '+ data.error);
			} else {
				setFormState({...formState, errors:'', open:true});
			}
		})
	};	

return ( 

	<div className={classes.root}>
		<Grid className={classes.contentContainer} item lg={7} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <form
                className={classes.form}
                onSubmit={clickSubmit}
              >
                <Typography
                  className={classes.title}
                  variant="h3"
                >
                  Create new account
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Use your email to create new account
                </Typography>
                <TextField
                  className={classes.textField}
                  error={hasError('name')}
                  fullWidth
                  helperText={
                    hasError('name') ? formState.errors.firstName[0] : null
                  }
                  label="Name"
                  name="name"
                  onChange={handleChange}
                  type="text"
                  value={formState.values.name || ''}
                  variant="outlined"
				          required
                />
                <TextField
                  className={classes.textField}
                  error={hasError('email')}
                  fullWidth
                  helperText={
                    hasError('email') ? formState.errors.email[0] : null
                  }
                  label="Email address"
                  name="email"
                  onChange={handleChange}
                  type="email"
                  value={formState.values.email || ''}
                  variant="outlined"
				          required
                />
                <TextField
                  className={classes.textField}
                  error={hasError('password')}
                  fullWidth
                  helperText={
                    hasError('password') ? formState.errors.password[0] : null
                  }
                  label="Password"
                  name="password"
                  onChange={handleChange}
                  type="password"
                  value={formState.values.password || ''}
                  variant="outlined"
				          required
                />
                <div className={classes.policy}>
                  <Checkbox
                    checked={formState.values.policy || false}
                    className={classes.policyCheckbox}
                    color="primary"
                    name="policy"
                    onChange={handleChange}
                  />
                  <Typography
                    className={classes.policyText}
                    color="textSecondary"
                    variant="body1"
                  >
                    I have read the{' '}
                    <Link
                      color="primary"
                      component={RouterLink}
                      to="#"
                      underline="always"
                      variant="h6"
                    >
                      Terms and Conditions
                    </Link>
                  </Typography>
                </div>
                {hasError('policy') && (
                  <FormHelperText error>
                    {formState.errors.policy[0]}
                  </FormHelperText>
                )}
                <Button
                  className={classes.signUpButton}
                  color="primary"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Sign up now
                </Button>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Have an account?{' '}
                  <Link
                    component={RouterLink}
                    to="/signin"
                    variant="h6"
                  >
                    Sign in
                  </Link>
                </Typography>
              </form>
            </div>
          </div>
		</Grid>  
	

<Dialog open={formState.open} onClose={true}>
	<DialogTitle>New Account</DialogTitle>
	<DialogContent>
		<DialogContentText>
			New account successfully created.
		</DialogContentText>
	</DialogContent>
	<DialogActions>
    <Link type='button' color='primary' component={RouterLink}
        to="/signin" variant="h6">
      Sign in
    </Link>
	</DialogActions>
</Dialog>
</div>
);
};
