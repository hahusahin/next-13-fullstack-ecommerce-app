import getCurrentUser from "@/app/actions/getCurrentUser";
import { CartItem } from "@/store/cart-slice";
import { formatAmountForStripe } from "@/utils/stripeUtils";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser();

  if (!currentUser)
    return NextResponse.json(
      { error: "You are not authorized" },
      { status: 401 }
    );

  const data = await request.json();

  const { cartItems, itemsPrice } = data;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
  });

  const taxRate = await stripe.taxRates.create({
    display_name: "Sales Tax",
    inclusive: false,
    percentage: 15,
    description: "Sales Tax",
  });

  const lineItems = cartItems.map((item: CartItem) => ({
    price_data: {
      currency: "usd",
      product_data: {
        images: [item.imageUrl],
        name: item.name,
      },
      unit_amount: formatAmountForStripe(item.price, "usd"),
    },
    quantity: item.quantity,
    tax_rates: [taxRate.id],
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: "Shipping Price",
          fixed_amount: {
            amount: itemsPrice > 100 ? 0 : 1000,
            currency: "usd",
          },
        },
      },
    ],

    success_url: `${request.nextUrl.origin}/ordersummary?status=success`,
    cancel_url: `${request.nextUrl.origin}/ordersummary?status=fail`,
  });

  return NextResponse.json(
    {
      success: true,
      id: session.id,
    },
    { status: 200 }
  );
}
