import React from "react";
import getTransactionHistory from "@/actions/billing/getTransactionHisstory";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftRightIcon } from "lucide-react";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100);
}

async function TransactionHistory() {
  const data = await getTransactionHistory();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl flex items-center font-bold gap-2">
          <ArrowLeftRightIcon className="h-6 w-6 text-primary" />
          Transaction history
        </CardTitle>
        <CardDescription>
          View your transaction history and download invoices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 && (
          <p className="text-muted-foreground">No transactions yet</p>
        )}
        {data.map((item) => (
          <div key={item.id} className="flex justify-between items-center py-3 border-b last:border-b-0">
            <div>
              <p className="font-medium">{formatDate(item.date)}</p>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatAmount(item.amount, item.currency)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default TransactionHistory;
