import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Typography, Link } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
	 backgroundColor: "black",
	 justifyContent: 'center',
	 display: 'flex',
    "@media (max-width: 568px)": {
	  flexWrap: 'wrap'
	      },	 
  },
    footerTitle: {
    color: 'rgb(247 183 13) !important',
  },  
   quoteText: {
    color: 'white !important',
	fontSize:'80%',
	marginLeft: '0.6rem',
  }, 
}));

const Footer = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
	 
    >
      <Typography variant="caption"  className={classes.quoteText} >
        &copy;{' '}
        <Link
          component="a"
          href=""
          target="_blank"
		  className={classes.footerTitle}
        >
          BudgetWiz
		  
        </Link>
        . 2023
      </Typography>
	  
      <Typography variant="caption"  className={classes.quoteText} >	  
        By Nelsonmsk. All Rights Reserved
      </Typography>
    </div>
  );
};

Footer.propTypes = {
  className: PropTypes.string
};

export default Footer;
