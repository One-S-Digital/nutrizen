// Types only. Safe to import from client components (erased at build time).

export type TradeTier = "wholesaler" | "reseller" | "resellerplus";

export type TradeAccount = {
  email: string;
  business: string;
  tier: TradeTier;
};

/** What the browser is allowed to know: the signed-in tier's price only. */
export type TradeProduct = {
  id: string;
  name: string;
  rrp: number;
  price: number;
};

export type OrderDetails = {
  business: string;
  contact: string;
  email: string;
  phone: string;
  recipient: string;
  recipientPhone: string;
  address: string;
  payment: string;
  notes: string;
  agreed: boolean;
};

export type OrderLine = {
  name: string;
  qty: number;
  unit: number;
  rrp: number;
  line: number;
};

export type OrderState =
  | { status: "idle" }
  | { status: "error"; errors: string[] }
  | { status: "sent"; reference: string }
  | { status: "manual"; reference: string; to: string; subject: string; text: string };

export type LinkRequestState = {
  error?: string;
  sent?: boolean;
  /** Echoed back so the form can refill it after a failed attempt. */
  email?: string;
};

export type ConfirmState = {
  error?: string;
};
