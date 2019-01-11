import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
import Root from './Components/Root';
import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';
import './App.css';

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: pink,
    secondary: red,
    error: red
  }
});

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <Route render={props => (
            <Root
              theme={theme}
              {...props} />
          )} />
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
