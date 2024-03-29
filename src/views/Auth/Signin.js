import React,{useState,useEffect} from 'react';
import {Link, Navigate,useLocation} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import {Grid,Button,Icon,IconButton,} from '@material-ui/core';
import loginImg from './../../assets/images/login.jpeg';
import { Facebook as FacebookIcon, Google as GoogleIcon } from './../../icons';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import * as auth from  './auth-helper';
import {signin} from  './api-auth';

const schema = {
  email: {
    presence: { allowEmpty: false, message: 'is required' },
    email: true,
    length: {
      maximum: 64
    }
  },
  password: {
    presence: { allowEmpty: false, message: 'is required' },
    length: {
      maximum: 128
    }
  }
};

const useStyles = makeStyles(theme => ({
  root: {
	display: 'flex',
	height: '100%',
	minHeight: 'calc(100vh - 123px)',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0px !important',
	backgroundColor: theme.palette.background.default,
	backgroundImage: 'url(' + loginImg + ')',
    backgroundRepeat: 'no-repeat',
	backgroundAttachment: 'scroll',
	backgroundSize: 'cover',	
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

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
	paddingTop: '20px',
	"@media (min-width: 1200px)": {
		margin: '20px 0',
    },
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
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0),
	backgroundColor: 'rgb(247 183 13) !important',
	color: 'rgb(255 255 255) !important'
  }
}));


export default function Signin(props) {
	const classes = useStyles();
	const [formState, setFormState] = useState({
		isValid: false,
		values: {},
		touched: {},
		errors: {},
		redirectToReferrer: false
	});	

	useEffect(() => {
		//const errors = validate(formState.values, schema);
		const errors = '';
		setFormState(formState => ({...formState,
												isValid: errors ? false : true,
												errors: errors || {}
									}));
	}, [formState.values]);	
		
	const handleChange = event => {
		setFormState(formState => ({ ...formState, values: {
													...formState.values,[event.target.name]: event.target.type === 'checkbox'? 
														event.target.checked : event.target.value
												},
												touched: {...formState.touched,[event.target.name]: true
												}
		}));
	};
	const hasError = field => formState.touched[field] && formState.errors[field] ? true : false;	
	
	const clickSubmit = () => {
		const user = {
			name: formState.values.name || undefined,
			email: formState.values.email || undefined,
			password: formState.values.password || undefined
		};
		signin(user).then((data) => {
			if (data.error) {
				setFormState({...formState, errors:data.error});
			} else {
				auth.authenticate(data, () => {
					setFormState({...formState, errors:'', redirectToReferrer:true});
				});
			}
		});
	};
	const handleSignIn = event => {
		event.preventDefault();
		<Navigate to={from}/>
	};	
	//const location = useLocation();
	const {from} = props.location  || {
		from: {
			pathname: '/'
		}
	};
	
	const {redirectToReferrer} = formState.redirectToReferrer;
	
    if (redirectToReferrer) {
		return (<Navigate to={from}/>)
	};
	
return (
	<div className={classes.root}>
	    <Grid className={classes.contentContainer} item lg={5} xs={12}>
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
                  Sign in
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Sign in with social media
                </Typography>
                <Grid
                  className={classes.socialButtons}
                  container
                  spacing={2}
                >
                  <Grid item>
                    <Button
                      color="primary"
                      onClick={handleSignIn}
                      size="large"
                      variant="contained"
                    >
                      <FacebookIcon className={classes.socialIcon} />
                      Login with Facebook
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
					  color="danger"
                      onClick={handleSignIn}
                      size="large"
                      variant="contained"
                    >
                      <GoogleIcon className={classes.socialIcon} />
                      Login with Google
                    </Button>
                  </Grid>
                </Grid>
                <Typography
                  align="center"
                  className={classes.sugestion}
                  color="textSecondary"
                  variant="body1"
                >
                  or login with email address
                </Typography>
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
                  type="text"
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
                <Button
                  className={classes.signInButton}
                  color="danger"
                  disabled={!formState.isValid}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                >
                  Sign in now
                </Button>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Don't have an account?{' '}
                  <Link
                    component={Link}
                    to="/signup"
                    variant="h6"
                  >
                    Sign up
                  </Link>
                </Typography>
              </form>
            </div>
          </div>
        </Grid>
	</div>
				
)	
};