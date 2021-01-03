import { faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Grid, Link, Typography } from '@material-ui/core'
import { Pulldown } from '@waky/frontend/components/pulldown'
import { Routes } from '@waky/frontend/interfaces'
import React, { Fragment } from 'react'

const NotFoundPage: React.FC = () => {
  return (
    <Fragment>
      <Pulldown maxWidth="md">
        <Grid container direction="column" alignItems="center" alignContent="center" spacing={4}>
          <Grid item>
            <Typography variant="h1" color="error">
              404
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h3">Page not found.</Typography>
          </Grid>
          <Grid item>
            <Link href={Routes.MAIN_PAGE}>
              <Button variant="outlined" color="primary">
                <FontAwesomeIcon icon={faHome} size="3x" />
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Pulldown>
    </Fragment>
  )
}

export default NotFoundPage
