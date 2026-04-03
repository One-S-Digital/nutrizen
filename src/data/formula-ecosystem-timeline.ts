import { Activity, FlaskConical, Gem, GitBranch, Heart } from "lucide-react";
import type { TimelineItem } from "@/components/ui/radial-orbital-timeline";

export const formulaEcosystemTimelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Magnesium",
    date: "Minerals",
    content:
      "Thoughtful mineral forms chosen for uptake and everyday tolerability - not filler doses on a label.",
    category: "Minerals",
    icon: FlaskConical,
    relatedIds: [3, 5],
    status: "completed",
    energy: 94,
  },
  {
    id: 2,
    title: "Zinc",
    date: "Trace",
    content:
      "Balanced alongside other nutrients so trace elements support real physiology, not isolated hype.",
    category: "Trace",
    icon: Gem,
    relatedIds: [3, 4],
    status: "completed",
    energy: 88,
  },
  {
    id: 3,
    title: "Cofactors",
    date: "Synergy",
    content:
      "Supportive compounds that improve transport, utilization, and how nutrients work together.",
    category: "Synergy",
    icon: GitBranch,
    relatedIds: [1, 2, 5],
    status: "completed",
    energy: 91,
  },
  {
    id: 4,
    title: "Support",
    date: "Whole body",
    content:
      "Complementary nutrients aligned with stress, recovery, and the demands of everyday life.",
    category: "Whole body",
    icon: Heart,
    relatedIds: [2, 5],
    status: "completed",
    energy: 86,
  },
  {
    id: 5,
    title: "Bioavail.",
    date: "Uptake",
    content:
      "Form and dose choices that respect digestion and absorption - so the formula works in practice.",
    category: "Uptake",
    icon: Activity,
    relatedIds: [1, 3, 4],
    status: "completed",
    energy: 96,
  },
];
