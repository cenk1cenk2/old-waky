import { MutationLoginArgs } from '@waky/client-types'
import * as yup from 'yup'

import { LoginErrorMessages } from './login.constants'

export const loginValidationSchema = (): yup.BaseSchema<MutationLoginArgs> => {
  return yup.object({
    username: yup.string().required(LoginErrorMessages.FIELD_REQUIRED).trim(LoginErrorMessages.WHITESPACE).strict(true),
    password: yup.string().required(LoginErrorMessages.FIELD_REQUIRED).trim(LoginErrorMessages.WHITESPACE).strict(true)
  })
}
