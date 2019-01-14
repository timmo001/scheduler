import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import clone from '../common/clone';

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
    let rows = clone(newRows);
    if (rows && rows !== undefined) {
      let argsCount = 0, columns = [
        { id: 'name', label: 'Name' },
        { id: 'type', label: 'Type' },
        { id: 'schedule', label: 'Schedule' },
        { id: 'command', label: 'Command' }
      ];
      rows = rows.map(r => {
        if (r.args.length > argsCount) argsCount = r.args.length;
        delete r['_id'];
        return r;
      });
      for (let i = 0; i < argsCount; i++) columns.push({
        id: 'args',
        label: `Argument ${i > 10 ? i + 1 : `0${i + 1}`}`,
        disablePadding: true
      });
      columns.push({ id: 'last_run', label: 'Last Run', date: true });
      columns.push({ id: 'status', label: 'Status' });
      columns.push({ id: 'output', label: 'Output', noWrap: true });
      columns.push({ id: 'error', label: 'Error Output', noWrap: true });
      this.setState({ rows, columns });
    }
  };

  handleAddJob = () => this.setState({ addJob: true });

  handleAddJobClosed = () => this.setState({ addJob: false });

  render() {
    const { classes } = this.props;
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
                    handleAdd={this.handleAddJob} />
                }
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {addJob &&
          <AddJob
            handleClosed={this.handleAddJobClosed}
            handleAddJob={this.props.handleAddJob} />
        }
      </Suspense>
    );

  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  handleAddJob: PropTypes.func.isRequired
};

export default withStyles(styles)(Main);
