'use client'

import { ImageDropzone } from '@/components/common'
import Editor from '@/components/common/organisms/Editor'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { firebaseStorage } from '@/configs/firebase'
import { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import { useApiMutation, useTranslations } from '@/shared/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { Target } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import { CAMPAIGN_CONSTANTS, FORM_CONFIG, FORM_STATE } from '../../data/constants'
import { CreateCampaignRequestDto, CreateCampaignResponseDto } from '../../data/dto'
import { useCampaignContractWrite } from '../../data/hooks'
import { CreateCampaignFormData, createEnhancedCampaignSchema } from '../../data/schema'
import { createFormHandlersUtils, createFormUIUtils } from '../../data/utils'

export const CreateCampaignForm = () => {
  const { address, isConnected } = useAccount()
  const t = useTranslations()
  const [formState, setFormState] = useState<FORM_STATE>(FORM_STATE.IDLE)
  const [formData, setFormData] = useState<CreateCampaignFormData | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  // Initialize utils
  const formHandlersUtils = useMemo(() => createFormHandlersUtils(t), [t])
  const formUIUtils = useMemo(() => createFormUIUtils(), [])

  // Enhanced schema with better validation
  const enhancedCreateCampaignSchema = createEnhancedCampaignSchema(t)

  const form = useForm<CreateCampaignFormData>({
    resolver: zodResolver(enhancedCreateCampaignSchema),
    defaultValues: {
      title: '',
      goal: '',
      description: '',
      coverImage: '',
    },
    mode: 'onChange',
  })

  const { mutateAsync: createCampaignAPI, isPending: isAPIPending } = useApiMutation<
    CreateCampaignResponseDto,
    CreateCampaignRequestDto
  >(
    (data) => {
      const campaignService = container.get(TYPES.CampaignService) as CampaignService
      return campaignService.createCampaign(data)
    },
    {
      invalidateQueries: [['campaigns']],
    },
  )

  const {
    execute: createCampaignContract,
    isLoading: isContractLoading,
    isSuccess: isContractTransactionSuccess,
  } = useCampaignContractWrite('createCampaign')

  const description = useWatch({ control: form.control, name: 'description' })

  // Clear errors when wallet connects
  useEffect(() => {
    if (isConnected) {
      form.clearErrors()
    }
  }, [isConnected, form])

  // Handle contract success and create campaign in database
  const handleContractSuccess = useCallback(async () => {
    if (!formData || !address) return

    try {
      setFormState(FORM_STATE.API_PENDING)

      const requestData = formHandlersUtils.createRequestData(formData, address)
      await createCampaignAPI(requestData)

      setFormState(FORM_STATE.SUCCESS)
      setFormData(null)
      form.reset()

      toast.success(t('Success'), {
        description: t('Campaign created successfully!'),
        icon: <Icons.checkCircle className="h-4 w-4" />,
        duration: 5000,
      })

      // Reset form state after success
      setTimeout(() => {
        setFormState(FORM_STATE.IDLE)
      }, FORM_CONFIG.SUCCESS_MESSAGE_DURATION)
    } catch (error) {
      console.error('Error creating campaign in database:', error)
      setFormState(FORM_STATE.ERROR)
      toast.error(t('Database Error'), {
        description: error instanceof Error ? error.message : t('An unexpected error occurred'),
        icon: <Icons.alertCircle className="h-4 w-4" />,
      })
    }
  }, [formData, address, createCampaignAPI, form, formHandlersUtils, t])

  useEffect(() => {
    if (isContractTransactionSuccess && formData && address && formState === FORM_STATE.CONTRACT_PENDING) {
      setFormState(FORM_STATE.CONTRACT_SUCCESS)
      handleContractSuccess()
    }
    // Intentionally only depend on isContractTransactionSuccess to avoid re-run loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isContractTransactionSuccess])

  const onSubmit = async (data: CreateCampaignFormData) => {
    if (!isConnected || !address) {
      return
    }

    try {
      // Validate goal amount
      formHandlersUtils.validateGoalAmount(data.goal)

      if (!coverFile) {
        toast.error(t('Database Error'), {
          description: t('Cover Image is required'),
          icon: <Icons.alertCircle className="h-4 w-4" />,
        })
        return
      }
      if (coverFile.size > 5 * 1024 * 1024) {
        toast.error(t('An error occurred while creating the campaign'), {
          description: t('Please upload an image smaller than 5MB'),
          icon: <Icons.alertCircle className="h-4 w-4" />,
        })
        return
      }

      const uploaded = await firebaseStorage.uploadFileWithDetails({
        file: coverFile,
        path: 'images/campaigns',
        fileName: `cover_${Date.now()}`,
      })

      const preparedData = { ...data, coverImage: uploaded.downloadURL }
      setFormState(FORM_STATE.CONTRACT_PENDING)
      setFormData(preparedData)

      // Create campaign on blockchain
      createCampaignContract({ goal: data.goal })
    } catch (error) {
      console.error('Error creating campaign:', error)
      setFormState(FORM_STATE.ERROR)
      toast.error(t('Error'), {
        description: error instanceof Error ? error.message : t('An unexpected error occurred'),
        icon: <Icons.alertCircle className="h-4 w-4" />,
      })
    }
  }

  const isLoading = form.formState.isSubmitting || isAPIPending || isContractLoading
  const canSubmit = isConnected && form.formState.isValid && !isLoading && formState === FORM_STATE.IDLE

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{t('Create New Campaign')}</CardTitle>
            <CardDescription className="text-base">
              {t('Start a new charitable campaign to help those in need. Set your goal and describe your cause.')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Cover Image - moved to top (smaller height) */}
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                    <Icons.image className="h-4 w-4" />
                    <span>{t('Cover Image')}</span>
                  </FormLabel>

                  <FormControl>
                    <ImageDropzone
                      value={field.value}
                      placeholder={t('Drag & drop your image here, or click to upload')}
                      previewAspect={3 / 1}
                      onChange={(payload) => {
                        if (!payload) return
                        const { objectUrl, file } = payload
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error(t('An error occurred while creating the campaign'), {
                            description: t('Please upload an image smaller than 5MB'),
                            icon: <Icons.alertCircle className="h-4 w-4" />,
                          })
                          return
                        }
                        setCoverFile(file)
                        field.onChange(objectUrl)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                    <Icons.edit className="h-4 w-4" />
                    <span>{t('Title')}</span>
                  </FormLabel>

                  <FormControl>
                    <Input {...field} disabled={isLoading} placeholder={t('Enter your campaign title')} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Goal Input */}
            <FormField
              control={form.control}
              name="goal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                    <Target className="h-4 w-4" />
                    <span>{t('Campaign Goal (ETH)')}</span>
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      {...formUIUtils.getGoalInputProps()}
                      className="transition-colors"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    {t('Minimum: {min} ETH | Maximum: {max} ETH', {
                      min: CAMPAIGN_CONSTANTS.MIN_GOAL,
                      max: CAMPAIGN_CONSTANTS.MAX_GOAL,
                    })}
                  </p>
                </FormItem>
              )}
            />

            {/* Description Input */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold flex items-center space-x-2">
                    <Icons.post className="h-4 w-4" />
                    <span>{t('Campaign Description')}</span>
                  </FormLabel>

                  <FormControl>
                    <Editor value={field.value} onChange={field.onChange} disabled={isLoading} showPreview={true} />
                  </FormControl>

                  <FormMessage />

                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{t("Describe your campaign's purpose and goals")}</span>
                    <span className={formUIUtils.getCharacterCountColor(description?.length || 0)}>
                      {formUIUtils.getCharacterCountText(description?.length || 0)}
                    </span>
                  </div>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" disabled={!canSubmit} className="w-full h-12 text-base font-semibold">
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading
                ? t('Creating Campaign...')
                : !isConnected
                  ? t('Connect Wallet to Continue')
                  : t('Create Campaign')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
