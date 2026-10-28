import OrderDesk from "@/components/trade/OrderDesk";
import { productsForTier } from "@/lib/trade/products";
import { requireTradeSession } from "@/lib/trade/session";

export default async function TradePage() {
  const account = await requireTradeSession();
  // Only the signed-in tier's prices ever reach the browser.
  const products = productsForTier(account.tier);

  return <OrderDesk account={account} products={products} />;
}
