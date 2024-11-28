export enum PackId {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

export type CreditsPackType = {
  id: PackId;
  name: string;
  label: string;
  credits: number;
  price: number;
};

export const CreditsPack: CreditsPackType[] = [
  {
    id: PackId.SMALL,
    name: "Small Pack",
    label: "1,000 credits",
    credits: 1000,
    price: 999,
  },
  {
    id: PackId.MEDIUM,
    name: "Medium Pack",
    label: "4,000 credits",
    credits: 4000,
    price: 3999,
  },
  {
    id: PackId.LARGE,
    name: "Large Pack",
    label: "6,000 credits",
    credits: 6000,
    price: 5999,
  },
];
export const getCreditsPack = (id: PackId) => {
  return CreditsPack.find((pack) => pack.id === id);
};
