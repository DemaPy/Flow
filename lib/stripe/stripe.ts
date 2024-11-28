import Stripe from "stripe";

export const stripe = new Stripe(KEY, {
    apiVersion: "2024-11-20.acacia",
    typescript: true
})
