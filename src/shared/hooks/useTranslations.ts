// eslint-disable-next-line no-restricted-imports
import { useTranslations as _useTranslations } from 'next-intl'
import { useMemo } from 'react'

// periods are parsed as path separators by next-intl, so we need to replace
// them with underscores both here and in getRequestConfig
export const useTranslations: typeof _useTranslations = (...args) => {
  const translateFn = _useTranslations(...args)

  return useMemo(() => {
    const proxyTranslateFn = new Proxy(translateFn, {
      apply(target, thisArg, argumentsList: Parameters<typeof translateFn>) {
        const [message, ...rest] = argumentsList
        return target.apply(thisArg, [message.replaceAll('.', '_') as typeof message, ...rest])
      },
    }) as typeof translateFn

    Reflect.ownKeys(translateFn).forEach((key) => {
      const propertyDescriptor = Object.getOwnPropertyDescriptor(translateFn, key)

      if (propertyDescriptor) {
        Object.defineProperty(proxyTranslateFn, key, propertyDescriptor)
      }
    })

    return proxyTranslateFn
  }, [translateFn])
}
