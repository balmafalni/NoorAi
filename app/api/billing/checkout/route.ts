import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json(); // 'creator' | 'pro'
  const priceId =
    plan === "creator" ? process.env.STRIPE_PRICE_ID_CREATOR :
    plan === "pro" ? process.env.STRIPE_PRICE_ID_PRO :
    null;

  if (!priceId) return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

  // Ensure customer exists
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("stripe_customer_id, email")
    .eq("id", userData.user.id)
    .single();

  let customerId = profile?.stripe_customer_id as string | null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? userData.user.email ?? undefined,
      metadata: { supabase_user_id: userData.user.id },
    });
    customerId = customer.id;

    await supabaseAdmin
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", userData.user.id);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?billing=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?billing=cancel`,
  });

  return NextResponse.json({ url: session.url });
}