import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C59A77',
      light: '#E2B89D',
      dark: '#A97C5B',
      contrastText: '#000000',
    },
    secondary: {
      main: '#D4AF37',
      light: '#E5C158',
      dark: '#B38761',
      contrastText: '#000000',
    },
    background: {
      default: '#0B0B0D',
      paper: '#16161A',
    },
    text: {
      primary: '#F3F4F6',
      secondary: '#9CA3AF',
    },
    divider: 'rgba(197, 154, 119, 0.2)',
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
    h1: { fontFamily: '"Cormorant Garamond", Georgia, serif' },
    h2: { fontFamily: '"Cormorant Garamond", Georgia, serif' },
    h3: { fontFamily: '"Cormorant Garamond", Georgia, serif' },
    h4: { fontFamily: '"Cormorant Garamond", Georgia, serif' },
    h5: { fontFamily: '"Cormorant Garamond", Georgia, serif' },
    h6: { fontFamily: '"Cormorant Garamond", Georgia, serif' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.02em',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #D4AF37 0%, #C59A77 100%)',
          color: '#0A0A0C',
          '&:hover': {
            background: 'linear-gradient(135deg, #E5C158 0%, #D4AF37 100%)',
            boxShadow: '0 0 20px rgba(197, 154, 119, 0.4)',
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          color: '#282832',
          '&.Mui-completed': {
            color: '#C59A77',
          },
          '&.Mui-active': {
            color: '#D4AF37',
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          color: '#9CA3AF',
          '&.Mui-active': {
            color: '#F3F4F6',
            fontWeight: 600,
          },
          '&.Mui-completed': {
            color: '#C59A77',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            '& fieldset': {
              borderColor: 'rgba(197, 154, 119, 0.25)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(197, 154, 119, 0.6)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#C59A77',
            },
          },
        },
      },
    },
  },
});
