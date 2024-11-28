"use server";

import { PackId, getCreditsPack } from "@/types/billing";
import { writeFile } from "fs";
import Stripe from "stripe";
import prisma from "../prisma";

export async function HandleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session
) {
  if (!event.metadata) {
    throw new Error("Missgin metadata");
  }
  const { userId, packId } = event.metadata;
  if (!userId) {
    throw new Error("Missgin user id");
  }

  if (!packId) {
    throw new Error("Missgin user id");
  }

  const purchasePack = getCreditsPack(packId as PackId);
  if (!purchasePack) {
    throw new Error("Pack id not found");
  }

  //   Create balance or concatanate balance.
  await prisma.userBalance.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      credits: purchasePack.credits,
    },
    update: {
      credits: {
        increment: purchasePack.credits,
      },
    },
  });

  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: event.id,
      description: `${purchasePack.name} - ${purchasePack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!,
    },
  });
}
