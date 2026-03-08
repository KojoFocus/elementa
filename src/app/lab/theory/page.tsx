'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Theory-first flow removed — redirect to safety checklist directly
export default function TheoryRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/lab/safety'); }, [router]);
  return null;
}
