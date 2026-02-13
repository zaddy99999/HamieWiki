'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== previousPathname.current) {
      setIsTransitioning(true);

      // Short delay to allow exit animation
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsTransitioning(false);
        previousPathname.current = pathname;
      }, 150);

      return () => clearTimeout(timer);
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <div className={`page-transition ${isTransitioning ? 'transitioning' : 'visible'}`}>
      {displayChildren}
    </div>
  );
}
