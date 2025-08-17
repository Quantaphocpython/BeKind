import { HttpResponse } from '../types/httpResponse.type'

export class HttpResponseUtil {
  static success<T>(data: T, message: string = 'Success', status: number = 200): HttpResponse<T> {
    return {
      status,
      message,
      data,
    }
  }

  static error(message: string, status: number = 500, data: any = null): HttpResponse<any> {
    return {
      status,
      message,
      data,
    }
  }

  static badRequest(message: string, data: any = null): HttpResponse<any> {
    return this.error(message, 400, data)
  }

  static notFound(message: string = 'Resource not found'): HttpResponse<null> {
    return this.error(message, 404, null)
  }

  static unauthorized(message: string = 'Unauthorized'): HttpResponse<null> {
    return this.error(message, 401, null)
  }

  static forbidden(message: string = 'Forbidden'): HttpResponse<null> {
    return this.error(message, 403, null)
  }

  static methodNotAllowed(message: string = 'Method not allowed'): HttpResponse<null> {
    return this.error(message, 405, null)
  }

  static internalServerError(message: string = 'Internal server error'): HttpResponse<null> {
    return this.error(message, 500, null)
  }
}
