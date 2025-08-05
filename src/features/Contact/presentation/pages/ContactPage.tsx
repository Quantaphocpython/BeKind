import ContactForm from '../organisms/ContactForm'
import ContactMethods from '../organisms/ContactMethods'

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about BeKind? We're here to help. Reach out to us and we'll get back to you as soon as
            possible.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="mb-16">
          <ContactMethods />
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Send us a Message</h2>
            <p className="text-muted-foreground">Fill out the form below and we'll get back to you within 24 hours.</p>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}
