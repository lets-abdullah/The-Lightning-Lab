export default function AccountQuotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Project Quotes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Custom contractor and commercial lighting project pricing.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 text-center space-y-3">
        <p className="text-muted-foreground max-w-md mx-auto">
          Project quotes and contractor pricing are coming soon. Contact{" "}
          <a
            href="mailto:support@thelightninglab.com"
            className="text-primary hover:underline font-medium"
          >
            support@thelightninglab.com
          </a>{" "}
          to request pricing today.
        </p>
      </div>
    </div>
  );
}
