import React, { Suspense } from 'react'
import { getSpecificationEnumData } from '@/lib/data/enums'
import { SpecificationEnumData } from '@/types/enum'
import CreateSpecificationClient from './CreateSpecificationClient'
import styles from './page.module.css'

/**
 * Server component that fetches enum data and renders the client component
 */
async function CreateSpecificationPage(): Promise<JSX.Element> {
  // Fetch enum data on the server
  const enumData: SpecificationEnumData = await getSpecificationEnumData()

  return (
    <div className={styles.container}>
      <Suspense fallback={<div>Loading...</div>}>
        <CreateSpecificationClient enumData={enumData} />
      </Suspense>
    </div>
  )
}

export default CreateSpecificationPage
