import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
// import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AddIcon from '@material-ui/icons/Add';

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
  }
});

class Main extends React.Component {
  state = {
    addJob: false,
    columns: [
      { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
      { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
      { id: 'command', numeric: false, disablePadding: false, label: 'Command' }
    ],
    rows: []
  };

  componentDidMount = () => this.updateRows(this.props.data);

  componentWillReceiveProps = (oldProps, newProps) =>
    oldProps.data !== newProps.data && this.updateRows(newProps.data);

  updateRows = rows => {
    let argsCount = 0, { columns } = this.state;
    rows = rows.map(r => {
      if (r.args.length > argsCount) argsCount = r.args.length;
      delete r['_id'];
      return r;
    });
    for (let i = 0; i < argsCount; i++) columns.push({
      id: 'args',
      numeric: false,
      disablePadding: false,
      label: `Argument ${i > 10 ? i + 1 : `0${i + 1}`}`
    });
    this.setState({ rows, columns });
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
          <Grid item lg={8} md={8} sm={10} xs={12}>
            <Card className={classes.card} align="center">
              <CardContent className={classes.cardContent} align="right">
                {/* <Tooltip title="Add Job" aria-label="Add Job"> */}
                <Fab color="primary" className={classes.fab} size="small" onClick={this.handleAddJob}>
                  <AddIcon />
                </Fab>
                {/* </Tooltip> */}
                {rows &&
                  <EnhancedTable
                    title={`Jobs: ${rows.length}`}
                    columns={columns}
                    rows={rows} />
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
