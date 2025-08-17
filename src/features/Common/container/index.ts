import { Container } from 'inversify'
import 'reflect-metadata'
import { TYPES } from './types'

// HTTP Client
import { httpClient, IHttpClient } from '@/configs/httpClient'

// Services
import { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { UserService } from '@/features/User/data/services/user.service'

// Create container
const container = new Container()

// HTTP Client binding
container.bind<IHttpClient>(TYPES.HttpClient).toConstantValue(httpClient)

// Service bindings (classes)
container.bind(TYPES.UserService).to(UserService).inSingletonScope()
container.bind(TYPES.CampaignService).to(CampaignService).inSingletonScope()

export { container, TYPES }
