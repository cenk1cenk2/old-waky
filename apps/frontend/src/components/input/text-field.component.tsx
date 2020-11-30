import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TextField as BaseTextField, TextFieldProps as BaseTextFieldProps, Grid } from '@material-ui/core'
import { FieldAttributes, useField } from 'formik'
import React, { FunctionComponent } from 'react'

export type TextFieldProps = BaseTextFieldProps &
FieldAttributes<unknown> & {
  icon?: IconProp
}

export const TextField: FunctionComponent<TextFieldProps> = ({ icon, ...props }) => {
  const [ field, meta ] = useField(props)
  const error = meta.error && meta.touched ? meta.error : ' '

  return (
    <Grid container direction="row" alignItems="center">
      {icon && (
        <Grid item xs={1}>
          <FontAwesomeIcon icon={icon} />
        </Grid>
      )}
      <Grid item xs>
        <BaseTextField error={!!meta.error && !!meta.touched} helperText={error} {...field} {...props} />
      </Grid>
    </Grid>
  )
}
