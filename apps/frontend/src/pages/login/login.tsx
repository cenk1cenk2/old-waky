import { useMutation } from '@apollo/client'
import { faExclamationCircle, faKey, faSync, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactComponent as LogoImage } from '@frontend-assets/img/logo/logo.svg'
import { Box, Button, Grid, Typography } from '@material-ui/core'
import { Mutation, MutationLoginArgs } from '@waky/client-types'
import { TextField } from '@waky/frontend/components/input/text-field.component'
import { Pulldown } from '@waky/frontend/components/pulldown'
import { LocalStorage } from '@waky/frontend/interfaces'
import { ClientQuery, ClientQueryMap } from '@waky/frontend/utils'
import delay from 'delay'
import { Form, Formik } from 'formik'
import React, { Fragment, useCallback, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useTheme } from 'styled-components'

import { ShowMessageProps } from './login.interface'
import { loginValidationSchema } from './login.util'

export const LoginPage: React.FC = () => {
  const history = useHistory()
  const [ credentials ] = useState<MutationLoginArgs>({ username: '', password: '' })
  const location = useLocation<{ message: ShowMessageProps }>()
  const [ message, setMessage ] = useState<ShowMessageProps>(location?.state?.message)
  const [ submitted, setSubmitted ] = useState<boolean>(false)
  const [ login ] = useMutation<Mutation, MutationLoginArgs>(ClientQueryMap[ClientQuery.USER_LOGIN])

  const handleSubmit = useCallback(
    async ({ username, password }: MutationLoginArgs) => {
      setSubmitted(true)
      try {
        const { data } = await login({ variables: { username, password } })

        localStorage.setItem(LocalStorage.TOKEN, data.login.token)

        history.push('/')
      } catch (e) {
        setMessage({ type: 'error', message: e.message })

        setSubmitted(false)

        delay(3000).then(() => setMessage({}))
      }
    },
    [ ShowMessage ]
  )

  return (
    <Fragment>
      <Pulldown maxWidth="xs">
        <Box paddingLeft={4} paddingRight={4}>
          <Grid container direction="column" spacing={1} alignItems="stretch">
            <Grid container item direction="column" alignItems="center" spacing={2}>
              <Grid item xs={3}>
                <LogoImage width="100%" height="100%" />
              </Grid>
              <Grid item>
                <Typography variant="h3">waky</Typography>
              </Grid>
              <Grid item>
                {!message?.message ? (
                  <ShowMessage message="Please provide your credentials." />
                ) : (
                  <ShowMessage message={message.message} type={message.type} />
                )}
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
                        disabled={submitted}
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
                        disabled={submitted}
                      />
                    </Grid>
                    <Button fullWidth variant="contained" color="primary" type="submit" disabled={submitted}>
                      <Typography>{!submitted ? 'Login' : <FontAwesomeIcon icon={faSync} spin />}</Typography>
                    </Button>
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

const ShowMessage: React.FC<ShowMessageProps> = (props) => {
  const theme = useTheme()

  return (
    <Fragment>
      <Typography variant="body2" color={props.type ?? 'textSecondary'}>
        {props.type === 'error' && (
          <FontAwesomeIcon icon={faExclamationCircle} style={{ paddingRight: theme.spacing(1) }} />
        )}
        {props.message}
      </Typography>
    </Fragment>
  )
}
