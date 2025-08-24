'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { motion } from 'framer-motion'
import { useState } from 'react'

export interface TabItem {
  value: string
  icon: React.ReactNode
  labelKey: string
  shortLabelKey: string
  badgeCount?: number
  content: React.ReactNode
}

interface AnimatedTabsProps {
  tabs: TabItem[]
  defaultValue?: string
  className?: string
  tabsListClassName?: string
  contentClassName?: string
}

export const AnimatedTabs: React.FC<AnimatedTabsProps> = ({
  tabs,
  defaultValue,
  className = '',
  tabsListClassName = '',
  contentClassName = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value || '')

  // Tính toán vị trí indicator dựa trên số lượng tab
  const getIndicatorPosition = (activeValue: string) => {
    const activeIndex = tabs.findIndex((tab) => tab.value === activeValue)
    if (activeIndex === -1) return '0%'

    // Debug: log để kiểm tra
    console.log('Active tab:', activeValue, 'Index:', activeIndex, 'Total tabs:', tabs.length)

    // Hardcode cho 4 tabs để test
    if (tabs.length === 4) {
      const positions = ['0%', '25%', '50%', '75%']
      const position = positions[activeIndex]
      console.log('Hardcoded position:', position)
      return position
    }

    // Tính toán chính xác vị trí dựa trên index và số lượng tab
    const tabWidth = 100 / tabs.length
    const position = activeIndex * tabWidth
    console.log('Calculated position:', position + '%')

    return `${position}%`
  }

  const getIndicatorWidth = () => {
    return `${100 / tabs.length}%`
  }

  return (
    <div className={className}>
      <Tabs
        defaultValue={defaultValue || tabs[0]?.value}
        className="w-full"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList
          className={`grid w-full h-auto p-1 bg-muted/30 border border-border/50 rounded-xl backdrop-blur-sm relative ${tabsListClassName}`}
          style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
        >
          <motion.div
            className="absolute inset-y-1 bg-background/80 rounded-lg shadow-sm border border-border/20 -z-10"
            initial={false}
            animate={{
              left: getIndicatorPosition(activeTab),
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 40,
            }}
            style={{
              width: getIndicatorWidth(),
            }}
          />

          <div className="relative z-10 contents">
            {tabs.map((tab) => (
              <AnimatedTabTrigger
                key={tab.value}
                value={tab.value}
                icon={tab.icon}
                labelKey={tab.labelKey}
                shortLabelKey={tab.shortLabelKey}
                badgeCount={tab.badgeCount}
              />
            ))}
          </div>
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className={`mt-6 ${contentClassName}`}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

interface AnimatedTabTriggerProps {
  value: string
  icon: React.ReactNode
  labelKey: string
  shortLabelKey: string
  badgeCount?: number
  className?: string
}

const AnimatedTabTrigger: React.FC<AnimatedTabTriggerProps> = ({
  value,
  icon,
  labelKey,
  shortLabelKey,
  badgeCount,
  className = '',
}) => {
  const t = useTranslations()

  return (
    <TabsTrigger
      value={value}
      className={`flex flex-col items-center gap-2 px-4 py-3 text-xs font-medium rounded-lg bg-none! data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-none data-[state=active]:border-border/50 transition-all duration-200 hover:bg-none! cursor-pointer ${className}`}
      style={{
        backgroundColor: 'transparent',
      }}
    >
      <div className="relative">
        {icon}
        {badgeCount && badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-[10px] text-primary-foreground flex items-center justify-center font-bold">
            {badgeCount > 99 ? '99+' : badgeCount}
          </span>
        )}
      </div>
      <span className="hidden sm:inline">{t(labelKey)}</span>
      <span className="sm:hidden">{t(shortLabelKey)}</span>
    </TabsTrigger>
  )
}
