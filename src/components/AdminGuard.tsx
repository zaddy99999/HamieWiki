'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { isAdminWallet, ADMIN_WALLETS } from '@/lib/wagmi-config';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="admin-guard-loading">
        <div className="admin-guard-container">
          <div className="admin-guard-spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Not connected - show connect prompt
  if (!isConnected) {
    return (
      <div className="admin-guard-page">
        <div className="admin-guard-container">
          <div className="admin-guard-icon">🔐</div>
          <h1 className="admin-guard-title">Admin Access Required</h1>
          <p className="admin-guard-text">
            Connect your wallet to access the admin panel.
            {ADMIN_WALLETS.length > 0 && ' Only authorized wallets can access this area.'}
          </p>

          <div className="admin-guard-connectors" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                disabled={isPending || isConnecting}
                className="admin-guard-connect-btn"
                style={{ minHeight: '48px', padding: '12px 24px' }}
              >
                {isPending || isConnecting ? 'Connecting...' : `Connect ${connector.name}`}
              </button>
            ))}
          </div>

          <Link href="/" className="admin-guard-back" style={{ minHeight: '44px', padding: '12px 20px', display: 'inline-flex', alignItems: 'center' }}>
            ← Back to Wiki
          </Link>
        </div>
      </div>
    );
  }

  // Connected but not admin
  if (!isAdminWallet(address)) {
    return (
      <div className="admin-guard-page">
        <div className="admin-guard-container">
          <div className="admin-guard-icon">⛔</div>
          <h1 className="admin-guard-title">Access Denied</h1>
          <p className="admin-guard-text">
            This wallet is not authorized to access the admin panel.
          </p>
          <p className="admin-guard-address">
            Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>

          <div className="admin-guard-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <button onClick={() => disconnect()} className="admin-guard-disconnect-btn" style={{ minHeight: '48px', padding: '12px 24px' }}>
              Disconnect Wallet
            </button>
            <Link href="/" className="admin-guard-back" style={{ minHeight: '44px', padding: '12px 20px', display: 'inline-flex', alignItems: 'center' }}>
              ← Back to Wiki
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized - render children with admin header
  return (
    <div className="admin-authenticated">
      <div className="admin-wallet-bar">
        <span className="admin-wallet-status">
          🟢 Admin: {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button onClick={() => disconnect()} className="admin-wallet-disconnect" style={{ minHeight: '36px', padding: '8px 16px' }}>
          Disconnect
        </button>
      </div>
      {children}
    </div>
  );
}
