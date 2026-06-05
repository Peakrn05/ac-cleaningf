"use client";

import { Building2, Fan, FlaskConical, PanelsTopLeft, Sparkles, Wind } from "lucide-react";
import type { ComponentType } from "react";
import type { ServiceId } from "@/types/app/booking";

const ICONS: Record<ServiceId, ComponentType<{ className?: string }>> = {
  "split-1": Fan,
  "split-multi": Wind,
  cassette: PanelsTopLeft,
  central: Building2,
  "deep-clean": Sparkles,
  "chemical-wash": FlaskConical,
};

export default function ServiceIcon({ id, className = "w-5 h-5" }: { id: ServiceId; className?: string }) {
  const Icon = ICONS[id];
  return <Icon className={className} aria-hidden="true" />;
}
