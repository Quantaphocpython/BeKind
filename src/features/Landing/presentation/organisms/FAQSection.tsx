'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useTranslations } from '@/shared/hooks'

export default function FAQSection() {
  const t = useTranslations()

  const items = [
    {
      q: 'What is BeKind?',
      a: 'BeKind is a blockchain-powered charity platform enabling transparent, traceable donations and milestone-based withdrawals.',
    },
    {
      q: 'How do donations work?',
      a: 'Donors send funds directly to campaign smart contracts. All transactions are recorded on-chain and reflected in real time.',
    },
    {
      q: 'Is BeKind secure?',
      a: 'Yes. We use audited smart contracts and never custody user funds. Withdrawals follow milestone rules with proof where required.',
    },
    {
      q: 'How do I create a campaign?',
      a: 'Connect your wallet, go to Create Campaign, fill out details, and deploy. The platform handles on-chain IDs and tracking.',
    },
    {
      q: 'Are there any fees?',
      a: 'Network gas fees apply. Platform fees may be minimal to support operations and are shown before confirmation.',
    },
    {
      q: 'How can I get support?',
      a: 'Use the Contact page or open a support ticket. We aim to respond within 24 hours.',
    },
  ]

  return (
    <section className="py-16 border-t min-h-[620px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">{t('Frequently Asked Questions')}</h2>
          <p className="text-muted-foreground">{t('Answers to common questions about using BeKind')}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {items.map((it, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left hover:no-underline cursor-pointer">
                  <span className="inline-flex items-center gap-2">{t(it.q)}</span>
                </AccordionTrigger>
                <AccordionContent>{t(it.a)}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
