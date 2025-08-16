import { ICampaignService } from '../interface/CampaignService.interface'

class CampaignService implements ICampaignService {}

export const campaignService = new CampaignService()
