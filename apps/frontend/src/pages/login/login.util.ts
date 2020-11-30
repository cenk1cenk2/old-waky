import * as yup from 'yup'

import { LoginErrorMessages } from './login.constants'
import { LoginForm } from './login.interface'

export const loginValidationSchema = (): yup.ObjectSchema<LoginForm> => {
  return yup.object().shape({
    username: yup.string().required(LoginErrorMessages.FIELD_REQUIRED).trim(LoginErrorMessages.WHITESPACE).strict(true),
    password: yup.string().required(LoginErrorMessages.FIELD_REQUIRED).trim(LoginErrorMessages.WHITESPACE).strict(true)
  })
}
