'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CampaignListResponseDto } from '@/features/Campaign/data/dto'
import { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import { RouteEnum } from '@/shared/constants/RouteEnum'
import { useApiQuery } from '@/shared/hooks'
import { routeConfig } from '@/shared/utils/route'
import { Filter, Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CampaignCard } from '../molecules/CampaignCard'

export const CampaignList = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const {
    data: campaignsResponse,
    isLoading,
    error,
  } = useApiQuery<CampaignListResponseDto>(
    ['campaigns', 'all'],
    () => {
      const campaignService = container.get(TYPES.CampaignService) as CampaignService
      return campaignService.getCampaigns()
    },
    {
      select: (data) => data.data,
    },
  )

  const filteredCampaigns =
    campaignsResponse?.campaigns?.filter((campaign) => {
      const matchesSearch =
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.campaignId.toString().includes(searchTerm)

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && campaign.isExist) ||
        (statusFilter === 'closed' && !campaign.isExist)

      return matchesSearch && matchesStatus
    }) || []

  const handleCreateCampaign = () => {
    const url = routeConfig(RouteEnum.CreateCampaign)
    router.push(url)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading campaigns: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Discover and support charitable campaigns on the blockchain</p>
        </div>
        <Button onClick={handleCreateCampaign} className="flex items-center gap-2 cursor-pointer">
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaign Count */}
      <div className="text-sm text-muted-foreground">
        {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} found
      </div>

      {/* Campaign Grid */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Be the first to create a campaign!'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Button onClick={handleCreateCampaign}>Create Your First Campaign</Button>
          )}
        </div>
      )}
    </div>
  )
}
