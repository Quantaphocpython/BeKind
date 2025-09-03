'use client'

import { ApiEndpointEnum } from '@/shared/constants'
import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false }) as any

export default function ApiDocsPage() {
  const specUrl = ApiEndpointEnum.OpenApiJson
  return <SwaggerUI url={specUrl} docExpansion="list" defaultModelsExpandDepth={1} tryItOutEnabled />
}
