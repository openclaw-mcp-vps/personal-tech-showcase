"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    LemonSqueezy?: {
      Setup: (options: { eventHandler: (event: unknown) => void }) => void;
      Url: {
        Open: (url: string) => void;
      };
    };
    createLemonSqueezy?: () => void;
  }
}

interface LemonCheckoutEvent {
  event?: string;
  data?: {
    order_id?: number | string;
    customer_email?: string;
  };
}

async function grantDashboardAccess(event: LemonCheckoutEvent) {
  await fetch("/api/paywall/grant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      eventName: event.event ?? "Checkout.Success",
      orderId: event.data?.order_id,
      customerEmail: event.data?.customer_email
    })
  });
}

export function CheckoutOverlayButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);

    try {
      const checkoutResponse = await fetch("/api/paywall/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      });

      const payload = (await checkoutResponse.json()) as { checkoutUrl?: string; error?: string };

      if (!checkoutResponse.ok || !payload.checkoutUrl) {
        throw new Error(payload.error ?? "Checkout is not available right now.");
      }

      if (typeof window === "undefined") {
        return;
      }

      window.createLemonSqueezy?.();

      if (!window.LemonSqueezy) {
        window.location.assign(payload.checkoutUrl);
        return;
      }

      window.LemonSqueezy.Setup({
        eventHandler: async (rawEvent) => {
          const event = rawEvent as LemonCheckoutEvent;
          if (event.event?.toLowerCase() === "checkout.success") {
            await grantDashboardAccess(event);
            window.location.assign("/dashboard?unlocked=1");
          }
        }
      });

      window.LemonSqueezy.Url.Open(payload.checkoutUrl);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Could not launch checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button size="lg" onClick={handleCheckout} disabled={loading}>
        {loading ? "Opening checkout..." : "Unlock Portfolio Builder for $9/mo"}
      </Button>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
