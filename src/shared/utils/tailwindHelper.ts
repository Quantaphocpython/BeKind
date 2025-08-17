/**
 * Get CSS variable value from document root
 * @param variableName - The CSS variable name (without -- prefix)
 * @returns The computed value of the CSS variable
 */
export const getTailwindVariable = (variableName: string): string => {
  if (typeof window === 'undefined') return ''

  return getComputedStyle(document.documentElement).getPropertyValue(`--${variableName}`)
}

/**
 * Get multiple Tailwind CSS variables at once
 * @param variableNames - Array of CSS variable names (without -- prefix)
 * @returns Object with variable names as keys and their values
 */
export const getTailwindVariables = (variableNames: string[]): Record<string, string> => {
  if (typeof window === 'undefined') return {}

  const result: Record<string, string> = {}
  variableNames.forEach((name) => {
    result[name] = getTailwindVariable(name)
  })
  return result
}

/**
 * Get common Tailwind color variables
 * @returns Object with common color variables
 */
export const getTailwindColors = () => {
  return getTailwindVariables([
    'foreground',
    'background',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'border',
    'input',
    'ring',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
  ])
}

/**
 * Get HSL color value from Tailwind variable
 * @param variableName - The CSS variable name (without -- prefix)
 * @returns HSL color string or empty string if not found
 */
export const getTailwindHSLColor = (variableName: string): string => {
  const value = getTailwindVariable(variableName)
  return value ? `hsl(${value})` : ''
}

/**
 * Get RGB color value from Tailwind variable
 * @param variableName - The CSS variable name (without -- prefix)
 * @returns RGB color string or empty string if not found
 */
export const getTailwindRGBColor = (variableName: string): string => {
  const value = getTailwindVariable(variableName)
  if (!value) return ''

  // Convert HSL to RGB (simplified conversion)
  try {
    const hsl = value.split(' ').map((v) => parseFloat(v))
    if (hsl.length >= 3) {
      const [h, s, l] = hsl
      // Simple HSL to RGB conversion
      const hue = h / 360
      const saturation = s / 100
      const lightness = l / 100

      const c = (1 - Math.abs(2 * lightness - 1)) * saturation
      const x = c * (1 - Math.abs(((hue * 6) % 2) - 1))
      const m = lightness - c / 2

      let r = 0,
        g = 0,
        b = 0

      if (hue < 1 / 6) {
        r = c
        g = x
        b = 0
      } else if (hue < 2 / 6) {
        r = x
        g = c
        b = 0
      } else if (hue < 3 / 6) {
        r = 0
        g = c
        b = x
      } else if (hue < 4 / 6) {
        r = 0
        g = x
        b = c
      } else if (hue < 5 / 6) {
        r = x
        g = 0
        b = c
      } else {
        r = c
        g = 0
        b = x
      }

      return `rgb(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)})`
    }
  } catch (error) {
    console.warn('Failed to convert HSL to RGB:', error)
  }

  return ''
}

/**
 * Get computed style value for any CSS property
 * @param propertyName - The CSS property name
 * @param element - The element to get computed style from (defaults to document.documentElement)
 * @returns The computed value of the CSS property
 */
export const getComputedStyleValue = (propertyName: string, element?: Element): string => {
  if (typeof window === 'undefined') return ''

  const targetElement = element || document.documentElement
  return getComputedStyle(targetElement).getPropertyValue(propertyName)
}

/**
 * Check if current theme is dark
 * @returns boolean indicating if dark theme is active
 */
export const isDarkTheme = (): boolean => {
  if (typeof window === 'undefined') return false

  const theme =
    document.documentElement.getAttribute('data-theme') ||
    document.documentElement.classList.contains('dark') ||
    window.matchMedia('(prefers-color-scheme: dark)').matches

  return Boolean(theme)
}

/**
 * Get theme-aware color value
 * @param lightColor - Color for light theme
 * @param darkColor - Color for dark theme
 * @returns The appropriate color based on current theme
 */
export const getThemeAwareColor = (lightColor: string, darkColor: string): string => {
  return isDarkTheme() ? darkColor : lightColor
}
