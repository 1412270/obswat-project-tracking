import React, { useState } from 'react';
import { Box, Tabs, Tab, Container, ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography } from '@mui/material';
import { AppProvider } from './context/AppContext';
import { Backlog } from './components/Backlog';
import { Board } from './components/Board';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0066CC', // OPSWAT blue
      light: '#3385D6',
      dark: '#004C99',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1A1A1A', // Dark gray/black
      light: '#4A4A4A',
      dark: '#000000',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F5F7FA', // Light gray background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#6B7280',
    },
    error: {
      main: '#DC2626', // Red for high priority
    },
    warning: {
      main: '#F59E0B', // Amber for medium priority
    },
    info: {
      main: '#3B82F6', // Blue for low priority
    },
    success: {
      main: '#10B981', // Green for completed/done
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#1A1A1A',
    },
    h5: {
      fontWeight: 600,
      color: '#1A1A1A',
    },
    h6: {
      fontWeight: 600,
      color: '#1A1A1A',
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderRadius: 8,
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '2px solid #E5E7EB',
        },
        indicator: {
          backgroundColor: '#0066CC',
          height: 3,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '1rem',
          color: '#6B7280',
          '&.Mui-selected': {
            color: '#0066CC',
            fontWeight: 600,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
  },
});

function AppContent() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E7EB',
          color: '#1A1A1A',
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 0,
              fontWeight: 700,
              color: '#0066CC',
              mr: 4,
              fontSize: '1.5rem',
            }}
          >
            OPSWAT
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#6B7280',
              fontWeight: 500,
            }}
          >
            Project Tracking
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ flex: 1, py: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Backlog" />
            <Tab label="Board" />
          </Tabs>
        </Box>
        <Box>
          {currentTab === 0 && <Backlog />}
          {currentTab === 1 && <Board />}
        </Box>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;

