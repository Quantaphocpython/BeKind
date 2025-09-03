import { CONTACT_INFO, LICENSE_INFO, OPENAPI_DESCRIPTION, OPENAPI_TITLE, OPENAPI_VERSION } from '@/shared/constants'
import { NextApiRequest, NextApiResponse } from 'next'
import swaggerJSDoc from 'swagger-jsdoc'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  // Base URL from env for server list
  const serverUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'

  const options: swaggerJSDoc.Options = {
    definition: {
      openapi: '3.0.3',
      info: {
        title: OPENAPI_TITLE,
        version: OPENAPI_VERSION,
        description: OPENAPI_DESCRIPTION,
        contact: CONTACT_INFO,
        license: LICENSE_INFO,
      },
      servers: [{ url: serverUrl }],
    },
    apis: [
      // Annotated files for swagger-jsdoc to scan (JSDoc @openapi blocks)
      'src/pages/api/**/*.ts',
      'src/server/**/*.ts',
    ],
  }

  const spec = swaggerJSDoc(options)

  res.setHeader('Content-Type', 'application/json')
  return res.status(200).send(spec)
}
