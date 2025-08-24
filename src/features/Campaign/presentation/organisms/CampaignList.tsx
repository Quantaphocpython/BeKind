'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { CampaignDto } from '@/features/Campaign/data/dto'
import { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import { CampaignListPaginatedResponseDto } from '@/server/dto/campaign.dto'
import { RouteEnum } from '@/shared/constants/RouteEnum'
import { useApiQuery } from '@/shared/hooks'
import { ScrollType, useAppScroll } from '@/shared/hooks/useAppScroll'
import { useTranslations } from '@/shared/hooks/useTranslations'
import { routeConfig } from '@/shared/utils/route'
import { ChevronLeft, ChevronRight, Filter, Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { CampaignCard } from '../molecules/CampaignCard'
import { CampaignCardSkeleton } from '../molecules/CampaignCardSkeleton'

export const CampaignList = () => {
  const t = useTranslations()
  const router = useRouter()
  const { scroll } = useAppScroll()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1) // Reset to first page when searching
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset page when status filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter])

  const {
    data: campaignsResponse,
    isLoading,
    error,
  } = useApiQuery<CampaignListPaginatedResponseDto>(
    ['campaigns', 'paginated', currentPage.toString(), debouncedSearchTerm, statusFilter],
    () => {
      const campaignService = container.get(TYPES.CampaignService) as CampaignService
      return campaignService.getCampaignsPaginated({
        page: currentPage,
        limit: 12,
        search: debouncedSearchTerm,
        status: statusFilter as 'all' | 'active' | 'closed',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })
    },
  )

  useEffect(() => {
    if (error) {
      const message = error instanceof Error ? error.message : String(error)
      toast.error(t('Error loading campaigns'), { description: message })
    }
  }, [error, t])

  const campaigns = campaignsResponse?.data?.items || []
  const pagination = campaignsResponse?.data?.pagination

  const handleCreateCampaign = () => {
    const url = routeConfig(RouteEnum.CreateCampaign)
    router.push(url)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    scroll({ type: ScrollType.ToTop })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('Campaigns')}</h1>
          <p className="text-muted-foreground">{t('Discover and support charitable campaigns on the blockchain')}</p>
        </div>
        <Button onClick={handleCreateCampaign} className="flex items-center gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          {t('Create Campaign')}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('Search campaigns...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t('Filter by status')} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">{t('All Campaigns')}</SelectItem>
            <SelectItem value="active">{t('Active')}</SelectItem>
            <SelectItem value="closed">{t('Closed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaign Count */}
      <div className="text-sm text-muted-foreground">
        {isLoading ? (
          <Skeleton className="h-4 w-40" />
        ) : (
          `${pagination?.total || 0} ${pagination?.total !== 1 ? t('campaigns found') : t('campaign found')}`
        )}
      </div>

      {/* Campaign Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <CampaignCardSkeleton key={index} />
          ))}
        </div>
      ) : campaigns.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign: CampaignDto) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrev}
              >
                <ChevronLeft className="h-4 w-4" />
                {t('Previous')}
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNext}
              >
                {t('Next')}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('No campaigns found')}</h3>
          <p className="text-muted-foreground mb-4">
            {debouncedSearchTerm || statusFilter !== 'all'
              ? t('Try adjusting your search or filters')
              : t('Be the first to create a campaign!')}
          </p>
          {!debouncedSearchTerm && statusFilter !== 'all' && (
            <Button onClick={handleCreateCampaign}>{t('Create Your First Campaign')}</Button>
          )}
        </div>
      )}
    </div>
  )
}
