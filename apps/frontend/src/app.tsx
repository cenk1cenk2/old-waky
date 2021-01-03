import { useQuery } from '@apollo/client'
import { AvailableDesigns, AvailablePalettes, generateTheme, GlobalStyles } from '@cenk1cenk2/react-template-base'
import { useProgress } from '@cenk1cenk2/react-template-page-loader'
import LogoImage from '@frontend-assets/img/logo/logo.svg'
import { StylesProvider } from '@material-ui/core'
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/styles'
import { Query, QueryCheckAuthenticationArgs } from '@waky/client-types'
import { LocalStorage, Routes } from '@waky/frontend/interfaces'
import { ClientQuery, ClientQueryMap } from '@waky/frontend/utils'
import React, { useEffect } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

import { ApiErrorPage } from './pages/api-error'
import { LoginPage } from './pages/login'

const App: React.FC = () => {
  const theme = generateTheme({ palette: AvailablePalettes.DARK, design: AvailableDesigns.DEFAULT })
  const progress = useProgress({
    theme,
    logo: LogoImage,
    manual: true
  })
  const history = useHistory()

  const { data: authData, error: apiError, loading } = useQuery<Query, QueryCheckAuthenticationArgs>(
    ClientQueryMap[ClientQuery.AUTHENTICATION_CHECK],
    {
      variables: {
        token: localStorage.getItem(LocalStorage.TOKEN) ?? ''
      },
      pollInterval: 1000
    }
  )

  useEffect(() => {
    if (apiError && history.location.pathname !== Routes.API_ERROR) {
      // handle api errors itself
      console.debug('API is not responding.')
      console.error(apiError)

      history.push(Routes.API_ERROR)

      progress.done(true)
    } else if (!apiError && history.location.pathname === Routes.API_ERROR) {
      // handle api connection restores
      console.debug('API connection restored.')

      if (history.length > 1) {
        history.goBack()
      } else {
        history.push(Routes.MAIN_PAGE)
      }
    } else if (
      !apiError &&
      authData?.checkAuthentication?.result === true &&
      history.location.pathname === Routes.LOGIN
    ) {
      // check if in login page, but already have a valid token
      console.debug('Authenticated but page is a public page, pushing new route to main page.')

      history.push(Routes.MAIN_PAGE)

      progress.done(true)
    } else if (
      !apiError &&
      authData?.checkAuthentication?.result === false &&
      history.location.pathname !== Routes.LOGIN
    ) {
      // check if user session is still valid anymore
      console.debug('User is not authenticated, redirecting to login page.')

      history.push(Routes.LOGIN, { message: { type: 'error', message: 'Session has expired.' } })

      progress.done(true)
    }

    // clear the old api token
    if (!apiError && authData?.checkAuthentication?.result === false && localStorage.getItem(LocalStorage.TOKEN)) {
      localStorage.removeItem(LocalStorage.TOKEN)
    }

    // disperse the page loader
    if (!loading) {
      progress.done(true)
    }
  }, [ authData, apiError ])

  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <StyledThemeProvider theme={theme}>
          <GlobalStyles />
          <CssBaseline />
          <Switch>
            <Route path={Routes.LOGIN} component={LoginPage} />
            <Route path={Routes.API_ERROR} component={ApiErrorPage} />
            <Redirect to="/404" />
          </Switch>
        </StyledThemeProvider>
      </ThemeProvider>
    </StylesProvider>
  )
}

export default App
