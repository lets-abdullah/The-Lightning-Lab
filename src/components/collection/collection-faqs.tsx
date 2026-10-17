import type { Faq } from "@/lib/commerce/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CollectionFaqsProps {
  faqs?: Faq[];
  className?: string;
}

export function CollectionFaqs({ faqs, className }: CollectionFaqsProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={`border-t pt-12 mt-12 ${className || ""}`} aria-labelledby="faqs-heading">
      <div className="max-w-3xl space-y-4">
        <h2 id="faqs-heading" className="text-xl font-bold tracking-tight text-foreground">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-muted-foreground">
          Technical specifications, installation advice, and contractor purchasing information.
        </p>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
