import { useMutation } from '@apollo/client'
import { Pulldown } from '@cenk1cenk2/react-template-components'
import { faExclamationCircle, faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'
import { ReactComponent as LogoImage } from '@frontend-assets/img/logo/logo.svg'
import { Box, Button, Grid, Typography } from '@material-ui/core'
import { Mutation, MutationLoginArgs } from '@waky/client-types'
import { TextField } from '@waky/frontend/components/input/text-field.component'
import { ClientQuery, ClientQueryMap } from '@waky/frontend/utils'
import delay from 'delay'
import { Form, Formik } from 'formik'
import React, { Fragment, ReactElement, useState } from 'react'
import { useTheme } from 'styled-components'

import { loginValidationSchema } from './login.util'

export const LoginPage: React.FC = () => {
  const [ credentials ] = useState<MutationLoginArgs>({ username: '', password: '' })
  const defaultMessage = 'Please provide your credentials.'
  const [ message, setMessage ] = useState<ReactElement>(ShowMessage({ message: defaultMessage }))
  const [ submitted, setSubmitted ] = useState<boolean>(false)
  const [ login ] = useMutation<Mutation['login'], MutationLoginArgs>(ClientQueryMap[ClientQuery.USER_LOGIN])

  const handleSubmit = async ({ username, password }: MutationLoginArgs) => {
    setSubmitted(true)
    try {
      const { data, errors, context, extensions } = await login({ variables: { username, password } })
      console.log(data, errors, context, extensions)
    } catch (e) {
      setMessage(ShowMessage({ message: e.message, color: 'error' }))
      setSubmitted(false)
      delay(3000).then(() => setMessage(ShowMessage({ message: defaultMessage })))
    }
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
            <Grid container item direction="column" alignItems="center" spacing={2}>
              <Grid item xs={3}>
                <LogoImage width="100%" height="100%" />
              </Grid>
              <Grid item>
                <Typography variant="h3">waky</Typography>
              </Grid>
              <Grid item>{message}</Grid>
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

const ShowMessage: React.FC<{ color?: 'error', message: string }> = (props) => {
  const theme = useTheme()
  return (
    <Fragment>
      <Typography variant="body2" color={props.color ?? 'textSecondary'}>
        {props.color === 'error' && (
          <FontAwesomeIcon icon={faExclamationCircle} style={{ paddingRight: theme.spacing(1) }} />
        )}
        {props.message}
      </Typography>
    </Fragment>
  )
}
