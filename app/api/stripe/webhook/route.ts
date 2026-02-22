import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle subscription status updates
  if (event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted") {

    const sub = event.data.object as Stripe.Subscription;
    const customerId = sub.customer as string;

    // Determine plan from price id
    const priceId = sub.items.data[0]?.price?.id;
    const plan =
      priceId === process.env.STRIPE_PRICE_ID_CREATOR ? "creator" :
      priceId === process.env.STRIPE_PRICE_ID_PRO ? "pro" :
      "free";

    const status = sub.status; // active, trialing, past_due, canceled, etc.

    await supabaseAdmin
      .from("profiles")
      .update({
        plan,
        stripe_subscription_id: sub.id,
        subscription_status: status,
      })
      .eq("stripe_customer_id", customerId);
  }

  return NextResponse.json({ received: true });
}