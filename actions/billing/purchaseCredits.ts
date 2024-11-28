"use server";

import { getAppUrl } from "@/lib/appUrl";
import { stripe } from "@/lib/stripe/stripe";
import { PackId, getCreditsPack } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function purchaseCredits(id: PackId) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const selectedPack = getCreditsPack(id);
  if (!selectedPack) {
    throw new Error("Invalid Pack");
  }
  const priceId = selectedPack.priceId;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    invoice_creation: {
      enabled: true,
    },
    success_url: getAppUrl("billing"),
    cancel_url: getAppUrl("billing"),
    metadata: {
      userId,
      packId: id,
    },
    line_items: [
      {
        quantity: 1,
        price: priceId,
      },
    ],
  });

  if (!session.url) {
    throw new Error("Cannot create stripe session!");
  }

  redirect(session.url);
}

export default purchaseCredits;
