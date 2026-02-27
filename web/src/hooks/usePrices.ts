/**
 * usePrices - Custom hook for fetching token prices from CoinGecko
 */

import { useCallback, useEffect, useState } from "react";

export interface TokenPrices {
  matic: number;
  usdc: number;
  usdt: number;
  dai: number;
  eth: number;
}

interface UsePricesReturn {
  prices: TokenPrices;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const COINGECKO_IDS = {
  matic: "matic-network",
  usdc: "usd-coin",
  usdt: "tether",
  dai: "dai",
  eth: "ethereum",
};

const DEFAULT_PRICES: TokenPrices = {
  matic: 0.5,
  usdc: 1,
  usdt: 1,
  dai: 1,
  eth: 2500,
};

export function usePrices(): UsePricesReturn {
  const [prices, setPrices] = useState<TokenPrices>(DEFAULT_PRICES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const ids = Object.values(COINGECKO_IDS).join(",");
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch prices");
      }

      const data = await response.json();

      setPrices({
        matic: data[COINGECKO_IDS.matic]?.usd ?? DEFAULT_PRICES.matic,
        usdc: data[COINGECKO_IDS.usdc]?.usd ?? DEFAULT_PRICES.usdc,
        usdt: data[COINGECKO_IDS.usdt]?.usd ?? DEFAULT_PRICES.usdt,
        dai: data[COINGECKO_IDS.dai]?.usd ?? DEFAULT_PRICES.dai,
        eth: data[COINGECKO_IDS.eth]?.usd ?? DEFAULT_PRICES.eth,
      });
    } catch (err) {
      console.error("Error fetching prices:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch prices");
      // Keep using default/cached prices on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();

    // Refresh prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, [fetchPrices]);

  return {
    prices,
    isLoading,
    error,
    refetch: fetchPrices,
  };
}

/**
 * Format USD value with proper formatting
 */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Calculate USD value from token amount
 */
export function calculateUSDValue(
  amount: string | number,
  price: number
): number {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return numAmount * price;
}

export default usePrices;
