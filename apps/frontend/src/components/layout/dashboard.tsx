import { DashboardTemplate, DashboardTemplateNavTypes } from '@cenk1cenk2/react-template-dashboard'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactComponent as LogoImage } from '@frontend-assets/img/logo/logo.svg'
import React, { Fragment } from 'react'
import { RecoilRoot } from 'recoil'

export const Dashboard: React.FC = (props) => {
  const pkg = { name: CONFIG.package.name, version: CONFIG.package.version }

  return (
    <Fragment>
      <RecoilRoot>
        <DashboardTemplate
          package={pkg}
          header={{ logo: LogoImage, transperent: false }}
          navigation={{
            type: DashboardTemplateNavTypes.HEADER,
            drawer: {
              collapsable: false
            },
            items: [
              {
                icon: <FontAwesomeIcon icon={faBars} />,
                name: 'TEST',
                url: '/dashboard'
              }
            ]
          }}
        >
          {props.children}
        </DashboardTemplate>
      </RecoilRoot>
    </Fragment>
  )
}

export default Dashboard
