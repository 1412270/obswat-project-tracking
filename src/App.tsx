import React, { useState } from 'react';
import { Box, Tabs, Tab, Container, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AppProvider } from './context/AppContext';
import { Backlog } from './components/Backlog';
import { Board } from './components/Board';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function AppContent() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="xl">
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

