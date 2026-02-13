'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="wiki-breadcrumb" aria-label="Breadcrumb navigation">
      <ol className="wiki-breadcrumb-list" role="list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="wiki-breadcrumb-item">
              {item.href && !isLast ? (
                <Link href={item.href} className="wiki-breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                <span className="wiki-breadcrumb-current" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="wiki-breadcrumb-sep" aria-hidden="true">/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
