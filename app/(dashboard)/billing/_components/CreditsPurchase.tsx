"use client";

import purchaseCredits from "@/actions/billing/purchaseCredits";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditsPack, PackId } from "@/types/billing";
import { useMutation } from "@tanstack/react-query";
import { CoinsIcon, CreditCard } from "lucide-react";
import { useState } from "react";

function CreditsPurchase() {
  const [selectedPack, setSelectedPack] = useState(PackId.MEDIUM);

  const mutation = useMutation({
    mutationFn: purchaseCredits,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CoinsIcon className="h-6 w-6 text-primary" />
          Purchase Credits
        </CardTitle>
        <CardDescription>
          Select the number of credits you want to purchase
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedPack}
          onValueChange={(value) => setSelectedPack(value as PackId)}
        >
          {CreditsPack.map((item) => (
            <div
              onClick={() => setSelectedPack(item.id)}
              key={item.id}
              className="flex items-center space-x-3 bg-secondary/50 rounded-md p-3 hover:bg-secondary"
            >
              <RadioGroupItem value={item.id} id={item.id} />
              <Label className="flex justify-between w-full cursor-pointer">
                <span>{item.name}</span>
                <span>-</span>
                <span>{item.label}</span>
                <span className="font-bold text-primary">
                  $ {(item.price / 100).toFixed(2)}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => {
            mutation.mutate(selectedPack);
          }}
          disabled={mutation.isPending}
          className="w-full"
        >
          <CreditCard className="mr-2 w-5 h-5" />
          Purchase credits
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CreditsPurchase;
