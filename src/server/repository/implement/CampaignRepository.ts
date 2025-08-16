import { ICampaignRepository } from '../interface'

class CampaignRepository implements ICampaignRepository {}

export const campaignRepository = new CampaignRepository()
