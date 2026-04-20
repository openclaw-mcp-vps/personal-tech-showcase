"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    createLemonSqueezy?: () => void;
    LemonSqueezy?: {
      Url?: {
        Open?: (url: string) => void;
      };
    };
  }
}

interface CheckoutButtonProps {
  className?: string;
  label?: string;
}

export function CheckoutButton({
  className,
  label = "Start my portfolio for $9/month"
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/paywall/checkout-url", { cache: "no-store" });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Unable to initialize checkout.");
      }

      if (window.createLemonSqueezy) {
        window.createLemonSqueezy();
      }

      if (window.LemonSqueezy?.Url?.Open) {
        window.LemonSqueezy.Url.Open(payload.url);
      } else {
        window.location.href = payload.url;
      }
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout could not be started."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button size="lg" onClick={handleCheckout} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Opening secure checkout...
          </>
        ) : (
          label
        )}
      </Button>
      {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
    </div>
  );
}
