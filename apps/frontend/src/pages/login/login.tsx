import { useMutation } from '@apollo/client'
import { Pulldown } from '@cenk1cenk2/react-template-components'
import { faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import { ReactComponent as LogoImage } from '@frontend-assets/img/logo/logo.svg'
import { Box, Button, Grid, Typography } from '@material-ui/core'
import { Mutation, MutationLoginArgs } from '@waky/client-types'
import { TextField } from '@waky/frontend/components/input/text-field.component'
import { ClientQuery, ClientQueryMap } from '@waky/frontend/utils'
import { Form, Formik } from 'formik'
import React, { Fragment, useState } from 'react'
import { useTheme } from 'styled-components'

import { loginValidationSchema } from './login.util'

export const LoginPage: React.FC = () => {
  const theme = useTheme()
  const [ credentials, setCredentials ] = useState<MutationLoginArgs>({ username: '', password: '' })
  const [ message, setMessage ] = useState<React.FC>(DefaultMessage)
  const [ submitted, setSubmitted ] = useState<boolean>(false)
  const [ login ] = useMutation<Mutation['login'], MutationLoginArgs>(ClientQueryMap[ClientQuery.USER_LOGIN])

  const handleSubmit = async ({ username, password }: MutationLoginArgs) => {
    // setSubmitted(true)
    const { data, errors, context, extensions } = await login({ variables: { username, password } })

    console.log(data, errors, context, extensions)
  }

  return (
    <Fragment>
      <Pulldown
        package={{ name: CONFIG.package.name, version: CONFIG.package.version }}
        logo={LogoImage}
        maxWidth="xs"
        offset={{ x: 0, y: 0 }}
      >
        <Box paddingLeft={4} paddingRight={4}>
          <Grid container direction="column" spacing={1} alignItems="stretch">
            <Grid container item direction="column" alignItems="center" spacing={1}>
              <Grid item xs={3}>
                <LogoImage width="100%" height="100%" />
              </Grid>
              <Grid item>
                <Typography variant="h3">waky</Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" color="textSecondary">
                  {message}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Formik
                onSubmit={async (values) => {
                  await handleSubmit(values)
                }}
                validationSchema={loginValidationSchema}
                initialValues={credentials}
              >
                <Form>
                  <Grid container direction="column" alignItems="stretch" spacing={2}>
                    <Grid item>
                      <TextField
                        name="username"
                        fullWidth
                        required
                        autoFocus
                        id="username"
                        label="Username"
                        icon={faUser}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        name="password"
                        fullWidth
                        required
                        id="password"
                        label="Password"
                        type="password"
                        icon={faKey}
                      />
                    </Grid>
                    <Grid item>
                      <Button fullWidth variant="contained" color="primary" type="submit" disabled={submitted}>
                        Login
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              </Formik>
            </Grid>
          </Grid>
        </Box>
      </Pulldown>
    </Fragment>
  )
}

const DefaultMessage: React.FC = () => {
  return <Fragment>Please provide your credentials.</Fragment>
}
