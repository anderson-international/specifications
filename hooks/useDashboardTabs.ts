import { useCallback, useMemo, useState } from 'react'
import { TabId } from '../components/dashboard/DashboardTabNavigation'

type OverviewSubTabId = 'system' | 'coverage' | 'insights'
type NextSpecSubTabId = 'priority' | 'attention'

export interface UseDashboardTabsReturn {
  activeTab: TabId
  activeOverviewSubTab: OverviewSubTabId
  activeNextSpecSubTab: NextSpecSubTabId
  tabs: Array<{ id: TabId; label: string }>
  overviewSubTabs: Array<{ id: OverviewSubTabId; label: string }>
  nextSpecSubTabs: Array<{ id: string; label: string }>
  handleTabClick: (tabId: TabId) => void
  handleOverviewSubTabClick: (subTabId: string) => void
  handleNextSpecSubTabClick: (subTabId: string) => void
}

export const useDashboardTabs = (): UseDashboardTabsReturn => {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [activeOverviewSubTab, setActiveOverviewSubTab] = useState<OverviewSubTabId>('system')
  const [activeNextSpecSubTab, setActiveNextSpecSubTab] = useState<NextSpecSubTabId>('priority')

  const handleTabClick = useCallback((tabId: TabId) => {
    setActiveTab(tabId)
  }, [])

  const handleOverviewSubTabClick = useCallback((subTabId: string) => {
    setActiveOverviewSubTab(subTabId as OverviewSubTabId)
  }, [])

  const handleNextSpecSubTabClick = useCallback((subTabId: string) => {
    setActiveNextSpecSubTab(subTabId as NextSpecSubTabId)
  }, [])

  const tabs = useMemo(
    () => [
      { id: 'overview' as TabId, label: 'Overview' },
      { id: 'activity' as TabId, label: 'Me' },
      { id: 'leaderboard' as TabId, label: 'Ranking' },
      { id: 'actions' as TabId, label: 'Next Spec' },
    ],
    []
  )

  const overviewSubTabs = useMemo(
    () => [
      { id: 'system' as OverviewSubTabId, label: 'System' },
      { id: 'coverage' as OverviewSubTabId, label: 'Coverage' },
      { id: 'insights' as OverviewSubTabId, label: 'Insights' },
    ],
    []
  )

  const nextSpecSubTabs = useMemo(
    () => [
      { id: 'priority', label: 'Priority Products' },
      { id: 'attention', label: 'Needs Attention' },
    ],
    []
  )

  return {
    activeTab,
    activeOverviewSubTab,
    activeNextSpecSubTab,
    tabs,
    overviewSubTabs,
    nextSpecSubTabs,
    handleTabClick,
    handleOverviewSubTabClick,
    handleNextSpecSubTabClick,
  }
}
