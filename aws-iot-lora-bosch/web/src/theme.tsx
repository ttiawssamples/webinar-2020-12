import red from '@material-ui/core/colors/red';
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: '#232F3E',
    },
    secondary: {
      main: '#f57c00',
    },
    error: {
      main: red.A400,
    }
  },
});

export default theme;
