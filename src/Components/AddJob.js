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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
  },
  checkbox: {
    marginLeft: -5
  }
});

class AddJob extends React.Component {
  state = {
    open: true,
    name: '',
    scheduleConstant: false,
    schedule: '0 * * * * *',
    type: 'shell',
    command: '',
    args: [''],
    cwd: ''
  };

  handleClose = () => this.setState({ open: false }, () => this.props.handleClosed());

  handleAdd = () => {
    const { name, type, scheduleConstant, schedule, command, args, cwd } = this.state;
    this.props.handleAddJob(name, type, scheduleConstant ? 'always' : schedule, command, args, cwd);
    this.handleClose();
  };

  handleChange = name => event => this.setState({ [name]: event.target.value });

  handleCheckedChange = name => event => this.setState({ [name]: event.target.checked });

  handleArgAdd = () => {
    const args = this.state.args;
    args.push('');
    this.setState({ args });
  };

  handleArgRemove = id => this.setState({ args: this.state.args.splice(id) });

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
      scheduleConstant,
      schedule,
      command,
      args,
      cwd
    } = this.state;
    return (
      <Suspense fallback={<CircularProgress className={classes.progressRoot} />}>
        <Dialog
          open={open}
          maxWidth="lg"
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add Job</DialogTitle>
          <DialogContent component="form">
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
            <FormControlLabel
              className={classes.checkbox}
              control={
                <Checkbox
                  checked={scheduleConstant}
                  onChange={this.handleCheckedChange('scheduleConstant')}
                  value="scheduleConstant" />
              }
              label="Constant" />
            <br />
            {!scheduleConstant &&
              <div>
                <TextField
                  id="schedule"
                  label="Schedule"
                  type="text"
                  margin="dense"
                  className={classNames(classes.margin, classes.textField)}
                  value={schedule}
                  onChange={this.handleChange('schedule')} />
                <br />
              </div>
            }
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
                label={`Argument ${id >= 9 ? id + 1 : `0${id + 1}`}`}
                className={classNames(classes.margin, classes.textField)}
                value={arg}
                onChange={this.handleArgChange(id)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">
                    <Tooltip title="Delete argument" aria-label="Delete argument">
                      <IconButton
                        aria-label="Delete argument"
                        className={classes.margin}
                        onClick={this.handleArgRemove}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                }} />
            )}
            <Tooltip title="Add argument" aria-label="Add argument">
              <IconButton
                aria-label="Add argument"
                className={classes.argButton}
                onClick={this.handleArgAdd}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <br />
            <TextField
              id="cwd"
              label="Working Directory"
              type="text"
              margin="dense"
              className={classNames(classes.margin, classes.textField)}
              value={cwd}
              onChange={this.handleChange('cwd')} />
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
