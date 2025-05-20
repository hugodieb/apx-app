'use client'

import { useEffect } from "react"
import { useAuth } from '../../hooks/useAuth'
import { useClienteAuth } from "@/store/auth"

export function WhoAmISync() {
  const { whoami } = useAuth();
  const { user } = useClienteAuth();

  useEffect(() => {
    whoami();
  }, [whoami]);
  return null;
}
