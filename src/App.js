import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import pink from '@material-ui/core/colors/pink';
import red from '@material-ui/core/colors/red';
import Root from './Components/Root';
import 'typeface-roboto';
import '@mdi/font/css/materialdesignicons.min.css';
import './App.css';

const theme = createMuiTheme({
  type: 'dark',
  primary: pink,
  secondary: pink,
  backgrounds: {
    main: '#383c45',
    default: '#383c45',
    card: {
      on: pink[600],
      off: '#434954',
      disabled: '#7f848e',
    }
  },
  text: {
    light: grey[50],
    main: grey[100]
  },
  error: red
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
