import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
// import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
// import CardActions from '@material-ui/core/CardActions';
const EnhancedTable = lazy(() => import('./EnhancedTable'));

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
  };

  render() {
    const { classes, data } = this.props;
    // const {  } = this.state;

    return (
      <Suspense fallback={<CircularProgress className={classes.progress} />}>
        <Grid
          className={classes.grid}
          container
          alignItems="center"
          justify="center">
          <Grid item lg={4} md={8} sm={8} xs={12}>
            <Card className={classes.card} align="center">
              <CardContent className={classes.cardContent} align="left">
                <EnhancedTable
                  title={`Jobs: ${data.length}`}
                  rows={data} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Suspense>
    );

  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
};

export default withStyles(styles)(Main);
