import React from 'react'
import DashboardClient from './DashboardClient'

const DashboardPage: React.FC = (): JSX.Element => {
  return <DashboardClient />
}



export default React.memo(DashboardPage)
DashboardPage.displayName = 'DashboardPage'
