import React, { Suspense } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

const styles = theme => ({
  textField: {
    flexBasis: 200
  },
  margin: {
    margin: theme.spacing.unit
  },
  argButton: {
    marginTop: theme.spacing.unit
  }
});

class AddJob extends React.Component {
  state = {
    open: true,
    name: '',
    schedule: '0 * * * * *',
    type: 'shell',
    command: '',
    args: ['']
  };

  handleClose = () => this.setState({ open: false }, () => this.props.handleClosed());

  handleAdd = () => {
    const { name, type, command, args } = this.state;
    this.props.handleAddJob(name, type, command, args);
    this.handleClose();
  };

  handleChange = name => event => this.setState({ [name]: event.target.value });

  handleArgChange = id => event => {
    let { args } = this.state;
    args[id] = event.target.value;
    this.setState({ args });
  };

  render() {
    const { classes } = this.props;
    const {
      open,
      name,
      // type,
      schedule,
      command,
      args
    } = this.state;
    return (
      <Suspense fallback={<CircularProgress className={classes.progressRoot} />}>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add Job</DialogTitle>
          <DialogContent>
            {/* <DialogContentText>
            </DialogContentText> */}
            <TextField
              id="name"
              label="Name"
              autoFocus
              type="text"
              margin="dense"
              className={classNames(classes.margin, classes.textField)}
              value={name}
              onChange={this.handleChange('name')} />
            <br />
            <TextField
              id="schedule"
              label="Schedule"
              type="text"
              margin="dense"
              className={classNames(classes.margin, classes.textField)}
              value={schedule}
              onChange={this.handleChange('schedule')} />
            <br />
            <TextField
              id="command"
              label="Command"
              type="text"
              margin="dense"
              className={classNames(classes.margin, classes.textField)}
              value={command}
              onChange={this.handleChange('command')} />
            {args.map((arg, id) =>
              <TextField
                key={id}
                label={`Argument ${id > 10 ? id + 1 : `0${id + 1}`}`}
                className={classNames(classes.margin, classes.textField)}
                value={arg}
                onChange={this.handleArgChange(id)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    <Tooltip title="Delete argument" aria-label="Delete argument">
                      <IconButton aria-label="Delete argument" className={classes.margin}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                }} />
            )}
            <Tooltip title="Add argument" aria-label="Add argument">
              <IconButton aria-label="Add argument" className={classes.argButton}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleAdd} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Suspense>
    );
  }
}

AddJob.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClosed: PropTypes.func.isRequired,
  handleAddJob: PropTypes.func.isRequired
};

export default withStyles(styles)(AddJob);
