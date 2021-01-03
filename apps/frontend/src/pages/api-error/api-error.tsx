import { Pulldown } from '@cenk1cenk2/react-template-components'
import { ReactComponent as LogoImage } from '@frontend-assets/img/logo/logo.svg'
import { Button, Grid, Typography, useTheme } from '@material-ui/core'
import React, { Fragment } from 'react'

export const ApiErrorPage: React.FC = () => {
  return (
    <Fragment>
      <Pulldown
        package={{ name: CONFIG.package.name, version: CONFIG.package.version }}
        logo={LogoImage}
        maxWidth="md"
        offset={{ x: 0, y: 0 }}
      >
        <Grid container item alignItems="center" direction="column" spacing={0}>
          <Typography variant="h1" color="error">
            Can not reach the API.
          </Typography>
        </Grid>
      </Pulldown>
    </Fragment>
  )
}

export default ApiErrorPage
