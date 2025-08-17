import { Container } from 'inversify'
import { TYPES } from './types'

// Repositories
import { campaignRepository } from '../repository/implement/CampaignRepository'
import { userRepository } from '../repository/implement/UserRepository'
import { ICampaignRepository } from '../repository/interface/CampaignRepository.interface'
import { IUserRepository } from '../repository/interface/UserRepository.interface'

// Services
import { campaignService } from '../service/implement/CampaignService'
import { emailService } from '../service/implement/EmailService'
import { userService } from '../service/implement/UserService'
import { ICampaignService } from '../service/interface/CampaignService.interface'
import { IEmailService } from '../service/interface/EmailService.interface'
import { IUserService } from '../service/interface/UserService.interface'

// Mappers
import { campaignMapper } from '../mapper/CampaignMapper'
import { userMapper } from '../mapper/UserMapper'

// Create container
const container = new Container()

// Repository bindings (instances)
container.bind<IUserRepository>(TYPES.UserRepository).toConstantValue(userRepository)
container.bind<ICampaignRepository>(TYPES.CampaignRepository).toConstantValue(campaignRepository)

// Service bindings (instances)
container.bind<IUserService>(TYPES.UserService).toConstantValue(userService)
container.bind<ICampaignService>(TYPES.CampaignService).toConstantValue(campaignService)
container.bind<IEmailService>(TYPES.EmailService).toConstantValue(emailService)

// Mapper bindings (instances)
container.bind(TYPES.UserMapper).toConstantValue(userMapper)
container.bind(TYPES.CampaignMapper).toConstantValue(campaignMapper)

export { container, TYPES }
