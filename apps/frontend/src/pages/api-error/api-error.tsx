import { Grid, Typography } from '@material-ui/core'
import { Pulldown } from '@waky/frontend/components/pulldown'
import React, { Fragment } from 'react'

export const ApiErrorPage: React.FC = () => {
  return (
    <Fragment>
      <Pulldown maxWidth="md">
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
