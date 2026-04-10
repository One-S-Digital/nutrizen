/**
 * Shopify Storefront API – Customer Authentication
 *
 * Uses the same domain / storefront token as the rest of the app.
 * All mutations follow the Storefront API 2026-01 schema.
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export type CustomerUserError = {
  field: string[] | null;
  message: string;
  code: string;
};

export type CustomerAccessToken = {
  accessToken: string;
  expiresAt: string;
};

export type Customer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phone: string | null;
  createdAt: string;
};

export type CustomerOrder = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    title: string;
    quantity: number;
  }[];
};

// ---------------------------------------------------------------------------
// Internal fetch helper (mirrors shopifyFetch but server-only, no mock check)
// ---------------------------------------------------------------------------
async function customerFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  if (!domain?.trim() || !storefrontAccessToken?.trim()) {
    return null;
  }

  const endpoint = `https://${domain
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")}/api/2026-01/graphql.json`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({ query, ...(variables ? { variables } : {}) }),
      cache: "no-store",
    });

    const json = await res.json();

    if (json.errors) {
      console.error("[shopify-customer] GraphQL errors:", JSON.stringify(json.errors));
      return null;
    }

    return json.data as T;
  } catch (err) {
    console.error("[shopify-customer] fetch error:", err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Register (create customer)
// ---------------------------------------------------------------------------
export async function registerCustomer(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ customer: Customer | null; errors: CustomerUserError[] }> {
  const data = await customerFetch<{
    customerCreate: {
      customer: Customer | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(
    `mutation customerCreate($input: CustomerCreateInput!) {
      customerCreate(input: $input) {
        customer {
          id
          firstName
          lastName
          email
          phone
          createdAt
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }`,
    { input }
  );

  if (!data) return { customer: null, errors: [{ field: null, message: "Service unavailable.", code: "SERVICE_UNAVAILABLE" }] };

  return {
    customer: data.customerCreate.customer,
    errors: data.customerCreate.customerUserErrors,
  };
}

// ---------------------------------------------------------------------------
// Login (create access token)
// ---------------------------------------------------------------------------
export async function loginCustomer(input: {
  email: string;
  password: string;
}): Promise<{ token: CustomerAccessToken | null; errors: CustomerUserError[] }> {
  const data = await customerFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: CustomerAccessToken | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(
    `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
      customerAccessTokenCreate(input: $input) {
        customerAccessToken {
          accessToken
          expiresAt
        }
        customerUserErrors {
          field
          message
          code
        }
      }
    }`,
    { input }
  );

  if (!data) return { token: null, errors: [{ field: null, message: "Service unavailable.", code: "SERVICE_UNAVAILABLE" }] };

  return {
    token: data.customerAccessTokenCreate.customerAccessToken,
    errors: data.customerAccessTokenCreate.customerUserErrors,
  };
}

// ---------------------------------------------------------------------------
// Logout (delete access token)
// ---------------------------------------------------------------------------
export async function logoutCustomer(accessToken: string): Promise<void> {
  await customerFetch(
    `mutation customerAccessTokenDelete($customerAccessToken: String!) {
      customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
        deletedAccessToken
        userErrors {
          field
          message
        }
      }
    }`,
    { customerAccessToken: accessToken }
  );
}

// ---------------------------------------------------------------------------
// Get customer profile + recent orders
// ---------------------------------------------------------------------------
export async function getCustomerWithOrders(accessToken: string): Promise<{
  customer: Customer | null;
  orders: CustomerOrder[];
}> {
  const data = await customerFetch<{
    customer: (Customer & {
      orders: {
        edges: {
          node: {
            id: string;
            name: string;
            processedAt: string;
            financialStatus: string;
            fulfillmentStatus: string;
            totalPriceV2: { amount: string; currencyCode: string };
            lineItems: { edges: { node: { title: string; quantity: number } }[] };
          };
        }[];
      };
    }) | null;
  }>(
    `query getCustomer($customerAccessToken: String!) {
      customer(customerAccessToken: $customerAccessToken) {
        id
        firstName
        lastName
        email
        phone
        createdAt
        orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
          edges {
            node {
              id
              name
              processedAt
              financialStatus
              fulfillmentStatus
              totalPriceV2 {
                amount
                currencyCode
              }
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                  }
                }
              }
            }
          }
        }
      }
    }`,
    { customerAccessToken: accessToken }
  );

  if (!data?.customer) return { customer: null, orders: [] };

  const { orders: ordersConnection, ...customerFields } = data.customer;
  const orders: CustomerOrder[] = ordersConnection.edges.map(({ node }) => ({
    id: node.id,
    name: node.name,
    processedAt: node.processedAt,
    financialStatus: node.financialStatus,
    fulfillmentStatus: node.fulfillmentStatus,
    totalPrice: node.totalPriceV2,
    lineItems: node.lineItems.edges.map(({ node: item }) => ({
      title: item.title,
      quantity: item.quantity,
    })),
  }));

  return { customer: customerFields as Customer, orders };
}
