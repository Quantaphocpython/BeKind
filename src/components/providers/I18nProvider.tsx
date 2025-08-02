import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

interface I18nProviderProps {
  children: React.ReactNode;
}

const I18nProvider = async ({ children }: I18nProviderProps) => {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
};

export default I18nProvider;
