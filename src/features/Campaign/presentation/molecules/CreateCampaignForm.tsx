'use client'

import Editor from '@/components/common/Editor'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CampaignService } from '@/features/Campaign/data/services/campaign.service'
import { container, TYPES } from '@/features/Common/container'
import { useApiMutation } from '@/shared/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAccount } from 'wagmi'
import { CAMPAIGN_CONSTANTS, CreateCampaignFormData, createCampaignSchema } from '../../data/constants'
import { CreateCampaignRequestDto, CreateCampaignResponseDto } from '../../data/dto'
import { useCampaignContractWrite } from '../../data/hooks'

export const CreateCampaignForm = () => {
  const { address, isConnected } = useAccount()
  const [isContractSuccess, setIsContractSuccess] = useState(false)
  const [formData, setFormData] = useState<CreateCampaignFormData | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CreateCampaignFormData>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      goal: '',
      description: '',
    },
  })

  const {
    mutateAsync: createCampaignAPI,
    isPending: isAPIPending,
    error: apiError,
  } = useApiMutation<CreateCampaignResponseDto, CreateCampaignRequestDto>(
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
    error: contractError,
  } = useCampaignContractWrite('createCampaign')

  const goal = watch('goal')
  const description = watch('description')

  const onSubmit = async (data: CreateCampaignFormData) => {
    if (!isConnected || !address) {
      return
    }

    try {
      // Store form data for later use
      setFormData(data)

      // First, create campaign on blockchain
      createCampaignContract({ goal: data.goal })
    } catch (error) {
      console.error('Error creating campaign:', error)
    }
  }

  // Handle contract success and create campaign in database
  useEffect(() => {
    if (isContractTransactionSuccess && formData && address) {
      setIsContractSuccess(true)

      // Create campaign in database
      const requestData: CreateCampaignRequestDto = {
        ...formData,
        userAddress: address,
      }

      createCampaignAPI(requestData)
        .then(() => {
          reset()
          setIsContractSuccess(false)
          setFormData(null)
        })
        .catch((error) => {
          console.error('Error creating campaign in database:', error)
          setIsContractSuccess(false)
        })
    }
  }, [isContractTransactionSuccess, formData, address, createCampaignAPI, reset])

  const isLoading = isSubmitting || isAPIPending || isContractLoading

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create New Campaign</CardTitle>
        <CardDescription>
          Start a new charitable campaign to help those in need. Set your goal and describe your cause.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Goal Input */}
          <div className="space-y-2">
            <label htmlFor="goal" className="text-sm font-medium">
              Campaign Goal (ETH)
            </label>
            <Input
              id="goal"
              type="number"
              step="0.001"
              placeholder="0.1"
              {...register('goal')}
              className={errors.goal ? 'border-red-500' : ''}
            />
            {errors.goal && <p className="text-sm text-red-500">{errors.goal.message}</p>}
            <p className="text-xs text-muted-foreground">
              Minimum: {CAMPAIGN_CONSTANTS.MIN_GOAL} ETH | Maximum: {CAMPAIGN_CONSTANTS.MAX_GOAL} ETH
            </p>
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Campaign Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Editor
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.description?.message}
                  disabled={isLoading}
                  showPreview={true}
                />
              )}
            />
            <p className="text-xs text-muted-foreground">
              {description?.length || 0}/{CAMPAIGN_CONSTANTS.MAX_DESCRIPTION_LENGTH} characters
            </p>
          </div>

          {/* Wallet Connection Alert */}
          {!isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please connect your wallet to create a campaign.</AlertDescription>
            </Alert>
          )}

          {/* Contract Error */}
          {contractError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Contract error: {contractError.message}</AlertDescription>
            </Alert>
          )}

          {/* API Error */}
          {apiError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>API error: {apiError.message}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {isContractSuccess && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Campaign created successfully on blockchain! Saving to database...</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={!isConnected || isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Creating Campaign...' : 'Create Campaign'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
