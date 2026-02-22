import { UpgradeButtons } from "@/components/dashboard/upgrade-buttons";

export default function BillingPage() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Upgrade</h1>

      <p className="mt-2 text-muted-foreground">
        Unlock higher daily limits and premium generation.
      </p>

      <div className="mt-6">
        <UpgradeButtons />
      </div>
    </div>
  );
}