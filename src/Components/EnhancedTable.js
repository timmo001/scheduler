import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Fab from '@material-ui/core/Fab';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
// import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { red, green } from '@material-ui/core/colors';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

function desc(a, b, orderBy) {
  if (!a || !b) return 0;
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, columns } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {columns.map(column => {
            return (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                padding={column.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === column.id ? order : false}
                style={{ whiteSpace: column.noWrap && 'nowrap' }}>
                {/* <Tooltip
                  title="Sort"
                  placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}> */}
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.createSortHandler(column.id)}>
                  {column.label}
                </TableSortLabel>
                {/* </Tooltip> */}
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  columns: PropTypes.array.isRequired,
  title: PropTypes.string
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { classes, numSelected, title, handleAdd, handleDelete } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}>
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
            <Typography variant="h6" id="tableTitle">
              {title}
            </Typography>
          )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          // <Tooltip title="Delete">
          <IconButton aria-label="Delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
          // </Tooltip>
        ) : (
            // <Tooltip title="Filter list">
            <Fab color="primary" className={classes.fab} size="small" onClick={handleAdd}>
              <AddIcon />
            </Fab>
            // </Tooltip>
          )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  title: PropTypes.string
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = () => ({
  root: {
    width: '100%'
  },
  table: {
    minWidth: 600,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  cell: {
    paddingRight: 24
  }
});

class EnhancedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'name',
    selected: [],
    page: 0,
    rowsPerPage: 8,
    rows: []
  };

  componentDidMount = () => this.updateRows(this.props.rows);

  componentWillReceiveProps = (nextProps) =>
    this.props.rows !== nextProps.rows && this.updateRows(nextProps.rows);

  updateRows = rows => this.setState({ rows });

  handleRequestSort = (_event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.rows.map((_n, id) => id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (_event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    this.setState({ selected: newSelected });
  };

  handleChangePage = (_event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  handleDelete = () => {
    this.props.handleDelete(this.state.selected.map(s =>
      this.props.rows.find(r => r === s)
    ));
    this.setState({ selected: [] });
  };

  handleEnabledChange = item => event => {
    item = this.props.rows.find(r => r === item);
    item.enabled = event.target.checked;
    this.props.handleUpdate(item);
  };

  render() {
    const { classes, title, columns, handleAdd, handleRun } = this.props;
    const { order, orderBy, selected, rowsPerPage, page, rows } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows ? rows.length : 0 - page * rowsPerPage);

    if (!rows) return null
    else return (
      <div className={classes.root}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          title={title}
          handleAdd={handleAdd}
          handleDelete={this.handleDelete} />
        <div className={classes.tableWrapper}>
          {!rows || rows.length < 1 ?
            <div align="center">
              <div style={{ height: 25 * emptyRows }} />
              <Typography variant="h5" component="h3">
                No {title}. Add some!
              </Typography>
              <div style={{ height: 25 * emptyRows }} />
            </div>
            :
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={rows.length}
                title={title}
                columns={columns} />
              <TableBody>
                {stableSort(rows, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((n, id) => {
                    const isSelected = this.isSelected(n);
                    return (
                      <TableRow
                        key={id}
                        hover
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        selected={isSelected}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            onClick={event => this.handleClick(event, n)}
                            checked={isSelected === undefined || isSelected === null ? false : isSelected} />
                        </TableCell>
                        {Object.keys(n).map((x, id) => {
                          const numberPos = n.status.indexOf('(') + 1,
                            statusNumber = Number.parseInt(n.status.substr(numberPos, (n.status.length - 1) - numberPos));
                          if (!columns[id]) return null;
                          else return (
                            <TableCell
                              key={id}
                              align={columns[id].align || 'left'}
                              padding={columns[id].disablePadding ? 'none' : 'default'}
                              className={classes.cell}
                              style={{
                                background: columns[id].id !== 'status' ? 'initial' :
                                  statusNumber > 0 ? red[500] :
                                    statusNumber === 0 && green[500],
                                whiteSpace: columns[id].noWrap && 'nowrap'
                              }}>
                              {
                                columns[id].id === 'run' ?
                                  <Button
                                    color="primary"
                                    disabled={columns[id].enabled === false}
                                    onClick={() => handleRun(n)}>
                                    Run
                                  </Button>
                                  : columns[id].id === 'enabled' ?
                                    <Switch
                                      checked={n[x]}
                                      onChange={this.handleEnabledChange(n)}
                                      value="enabled" />
                                    : columns[id].date && n[x] ?
                                      moment(n[x]).format('DD/MM/YYYY HH:mm:ss')
                                      : n[x]}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={columns.length + 1} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          }
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 8, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage} />
      </div>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  handleRun: PropTypes.func.isRequired,
  title: PropTypes.string
};

export default withStyles(styles)(EnhancedTable);
