import { ApolloProvider } from '@apollo/client'
import { AvailableDesigns, AvailablePalettes, generateTheme, GlobalStyles } from '@cenk1cenk2/react-template-base'
import { useProgress } from '@cenk1cenk2/react-template-components'
import LogoImage from '@frontend-assets/img/logo/logo.svg'
import { StylesProvider } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { client } from '@waky/frontend/utils'
import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

import { LoginPage } from './pages/login'

const App: React.FC = () => {
  const theme = generateTheme({ palette: AvailablePalettes.DARK, design: AvailableDesigns.DEFAULT })
  useProgress({ theme, logo: LogoImage })

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <GlobalStyles />
          <CssBaseline />
          <ApolloProvider client={client}>
            <Router>
              <Switch>
                <Route path="/login" component={LoginPage} />
                <Route component={LoginPage} />
              </Switch>
            </Router>
          </ApolloProvider>
        </StyledThemeProvider>
      </ThemeProvider>
    </StylesProvider>
  )
}

export default App
