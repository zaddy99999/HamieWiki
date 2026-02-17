'use client';

import { http, createConfig } from 'wagmi';
import { mainnet, polygon, base } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// WalletConnect project ID - get yours at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const config = createConfig({
  chains: [mainnet, polygon, base],
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
  },
});

// Admin wallet addresses (lowercase for comparison)
// Add your wallet addresses here
const adminAddresses: string[] = [
  // Add admin wallet addresses here (lowercase)
  // Example: '0x1234567890abcdef1234567890abcdef12345678'
];
export const ADMIN_WALLETS: string[] = adminAddresses.map(addr => addr.toLowerCase());

// Check if an address is an admin
export function isAdminWallet(address: string | undefined): boolean {
  if (!address) return false;
  // If no admin wallets configured, allow any connected wallet (for initial setup)
  if (ADMIN_WALLETS.length === 0) return true;
  return ADMIN_WALLETS.includes(address.toLowerCase());
}
