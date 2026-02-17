'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAccount, useDisconnect } from 'wagmi';

const AdminGuard = dynamic(() => import('@/components/AdminGuard'), { ssr: false });

interface StorageInfo {
  key: string;
  size: number;
  items?: number;
}

function AdminDashboardContent() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [storageData, setStorageData] = useState<StorageInfo[]>([]);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    analyzeStorage();
  }, []);

  const analyzeStorage = () => {
    const data: StorageInfo[] = [];
    let total = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('hamieverse')) {
        const value = localStorage.getItem(key) || '';
        const size = new Blob([value]).size;
        total += size;

        let items: number | undefined;
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) items = parsed.length;
        } catch {}

        data.push({ key, size, items });
      }
    }

    setStorageData(data.sort((a, b) => b.size - a.size));
    setTotalSize(total);
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const clearStorage = (key: string) => {
    if (confirm(`Clear all data for "${key}"?`)) {
      localStorage.removeItem(key);
      analyzeStorage();
    }
  };

  const clearAllStorage = () => {
    if (confirm('Clear ALL Hamieverse data? This cannot be undone.')) {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('hamieverse')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      analyzeStorage();
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-top">
          <Link href="/" className="admin-back">← Back to Wiki</Link>
          <h1 className="admin-title">Admin Dashboard</h1>
        </div>
        <p className="admin-subtitle">Manage Hamieverse Wiki</p>
      </header>

      {/* Wallet Info */}
      <section className="admin-section">
        <h2 className="admin-section-title">Connected Wallet</h2>
        <div className="admin-wallet-info">
          <span className="admin-wallet-address">{address ? truncateAddress(address) : 'Not connected'}</span>
          <button className="admin-btn secondary" onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      </section>

      {/* Storage Management */}
      <section className="admin-section">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Local Storage</h2>
          <span className="admin-storage-total">Total: {formatBytes(totalSize)}</span>
        </div>

        {storageData.length === 0 ? (
          <p className="admin-empty-text">No Hamieverse data stored</p>
        ) : (
          <div className="admin-storage-list">
            {storageData.map(item => (
              <div key={item.key} className="admin-storage-item">
                <div className="admin-storage-info">
                  <span className="admin-storage-key">{item.key}</span>
                  <span className="admin-storage-meta">
                    {formatBytes(item.size)}
                    {item.items !== undefined && ` · ${item.items} items`}
                  </span>
                </div>
                <button
                  className="admin-btn danger small"
                  onClick={() => clearStorage(item.key)}
                >
                  Clear
                </button>
              </div>
            ))}
          </div>
        )}

        {storageData.length > 0 && (
          <button className="admin-btn danger" onClick={clearAllStorage}>
            Clear All Data
          </button>
        )}
      </section>

      {/* Quick Actions */}
      <section className="admin-section">
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="admin-actions">
          <button className="admin-btn" onClick={analyzeStorage}>
            Refresh Storage Info
          </button>
        </div>
      </section>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
