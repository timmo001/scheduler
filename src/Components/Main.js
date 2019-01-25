import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const EnhancedTable = lazy(() => import('./EnhancedTable'));
const AddJob = lazy(() => import('./AddJob'));

const styles = theme => ({
  grid: {
    height: '100%',
    paddingTop: theme.spacing.unit * 4,
    paddingBottom: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    overflow: 'auto'
  },
  pageContainer: {
    height: '100%',
    overflowY: 'auto',
    transition: 'height 225ms cubic-bezier(0, 0, 0.2, 1) 0ms'
  },
  progress: {
    position: 'absolute',
    top: '50%',
    left: '50%'
  },
  cardContent: {
    padding: 0
  }
});

class Main extends React.Component {
  state = {
    addJob: false,
    columns: [],
    rows: []
  };

  componentDidMount = () => this.updateRows(this.props.data);

  componentWillReceiveProps = (nextProps) =>
    this.props.data !== nextProps.data && this.updateRows(nextProps.data);

  updateRows = newRows => {
    if (newRows && newRows !== undefined) {
      let columns = [
        { id: 'name', label: 'Name' },
        { id: 'type', label: 'Type' },
        { id: 'schedule', label: 'Schedule' },
        { id: 'command', label: 'Command', disablePadding: true }
      ];
      let argsCount = 0;
      newRows.map(r => {
        if (r.args.length > argsCount) argsCount = r.args.length;
        return argsCount;
      });
      const rows = newRows.map(r => {
        if (!r.args) return null;
        let row = {
          name: r.name || '',
          type: r.type || '',
          schedule: r.schedule === 'always' ? 'Constantly Running' : r.schedule || '',
          command: r.command || ''
        };
        for (let i = 0; i < argsCount; i++) {
          row[`argument${i}`] = r.args[i] || '';
        }
        row = {
          ...row,
          cwd: r.cwd || '',
          last_run: r.last_run || '',
          status: r.status > 0 ? `Error (${r.status})` :
            r.status === 0 ? `Completed Successfully (${r.status})` :
              r.status === -1 ? `Running (${r.status})` :
                r.status === -2 ?
                  `Not Ran yet (${r.status})` :
                  '',
          output: r.output || '',
          error: r.error || '',
          run: '',
          enabled: r.enabled || '',
        };
        return row;
      });
      for (let i = 0; i < argsCount; i++) {
        columns.push({
          id: `argument${i}`,
          label: `Argument ${i >= 9 ? i + 1 : `0${i + 1}`}`,
          disablePadding: true
        });
      }
      columns.push({ id: 'cwd', label: 'Working Directory' });
      columns.push({ id: 'last_run', label: 'Last Run', align: 'center', date: true });
      columns.push({ id: 'status', label: 'Status' });
      columns.push({ id: 'output', label: 'Output', noWrap: true });
      columns.push({ id: 'error', label: 'Error Output', noWrap: true });
      columns.push({ id: 'run', label: '', align: 'right', disablePadding: true });
      columns.push({ id: 'enabled', label: '', align: 'right', disablePadding: true });
      this.setState({ rows, columns });
    }
  };

  handleAddJob = () => this.setState({ addJob: true });

  handleAddJobClosed = () => this.setState({ addJob: false });

  render() {
    const { classes, handleAddJob, handleDeleteJob, handleUpdateJob, handleRunJob } = this.props;
    const { columns, rows, addJob } = this.state;

    return (
      <Suspense fallback={<CircularProgress className={classes.progress} />}>
        <Grid
          className={classes.grid}
          container
          alignItems="center"
          justify="center">
          <Grid item xs>
            <Card className={classes.card} align="center">
              <CardContent className={classes.cardContent} align="right">
                {rows &&
                  <EnhancedTable
                    title="Jobs"
                    columns={columns}
                    rows={rows}
                    handleAdd={this.handleAddJob}
                    handleDelete={handleDeleteJob}
                    handleUpdate={handleUpdateJob}
                    handleRun={handleRunJob} />
                }
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {addJob &&
          <AddJob
            handleClosed={this.handleAddJobClosed}
            handleAddJob={handleAddJob} />
        }
      </Suspense>
    );

  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  handleAddJob: PropTypes.func.isRequired,
  handleDeleteJob: PropTypes.func.isRequired,
  handleUpdateJob: PropTypes.func.isRequired,
  handleRunJob: PropTypes.func.isRequired
};

export default withStyles(styles)(Main);
