import { Container } from 'inversify'
import 'reflect-metadata'
import { TYPES } from './types'

// Repositories
import { CampaignRepository } from '../repository/implement/CampaignRepository'
import { CommentRepository } from '../repository/implement/CommentRepository'
import { MilestoneRepository } from '../repository/implement/MilestoneRepository'
import { UserRepository } from '../repository/implement/UserRepository'
import type { ICampaignRepository } from '../repository/interface/CampaignRepository.interface'
import type { ICommentRepository } from '../repository/interface/CommentRepository.interface'
import type { IMilestoneRepository } from '../repository/interface/MilestoneRepository.interface'
import type { IUserRepository } from '../repository/interface/UserRepository.interface'

// Services
import { CampaignService } from '../service/implement/CampaignService'
import { EmailService } from '../service/implement/EmailService'
import { UserService } from '../service/implement/UserService'
import type { ICampaignService } from '../service/interface/CampaignService.interface'
import type { IEmailService } from '../service/interface/EmailService.interface'
import type { IUserService } from '../service/interface/UserService.interface'

// Mappers
import { campaignMapper } from '../mapper/CampaignMapper'
import { userMapper } from '../mapper/UserMapper'

// Create container
const container = new Container()

// Repository bindings (classes)
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope()
container.bind<ICampaignRepository>(TYPES.CampaignRepository).to(CampaignRepository).inSingletonScope()
container.bind<IMilestoneRepository>(TYPES.MilestoneRepository).to(MilestoneRepository).inSingletonScope()
container.bind<ICommentRepository>(TYPES.CommentRepository).to(CommentRepository).inSingletonScope()

// Service bindings (classes)
container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope()
container.bind<ICampaignService>(TYPES.CampaignService).to(CampaignService).inSingletonScope()
container.bind<IEmailService>(TYPES.EmailService).to(EmailService).inSingletonScope()

// Mapper bindings (instances)
container.bind(TYPES.UserMapper).toConstantValue(userMapper)
container.bind(TYPES.CampaignMapper).toConstantValue(campaignMapper)

export { container, TYPES }
