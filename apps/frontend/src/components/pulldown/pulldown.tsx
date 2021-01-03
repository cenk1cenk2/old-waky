import { Pulldown as BasePulldown, MaxWidths } from '@cenk1cenk2/react-template-components'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactComponent as LogoImage } from '@frontend-assets/img/logo/logo.svg'
import { Button, Grid, Link, Typography } from '@material-ui/core'
import { Routes } from '@waky/frontend/interfaces'
import React, { Fragment } from 'react'

interface Props {
  maxWidth?: MaxWidths
}

export const Pulldown: React.FC<Props> = (props) => {
  return (
    <Fragment>
      <BasePulldown
        package={{ name: CONFIG.package.name, version: CONFIG.package.version }}
        logo={LogoImage}
        maxWidth={props.maxWidth ?? 'md'}
        offset={{ x: 0, y: 0 }}
      >
        {props.children}
      </BasePulldown>
    </Fragment>
  )
}
