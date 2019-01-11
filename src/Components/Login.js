import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import green from '@material-ui/core/colors/green';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const styles = theme => ({
  grid: {
    height: '100%',
    paddingTop: theme.spacing.unit * 8,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    overflow: 'auto'
  },
  media: {
    backgroundSize: 'contain',
    height: 140,
    [theme.breakpoints.up('md')]: {
      height: 240,
    },
  },
  fill: {
    flexGrow: 1,
  },
  margin: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 2,
  },
  textField: {
    flexBasis: '50%',
  },
  fakeButton: {
    width: 256,
  },
  cardContent: {
    paddingTop: theme.spacing.unit,
    paddingBottom: 0,
  },
  switch: {
    width: 256,
    justifyContent: 'center',
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`,
  },
  wrapper: {
    margin: theme.spacing.unit,
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class Login extends React.Component {
  state = {
    username: '',
    password: '',
    showPassword: false,
    loading: false,
    success: false,
  };

  componentDidMount = () => {
    const username = process.env.REACT_APP_OVERRIDE_USERNAME
      ? process.env.REACT_APP_OVERRIDE_USERNAME
      : localStorage.getItem('username');
    const password = process.env.REACT_APP_OVERRIDE_PASSWORD
      ? process.env.REACT_APP_OVERRIDE_PASSWORD
      : sessionStorage.getItem('password');

    this.setState({
      username: username ? username : '',
      password: password ? password : '',
    }, () => {
      this.handleValidation(invalid => {
        !invalid && this.props.handleLogIn(username, password);
      });
    });
  };

  handleValidation = cb => {
    if (!this.state.username) { this.setState({ invalid: 'No username!' }); cb(this.state.invalid); return; }
    if (!this.state.password) { this.setState({ invalid: 'No password!' }); cb(this.state.invalid); return; }
    this.setState({ invalid: undefined }, () => cb());
  };

  handleChange = prop => event => this.setState({ [prop]: event.target.value }, () => this.handleValidation(() => { }));

  handleCheckedChange = name => event => this.setState({ [name]: event.target.checked });

  handleMouseDownPassword = event => event.preventDefault();

  handleClickShowPassword = () => this.setState({ showPassword: !this.state.showPassword });

  handleKeyPress = (e) => {
    if (e.key === 'Enter' && !this.state.invalid) {
      this.props.handleLogIn(this.state.username, this.state.password);
    }
  };

  render() {
    const { classes } = this.props;
    const { username, password, showPassword,
      error, loading, success, invalid } = this.state;
    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
    });

    return (
      <Grid
        className={classes.grid}
        container
        alignItems="center"
        justify="center">
        <Grid item lg={4} md={8} sm={8} xs={12}>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent} align="center" component="form">
              <Typography variant="h5" component="h2">
                Login
              </Typography>
              {!process.env.REACT_APP_OVERRIDE_USERNAME &&
                <FormControl className={classNames(classes.margin, classes.textField, classes.fakeButton)}>
                  <InputLabel htmlFor="username">Username</InputLabel>
                  <Input
                    required
                    id="username"
                    type="text"
                    inputProps={{
                      autoCapitalize: 'none',
                      autoComplete: 'username'
                    }}
                    value={username}
                    onChange={this.handleChange('username')}
                    onKeyPress={this.handleKeyPress} />
                </FormControl>
              }
              {!process.env.REACT_APP_OVERRIDE_PASSWORD &&
                <FormControl className={classNames(classes.margin, classes.textField)}>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    required
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    inputProps={{
                      autoCapitalize: 'none',
                      autoComplete: 'current-password'
                    }}
                    value={password}
                    onChange={this.handleChange('password')}
                    onKeyPress={this.handleKeyPress}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={this.handleClickShowPassword}
                          onMouseDown={this.handleMouseDownPassword}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    } />
                </FormControl>
              }
              <Typography color="error">
                {error}
              </Typography>
            </CardContent>
            <CardActions>
              <div className={classes.fill} />
              {invalid &&
                <Typography color="error" variant="subtitle1">
                  {invalid}
                </Typography>
              }
              <div className={classes.wrapper}>
                <Button
                  className={buttonClassname}
                  disabled={loading || invalid ? true : false}
                  onClick={() => this.props.handleLogIn(username, password)}>
                  Log In
                </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
              </div>
            </CardActions>
          </Card>
        </Grid>
      </Grid >
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  handleLogIn: PropTypes.func.isRequired
};

export default withStyles(styles)(Login);
