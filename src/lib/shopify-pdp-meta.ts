/** Parse Storefront API Metaobject `fields { key value }` into a map. */
export function metaobjectFieldsToMap(
  fields: { key: string; value: string | null }[] | undefined,
): Record<string, string> {
  const m: Record<string, string> = {};
  for (const f of fields ?? []) {
    if (f.key && f.value != null && String(f.value).length > 0) {
      m[f.key] = String(f.value);
    }
  }
  return m;
}

export type PdpFeaturedReview = {
  quote: string;
  author: string;
  customerSince: string | null;
};

export type PdpIngredientEntry = {
  commonName: string;
  botanicalName: string | null;
};

export type PdpTimelineMilestone = {
  stepNumber: number;
  stepLabel: string;
  cardTitle: string;
  body: string;
  benefits: string[];
  tip: string | null;
};

export function parseIngredientMetaobject(map: Record<string, string>): PdpIngredientEntry | null {
  const common = map.ingredient_name?.trim() || map.common_name?.trim() || map.name?.trim();
  if (!common) return null;
  const botanical =
    map.botanical_name?.trim() ||
    map.botanical?.trim() ||
    map.scientific_name?.trim() ||
    null;
  return { commonName: common, botanicalName: botanical || null };
}

export function parseTimelineMetaobject(map: Record<string, string>): PdpTimelineMilestone | null {
  const stepLabel = map.step_label?.trim();
  if (!stepLabel) return null;
  const n = parseInt(map.step_number ?? "0", 10);
  const stepNumber = Number.isFinite(n) && n > 0 ? n : 1;
  const cardTitle = map.card_title?.trim() || map.heading?.trim() || stepLabel;
  const body = map.card_description?.trim() || map.description?.trim() || map.body?.trim() || "";
  const benefitsRaw = map.benefits?.trim() ?? "";
  const benefits = benefitsRaw
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const tip = map.usage_tip?.trim() || map.tip?.trim() || null;
  return { stepNumber, stepLabel, cardTitle, body, benefits, tip };
}

type MetaobjectNode = {
  fields?: { key: string; value: string | null }[] | null;
};

export function parseIngredientReferences(
  edges: { node: MetaobjectNode | null }[] | undefined,
): PdpIngredientEntry[] {
  if (!edges?.length) return [];
  const out: PdpIngredientEntry[] = [];
  for (const e of edges) {
    const map = metaobjectFieldsToMap(e.node?.fields ?? undefined);
    const row = parseIngredientMetaobject(map);
    if (row) out.push(row);
  }
  return out;
}

export function parseTimelineReferences(
  edges: { node: MetaobjectNode | null }[] | undefined,
): PdpTimelineMilestone[] {
  if (!edges?.length) return [];
  const out: PdpTimelineMilestone[] = [];
  for (const e of edges) {
    const map = metaobjectFieldsToMap(e.node?.fields ?? undefined);
    const row = parseTimelineMetaobject(map);
    if (row) out.push(row);
  }
  out.sort((a, b) => a.stepNumber - b.stepNumber);
  return out;
}
