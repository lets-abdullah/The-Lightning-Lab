export default function AccountReturnsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Returns & RMAs</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Request returns or replacements for your orders.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 text-center space-y-3">
        <p className="text-muted-foreground max-w-md mx-auto">
          Return requests are handled by our support team. Email{" "}
          <a
            href="mailto:support@thelightninglab.com"
            className="text-primary hover:underline font-medium"
          >
            support@thelightninglab.com
          </a>{" "}
          with your order number and reason, and we&apos;ll send you an RMA.
        </p>
      </div>
    </div>
  );
}
