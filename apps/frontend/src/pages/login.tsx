import { Pulldown } from '@cenk1cenk2/react-template-components'
import { ReactComponent as LogoImage } from '@frontend-assets/img/logo/logo.svg'
import { Grid, TextField, Box, Button, Typography } from '@material-ui/core'
import React, { Fragment } from 'react'

export const Login: React.FC = () => {
  return (
    <Fragment>
      {/* <BackgroundImageContainer $url={BackgroundImage}> */}
      <Pulldown
        package={{ name: CONFIG.package.name, version: CONFIG.package.version }}
        logo={LogoImage}
        maxWidth="xs"
        offset={{ x: 0, y: 0 }}
      >
        <Box paddingLeft={4} paddingRight={4}>
          <Grid container direction="column" spacing={2}>
            <Grid item container direction="column" alignItems="center" spacing={1}>
              <Grid item xs={3}>
                <LogoImage width="100%" height="auto" />
              </Grid>
              <Grid item>
                <Typography variant="h3">waky</Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="body1" color="textSecondary">
                Please login using your credentials.
              </Typography>
            </Grid>
            <Grid item style={{ paddingTop: 0 }}>
              <TextField fullWidth required id="username" label="Username" helperText="Incorrect entry." />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                required
                id="password"
                label="Password"
                type="password"
                helperText="Incorrect entry."
              />
            </Grid>
            <Grid item container alignItems="flex-end" direction="column">
              <Button variant="contained" color="primary">
                Login
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Pulldown>
      {/* </BackgroundImageContainer> */}
    </Fragment>
  )
}

export default Login
