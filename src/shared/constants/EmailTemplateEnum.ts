export enum EmailTemplateEnum {
  CreateCampaignSuccess = 'campaigns/create-campaign-success.html',
}

export const EMAIL_SUBJECTS: Record<EmailTemplateEnum, string> = {
  [EmailTemplateEnum.CreateCampaignSuccess]: 'Campaign Created Successfully',
}
