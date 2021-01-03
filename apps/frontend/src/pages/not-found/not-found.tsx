import { Pulldown } from '@cenk1cenk2/react-template-components'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactComponent as LogoImage } from '@frontend-assets/img/logo/logo.svg'
import { Button, Grid, Link, Typography } from '@material-ui/core'
import { Routes } from '@waky/frontend/interfaces'
import React, { Fragment } from 'react'

const NotFoundPage: React.FC = () => {
  return (
    <Fragment>
      <Pulldown
        package={{ name: CONFIG.package.name, version: CONFIG.package.version }}
        logo={LogoImage}
        maxWidth="md"
        offset={{ x: 0, y: 0 }}
      >
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
