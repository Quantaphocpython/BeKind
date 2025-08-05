# Custom useTranslations Hook

## Overview

This custom `useTranslations` hook allows you to use English sentences as translation keys in next-intl, handling the dot (`.`) character that next-intl interprets as nested JSON structure.

## How it works

1. **Key Transformation**: The hook automatically replaces dots (`.`) with underscores (`_`) in translation keys
2. **Request Config**: The `getRequestConfig` function in `src/configs/i18n/request.ts` applies the same transformation when loading translation files
3. **Seamless Usage**: You can use the hook exactly like the original `useTranslations` from next-intl

## Usage

### Import the custom hook

```typescript
import { useTranslations } from '@/shared/hooks'
```

### Use English sentences as keys

```typescript
const t = useTranslations()

// Instead of using short keys like:
// t('About BeKind Description')

// You can use full English sentences:
t(
  'We are revolutionizing charitable giving through blockchain technology, creating a transparent and secure platform that connects donors directly with those in need.',
)
```

### Translation files

In your translation files (`en.json`, `vi.json`), use the English sentence as the key:

```json
{
  "We are revolutionizing charitable giving through blockchain technology, creating a transparent and secure platform that connects donors directly with those in need.": "We are revolutionizing charitable giving through blockchain technology, creating a transparent and secure platform that connects donors directly with those in need.",
  "These numbers represent the real impact we have made together with our community of donors and partners.": "These numbers represent the real impact we have made together with our community of donors and partners."
}
```

For Vietnamese:

```json
{
  "We are revolutionizing charitable giving through blockchain technology, creating a transparent and secure platform that connects donors directly with those in need.": "Chúng tôi đang cách mạng hóa việc quyên góp từ thiện thông qua công nghệ blockchain, tạo ra một nền tảng minh bạch và an toàn kết nối người quyên góp trực tiếp với những người cần giúp đỡ.",
  "These numbers represent the real impact we have made together with our community of donors and partners.": "Những con số này thể hiện tác động thực tế mà chúng tôi đã tạo ra cùng với cộng đồng người quyên góp và đối tác."
}
```

## Benefits

1. **Self-documenting**: Translation keys are readable English sentences
2. **No need for context**: Developers can understand what the text is about without looking at translation files
3. **Easier maintenance**: No need to maintain separate key names and translations
4. **Consistent**: All translation keys follow the same pattern

## Technical Details

The hook uses a JavaScript Proxy to intercept calls to the translation function and automatically replace dots with underscores before passing the key to next-intl.

## Migration

If you're migrating from the standard next-intl approach:

1. Replace `import { useTranslations } from 'next-intl'` with `import { useTranslations } from '@/shared/hooks'`
2. Update your translation keys to use full English sentences
3. Update your translation files accordingly

The hook maintains full compatibility with all next-intl features including interpolation, pluralization, and nested keys.
