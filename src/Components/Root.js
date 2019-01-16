import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
// import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Login from './Login';
import Main from './Main';
import config from '../config.json';

const styles = theme => ({
  root: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    maxHeight: '100%',
    maxWidth: '100%',
    background: '#383c45'
  },
  center: {
    justifyContent: 'center',
    textAlign: 'center',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)'
  },
  progress: {
    marginBottom: theme.spacing.unit
  },
  progressRoot: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  },
  text: {
    color: '#FAFAFA'
  }
});

let ws;
class Root extends React.Component {
  state = {
    snackMessage: { open: false, text: '' },
    connected: false,
    shouldLogIn: false,
    loggedIn: false,
    data: null
  };

  componentDidMount = () => {
    this.connectToWS();
  };

  handleLogIn = (username, password) => {
    this.setState({ login: { username, password } }, () =>
      ws.send(JSON.stringify({ request: 'login', login: { username, password } }))
    );
  };

  connectToWS = () => {
    ws = new WebSocket(config.ws_url || 'ws://localhost:8080');

    ws.onopen = () => {
      console.log("WebSocket connected");
      this.setState({ connected: true, shouldLogIn: true, snackMessage: { open: false, text: '' } });
    };

    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      process.env.NODE_ENV === 'development' &&
        console.log('WS - Received:', response);
      switch (response.request) {
        default: break;
        case 'login':
          if (response.accepted) {
            this.setState({ shouldLogIn: false });
            localStorage.setItem('username', this.state.login.username);
            sessionStorage.setItem('password', this.state.login.password);
          } // TODO Handle false
          break;
        case 'data':
          this.setState({ data: response.data });
          break;
      }
    };

    ws.onclose = () => {
      console.log('WS - Connection closed. Attempting reconnection..');
      !this.state.snackMessage.open &&
        this.setState({
          snackMessage: {
            open: true,
            text: 'Connection Lost. Attempting to reconnect..',
            persistent: true
          }
        });
      setTimeout(() => {
        this.connectToWS();
      }, 4000);
    };

  };

  handleSnackbarClose = () => this.setState({ snackMessage: { open: false, text: '' } });

  handleAddJob = (name, type, schedule, command, args) =>
    ws.send(JSON.stringify({
      request: 'add_job',
      login: this.state.login,
      job: {
        name, type, schedule, command, args,
        last_run: '',
        status: -2,
        output: '',
        error: ''
      }
    }));

  handleDeleteJob = jobs => {
    jobs = jobs.map(j => j['_id']);
    ws.send(JSON.stringify({
      request: 'delete_jobs',
      login: this.state.login,
      jobs
    }));
  };

  render() {
    const { handleLogIn } = this;
    const { classes } = this.props;
    const { shouldLogIn, connected, data, snackMessage } = this.state;

    return (
      <Suspense fallback={<CircularProgress className={classes.progressRoot} />}>
        <div className={classes.root}>
          {shouldLogIn ?
            <Login handleLogIn={handleLogIn} />
            :
            data ?
              <Main
                data={data}
                handleAddJob={this.handleAddJob}
                handleDeleteJob={this.handleDeleteJob} />
              :
              <div className={classes.center}>
                <CircularProgress className={classes.progress} />
                {connected ?
                  <Typography variant="subtitle1" className={classes.text}>
                    Loading..
                  </Typography>
                  :
                  <Typography variant="subtitle1" className={classes.text}>
                    Attempting to connect..
                  </Typography>
                }
              </div>
          }
          <Snackbar
            open={snackMessage.open}
            autoHideDuration={!snackMessage.persistent ? 4000 : null}
            onClose={!snackMessage.persistent ? this.handleSnackbarClose : null}
            onExited={this.handleExited}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{snackMessage.text}</span>}
            action={snackMessage.actions} />

        </div>
      </Suspense>
    );
  }
}

Root.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(styles)(Root);
