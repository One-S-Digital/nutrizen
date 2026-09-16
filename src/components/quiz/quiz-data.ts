export type Bucket =
  | "VIT_D"
  | "MAGNESIUM"
  | "IRON"
  | "ZINC"
  | "B_VITAMINS"
  | "ANTIOXIDANT"
  | "STRESS_LOAD"
  | "DIGESTIVE"
  | "BLOOD_SUGAR";

export interface Product {
  id: string;
  name: string;
  handle: string;
  price: number;
  compareAt: number | null;
  variantId: string;
  image: string;
  forms: string[];
  contains?: string[];
}

export interface QuestionOption {
  label: string;
  weights: Partial<Record<Bucket, number>>;
  exclusive?: boolean;
  magSubtype?: "complex" | "oxide";
}

export interface Question {
  id: string;
  n: number;
  eyebrow: string;
  headline: string;
  sub: string;
  type: "single" | "multi";
  options: QuestionOption[];
}

export interface SafetyState {
  ageBracket: string | null;
  pregnant: boolean;
  menstruating: boolean;
  vegetarian: boolean;
  lowIron: boolean;
  diabetesMed: boolean;
  thyroidMed: boolean;
  bpMed: boolean;
  bloodThinners: boolean;
}

export const DEFAULT_SAFETY: SafetyState = {
  ageBracket: null,
  pregnant: false,
  menstruating: false,
  vegetarian: false,
  lowIron: false,
  diabetesMed: false,
  thyroidMed: false,
  bpMed: false,
  bloodThinners: false,
};

export type Answers = Record<string, QuestionOption[]>;

// ---------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------
export const PRODUCTS: Record<string, Product> = {
  "vitamin-d3": {
    id: "vitamin-d3",
    name: "Vitamin D3 + Magnesium Glycinate",
    handle: "nutrizen-vitamin-d3-magnesium-glycinate",
    price: 269,
    compareAt: 330,
    variantId: "50127821570241",
    image: "/vitamin%20d3.png",
    forms: ["Cholecalciferol (Vitamin D3)", "Magnesium Glycinate"],
  },
  "magnesium-complex": {
    id: "magnesium-complex",
    name: "Magnesium Complex",
    handle: "nutrizen-magnesium-complex",
    price: 259,
    compareAt: 320,
    variantId: "49494653108417",
    image: "/magnesium%20complex.png",
    forms: ["Magnesium Bisglycinate", "Magnesium Citrate", "Magnesium Malate", "Magnesium Oxide"],
  },
  "magnesium-oxide": {
    id: "magnesium-oxide",
    name: "Magnesium Oxide",
    handle: "nutrizen-magnesium-oxide",
    price: 199,
    compareAt: null,
    variantId: "50127820357825",
    image: "/magnesium%20oxide.png",
    forms: ["Magnesium Oxide"],
  },
  "iron-plus": {
    id: "iron-plus",
    name: "Iron+",
    handle: "nutrizen-iron-plus-supplement",
    price: 269,
    compareAt: 320,
    variantId: "50129468162241",
    image: "/iron.png",
    forms: ["Iron Bisglycinate", "Buffered Vitamin C", "Spirulina", "Copper"],
  },
  "zinc-copper-selenium": {
    id: "zinc-copper-selenium",
    name: "Zinc + Copper & Selenium",
    handle: "nutrizen-zinc-copper-selenium",
    price: 199,
    compareAt: null,
    variantId: "50127822389441",
    image: "/zinc.png",
    forms: ["Zinc (Chelate / Glutamate / Oxide blend)", "Copper Chelate", "L-Selenomethionine"],
  },
  "vitacore-b-complex": {
    id: "vitacore-b-complex",
    name: "Vitacore B-Complex",
    handle: "nutrizen-vitacore-b-complex",
    price: 279,
    compareAt: 350,
    variantId: "50127821537473",
    image: "/vitacore.png",
    forms: ["All 8 B Vitamins", "Choline", "Inositol", "Taurine", "NAC"],
  },
  "glutathione-nac": {
    id: "glutathione-nac",
    name: "Glutathione Precursor + NAC",
    handle: "nutrizen-glutathione-precursor-nac",
    price: 279,
    compareAt: null,
    variantId: "50127819931841",
    image: "/glutathione.png",
    forms: ["NAC", "L-Cysteine", "L-Glycine", "L-Glutamine", "L-Lysine", "Milk Thistle"],
  },
  "adaptogen-plus": {
    id: "adaptogen-plus",
    name: "Adaptogen+ Complex",
    handle: "nutrizen-adaptogen-plus-complex",
    price: 279,
    compareAt: 320,
    variantId: "50127819243713",
    image: "/adaptogen.png",
    forms: ["Amla", "Ashwagandha", "Rhodiola", "Reishi", "Siberian Ginseng", "Astragalus"],
  },
  "metabol-plus": {
    id: "metabol-plus",
    name: "Metabol+",
    handle: "nutrizen-metabol-plus-improve-metabolism",
    price: 199,
    compareAt: 250,
    variantId: "50127821308097",
    image: "/metabol.png",
    forms: ["Fenugreek", "Carom (Ajwain)", "Fennel", "Ginger"],
  },
  cellunex: {
    id: "cellunex",
    name: "Cellunex – Insulin Support",
    handle: "nutrizen-cellunex-insulin-support",
    price: 399,
    compareAt: 550,
    variantId: "50127819636929",
    image: "/cellunex.png",
    forms: ["Bitter Melon", "Cinnamon Bark", "Gymnema", "Prebiotic Fibres", "Fermented Enzymes"],
  },
  bundle: {
    id: "bundle",
    name: "Daily Immunity & Recovery Stack",
    handle: "nutrizen-daily-immunity-recovery-stack",
    price: 674,
    compareAt: 749,
    variantId: "50129471602881",
    image: "/quiz-bundle.png",
    forms: ["Vitamin D3 + Magnesium Glycinate", "Zinc + Copper & Selenium", "Glutathione Precursor + NAC"],
    contains: ["vitamin-d3", "zinc-copper-selenium", "glutathione-nac"],
  },
};

// ---------------------------------------------------------------------
// Bucket metadata
// ---------------------------------------------------------------------
export const BUCKETS: Record<Bucket, { label: string; track: "deficiency" | "function"; product: string | null }> = {
  VIT_D: { label: "vitamin D", track: "deficiency", product: "vitamin-d3" },
  MAGNESIUM: { label: "magnesium", track: "deficiency", product: null },
  IRON: { label: "iron", track: "deficiency", product: "iron-plus" },
  ZINC: { label: "zinc", track: "deficiency", product: "zinc-copper-selenium" },
  B_VITAMINS: { label: "B vitamins", track: "deficiency", product: "vitacore-b-complex" },
  ANTIOXIDANT: { label: "an antioxidant reserve", track: "function", product: "glutathione-nac" },
  STRESS_LOAD: { label: "your stress load", track: "function", product: "adaptogen-plus" },
  DIGESTIVE: { label: "digestion", track: "function", product: "metabol-plus" },
  BLOOD_SUGAR: { label: "blood sugar", track: "function", product: "cellunex" },
};

// ---------------------------------------------------------------------
// Questions — 9 scored screens
// ---------------------------------------------------------------------
export const QUESTIONS: Question[] = [
  {
    id: "q1",
    n: 1,
    eyebrow: "01 · Where to start",
    headline: "What would you most like to *change*?",
    sub: "Pick the one that matters most right now — the questions that follow are what really shape your result.",
    type: "single",
    options: [
      { label: "Better sleep", weights: { MAGNESIUM: 4 } },
      { label: "Calmer stress levels", weights: { STRESS_LOAD: 4 } },
      { label: "Steadier energy", weights: { B_VITAMINS: 3, IRON: 2 } },
      { label: "Stronger immunity", weights: { VIT_D: 3, ZINC: 2 } },
      { label: "Smoother digestion", weights: { DIGESTIVE: 4 } },
      { label: "Fewer sugar crashes and cravings", weights: { BLOOD_SUGAR: 4 } },
      { label: "Clearer skin, hair and nails", weights: { ZINC: 3, IRON: 1 } },
      { label: "Not sure — I just don't feel like myself", weights: {}, exclusive: true },
    ],
  },
  {
    id: "q2",
    n: 2,
    eyebrow: "02 · Energy & sleep",
    headline: "How are you *sleeping* — and waking?",
    sub: "Pick everything that applies.",
    type: "multi",
    options: [
      { label: "Exhausted despite sleeping enough", weights: { IRON: 3 } },
      { label: "Trouble falling asleep, mind won't switch off", weights: { MAGNESIUM: 3 } },
      { label: "Afternoon energy crash, most days", weights: { B_VITAMINS: 3 } },
      { label: "Low mood that's worse in the darker months", weights: { VIT_D: 3 } },
      { label: "Wake up and still feel flattened", weights: { IRON: 2, B_VITAMINS: 2 } },
      { label: "None of these", weights: {}, exclusive: true },
    ],
  },
  {
    id: "q3",
    n: 3,
    eyebrow: "03 · Mood & focus",
    headline: "What does your head feel like *most days*?",
    sub: "Pick everything that applies.",
    type: "multi",
    options: [
      { label: "Wired but exhausted at the same time", weights: { STRESS_LOAD: 4 } },
      { label: "Tension headaches", weights: { MAGNESIUM: 3 } },
      { label: "Anxious, or permanently “switched on”", weights: { STRESS_LOAD: 3, MAGNESIUM: 2 } },
      { label: "Brain fog, losing words mid-sentence", weights: { B_VITAMINS: 3 } },
      { label: "Wake around 3am and can't switch off again", weights: { STRESS_LOAD: 3 } },
      { label: "Irritable over small things that wouldn't normally bother you", weights: { B_VITAMINS: 2, MAGNESIUM: 2 } },
      { label: "Motivation feels flat", weights: { STRESS_LOAD: 3 } },
      { label: "None of these", weights: {}, exclusive: true },
    ],
  },
  {
    id: "q4",
    n: 4,
    eyebrow: "04 · Body signals",
    headline: "Any of these sound *familiar*?",
    sub: "Pick everything that applies.",
    type: "multi",
    options: [
      { label: "Cramp in my calves at night", weights: { MAGNESIUM: 4 }, magSubtype: "complex" },
      { label: "Eyelid or muscle twitching", weights: { MAGNESIUM: 4 }, magSubtype: "complex" },
      { label: "Cold hands and feet, always", weights: { IRON: 3 } },
      { label: "Out of breath going up stairs", weights: { IRON: 4 } },
      { label: "Dizzy when I stand up too fast", weights: { IRON: 3 } },
      { label: "Aching bones or lower back, no injury", weights: { VIT_D: 3 } },
      { label: "Restless legs in the evening", weights: { MAGNESIUM: 3, IRON: 2 }, magSubtype: "complex" },
      { label: "Heart flutters or skips a beat", weights: { MAGNESIUM: 2 }, magSubtype: "complex" },
      { label: "Muscle weakness that's new", weights: { VIT_D: 2 } },
      { label: "Cramping before my period", weights: { MAGNESIUM: 2 }, magSubtype: "complex" },
      { label: "None of these", weights: {}, exclusive: true },
    ],
  },
  {
    id: "q5",
    n: 5,
    eyebrow: "05 · Skin, hair & nails",
    headline: "What's changed on the *outside*?",
    sub: "Pick everything that applies.",
    type: "multi",
    options: [
      { label: "Cuts and grazes heal slowly", weights: { ZINC: 4 } },
      { label: "Food doesn't taste like it used to", weights: { ZINC: 4 } },
      { label: "Persistent breakouts that won't clear", weights: { ZINC: 3 } },
      { label: "White spots on my nails", weights: { ZINC: 3 } },
      { label: "Brittle, ridged, or spoon-shaped nails", weights: { IRON: 3, ZINC: 2 } },
      { label: "Noticeable hair shedding", weights: { IRON: 2, ZINC: 2 } },
      { label: "Mouth ulcers or cracked corners of the mouth", weights: { B_VITAMINS: 4 } },
      { label: "Sore, smooth, or unusually red tongue", weights: { B_VITAMINS: 4 } },
      { label: "Pins and needles in hands or feet", weights: { B_VITAMINS: 4 } },
      { label: "None of these", weights: {}, exclusive: true },
    ],
  },
  {
    id: "q6",
    n: 6,
    eyebrow: "06 · Immunity",
    headline: "How often do you get *knocked down*?",
    sub: "Pick everything that applies.",
    type: "multi",
    options: [
      { label: "Colds that linger or come back quickly", weights: { ZINC: 3, VIT_D: 3 } },
      { label: "Slow to recover after training or illness", weights: { ANTIOXIDANT: 2 } },
      { label: "Still feel flat, weeks after being sick", weights: { ANTIOXIDANT: 3 } },
      { label: "Chest congestion or mucus that won't shift", weights: { ANTIOXIDANT: 3 } },
      { label: "Skin that's lost its usual glow, with no change in routine", weights: { ANTIOXIDANT: 2 } },
      { label: "Slow wound healing", weights: { VIT_D: 2, ZINC: 2 } },
      { label: "None of these", weights: {}, exclusive: true },
    ],
  },
  {
    id: "q7",
    n: 7,
    eyebrow: "07 · Digestion",
    headline: "How does your stomach handle *food*?",
    sub: "Pick everything that applies.",
    type: "multi",
    options: [
      { label: "Bloated after most meals", weights: { DIGESTIVE: 4 } },
      { label: "Excess gas, most days", weights: { DIGESTIVE: 3 } },
      { label: "Heartburn or reflux", weights: { DIGESTIVE: 3 } },
      { label: "Heavy and sluggish after eating", weights: { DIGESTIVE: 3 } },
      { label: "Constipation or irregularity is the main issue", weights: { MAGNESIUM: 3, DIGESTIVE: 2 }, magSubtype: "oxide" },
      { label: "None of these", weights: {}, exclusive: true },
    ],
  },
  {
    id: "q8",
    n: 8,
    eyebrow: "08 · Appetite & cravings",
    headline: "What does your body *ask for*?",
    sub: "Pick everything that applies.",
    type: "multi",
    options: [
      { label: "Strong sugar cravings, especially afternoons", weights: { BLOOD_SUGAR: 4 } },
      { label: "Shaky or irritable if I don't eat on time", weights: { BLOOD_SUGAR: 4 } },
      { label: "Crash 2–3 hours after eating", weights: { BLOOD_SUGAR: 4 } },
      { label: "Energy swings up and down all day", weights: { BLOOD_SUGAR: 3 } },
      { label: "Weight gathering around my middle", weights: { BLOOD_SUGAR: 3 } },
      { label: "Low appetite most days", weights: { ZINC: 2 } },
      { label: "Craving ice, soil, or chalk", weights: { IRON: 5 } },
      { label: "None of these", weights: {}, exclusive: true },
    ],
  },
  {
    id: "q9",
    n: 9,
    eyebrow: "09 · Your day",
    headline: "A few things about how you *live*.",
    sub: "Pick everything that applies.",
    type: "multi",
    options: [
      { label: "Mostly indoors, little midday sun", weights: { VIT_D: 3 } },
      { label: "Naturally darker skin tone", weights: { VIT_D: 2 } },
      { label: "Vegetarian or vegan", weights: { IRON: 2, B_VITAMINS: 3 } },
      { label: "On metformin, or long-term acid blockers (PPIs / antacids)", weights: { B_VITAMINS: 4 } },
      { label: "Regular alcohol, most weeks", weights: { B_VITAMINS: 3, ANTIOXIDANT: 2, MAGNESIUM: 2 } },
      { label: "Rely on caffeine to function", weights: { STRESS_LOAD: 3 } },
      { label: "Train hard or sweat heavily", weights: { MAGNESIUM: 2 }, magSubtype: "complex" },
      { label: "Smoke or vape", weights: { ANTIOXIDANT: 4 } },
      { label: "Regular exposure to pollution, dust, or fumes", weights: { ANTIOXIDANT: 3 } },
      { label: "Take paracetamol / acetaminophen often", weights: { ANTIOXIDANT: 2 } },
      { label: "Over 50", weights: { B_VITAMINS: 2 } },
      { label: "Cold all the time, and slowly gaining weight", weights: { ZINC: 3 } },
      { label: "Family history of type 2 diabetes", weights: { BLOOD_SUGAR: 3 } },
      { label: "Living with PCOS", weights: { BLOOD_SUGAR: 3 } },
      { label: "None of these", weights: {}, exclusive: true },
    ],
  },
];

export const SAFETY_QUESTION = {
  id: "safety",
  n: 10,
  eyebrow: "10 · Before we finish",
  headline: "So we don't suggest something that *clashes*.",
  sub: "This never affects your result above — it only checks what's safe to recommend.",
  age: {
    label: "Age bracket",
    options: ["Under 18", "18–49", "50 and over"],
  },
  flags: [
    { key: "pregnant", label: "Pregnant, or breastfeeding" },
    { key: "menstruating", label: "Currently menstruating, with regular or heavy periods" },
    { key: "vegetarian", label: "Vegetarian or vegan" },
    { key: "lowIron", label: "Previously told by a doctor you're low in iron" },
    { key: "diabetesMed", label: "On medication for diabetes" },
    { key: "thyroidMed", label: "On medication for a thyroid condition" },
    { key: "bpMed", label: "On medication for blood pressure" },
    { key: "bloodThinners", label: "On blood thinners" },
  ] as const,
};

// ---------------------------------------------------------------------
// Result copy
// ---------------------------------------------------------------------
export const TRACK_LINE: Record<Bucket, string> = {
  VIT_D: "Your answers line up with the pattern people show when vitamin D is running low.",
  MAGNESIUM: "Your answers line up with the pattern people show when magnesium is running low.",
  IRON: "Your answers line up with the pattern people show when iron is running low.",
  ZINC: "Your answers line up with the pattern people show when zinc is running low.",
  B_VITAMINS: "Your answers line up with the pattern people show when B vitamins are running low.",
  ANTIOXIDANT: "Your answers point to an antioxidant reserve your body is burning through faster than it's rebuilding.",
  STRESS_LOAD: "Your answers point to a stress load your body is struggling to buffer.",
  DIGESTIVE: "Your answers point to a digestive process that's running slower than it should.",
  BLOOD_SUGAR: "Your answers point to blood sugar swinging harder than it should through the day.",
};

export const WHY_COPY: Record<string, string> = {
  VIT_D:
    "Vitamin D isn't really a vitamin — it behaves more like a hormone, and your skin only makes it from direct, unfiltered sunlight on bare skin. South Africa gets plenty of sun, but an indoor, sun-avoidant working week doesn't reach it, and higher melanin needs substantially longer exposure to synthesise the same amount. The result is a sunny country with widespread low vitamin D. It's involved in immune signalling, mood regulation, and muscle function — which is why a shortfall shows up as colds, low winter mood, and aches that don't map to any injury.",
  MAGNESIUM_COMPLEX:
    "Magnesium runs over 300 enzyme reactions, including the ones that switch your nervous system from “on” to “off.” It's also the mineral most reliably depleted by stress, caffeine, alcohol, and hard training — all of which increase how much you excrete — and modern soil supplies less of it than it used to. Low magnesium rarely announces itself with one symptom; it shows up as a cluster: tight muscles, a mind that won't switch off, and cramping that seems to come from nowhere.",
  MAGNESIUM_OXIDE:
    "Magnesium oxide is the least-absorbed form of magnesium, and that's precisely the point here: what your body doesn't take up stays in the digestive tract and draws water in with it, which is what makes it useful for slow, irregular digestion. It's a simpler formula than the Complex — one well-understood compound, at a dose sized for regularity rather than sleep or muscle recovery.",
  IRON:
    "Iron carries oxygen — every red blood cell depends on it, which is why a shortfall shows up everywhere at once: breathlessness on stairs, cold hands, brittle nails, a tiredness that sleep doesn't fix. But iron is also the one mineral where more isn't automatically better — it accumulates in the body, and supplementing without a confirmed deficiency isn't neutral. That's why we ask a few more questions before recommending it outright.",
  ZINC:
    "Zinc is a cofactor in immune defence, wound repair, and the enzymes that maintain taste and smell — which is why a shortfall shows up as colds that linger, cuts that heal slowly, or food that tastes duller than it should. Taking zinc alone, especially at a meaningful dose, depletes copper — so this formula includes copper and selenium alongside it. Same transparency principle as everything else here: show the whole mechanism, not just the headline mineral.",
  B_VITAMINS:
    "The B vitamins run the reactions that turn food into usable energy and keep the nervous system insulated, which is why a shortfall reads as brain fog, mouth ulcers, or an afternoon crash no amount of coffee fixes. Two things deplete B12 specifically, and almost nobody asks about them: long-term acid blockers (PPIs, antacids) and metformin. Both quietly reduce how much B12 you absorb, over months — worth knowing if either applies to you.",
  ANTIOXIDANT:
    "Glutathione is your body's own master antioxidant — you don't eat it directly, you manufacture it, from NAC, glycine, and glutamine. Smoking, pollution, heavy alcohol, and even routine paracetamol use all burn through those raw materials faster than an average diet replaces them. This isn't a deficiency in the way a mineral can be low; it's a reserve that's more depleted than replenished. The formula supplies the precursors, not the antioxidant itself — that's the form your body can actually use.",
  STRESS_LOAD:
    "This isn't about being deficient in ashwagandha — nobody is. It's about a stress load your body is struggling to buffer: cortisol staying elevated longer than it should, which shows up as wired-but-exhausted days, waking at 3am, and motivation that's gone flat. Adaptogens don't sedate; they help the stress response return to baseline faster. Two of the herbs in this formula carry a caution — licorice root can raise blood pressure, and ashwagandha needs care with thyroid medication — which is why we check for both first.",
  DIGESTIVE:
    "Bloating, heaviness after meals, and sluggish digestion are usually a function problem, not a deficiency — the digestive process itself is running slow. Fenugreek, ajwain, fennel, and ginger are a genuinely old combination for this, used across South Asian cooking for centuries specifically after heavy meals. This formula supports the process; it isn't a substitute for investigating a cause if the pattern is severe or persistent.",
  BLOOD_SUGAR:
    "Sugar cravings, a crash two to three hours after eating, and energy that swings through the day usually point to blood sugar spiking and dropping harder than it should — not to willpower. Bitter melon and gymnema are two of the more researched botanicals for insulin sensitivity, alongside cinnamon and a prebiotic fibre blend that slows glucose absorption. If you're already on medication for blood sugar, this can plausibly stack with it in ways worth discussing with your doctor first — hypoglycaemia from stacking is a real risk, not a formality.",
  BUNDLE:
    "Vitamin D, zinc, and glutathione precursors cover three separate systems — hormonal, mineral, and antioxidant — that all show up under the same umbrella symptom: getting knocked down easily and taking too long to recover. Your answers cleared the pattern on at least two of the three, which is exactly what this bundle is built for. It's priced at what the three would cost with the bundle discount applied — not marked up and then discounted back down.",
};

interface TimelineStage {
  heading: string;
  bullets: string[];
  tip: string;
}
interface Timeline {
  week1: TimelineStage;
  weeks23: TimelineStage;
  month1: TimelineStage;
}

export const TIMELINES: Record<string, Timeline> = {
  "vitamin-d3": {
    week1: { heading: "The first week", bullets: ["No dramatic shift yet — vitamin D builds up in fat stores gradually.", "Some people notice slightly better mood within the first few days.", "Take it with a meal that has some fat in it — it's fat-soluble and absorbs poorly on an empty stomach."], tip: "Morning, with breakfast, is easier to remember than “with a meal” left open-ended." },
    weeks23: { heading: "Weeks 2–3", bullets: ["Levels are climbing but not yet at a steady state.", "Aches from low vitamin D are often the first thing to ease.", "Immune resilience typically improves before mood does."], tip: "Pair with the magnesium already in this formula — it's required to activate vitamin D in the body." },
    month1: { heading: "Month 1 and beyond", bullets: ["Blood levels typically plateau by 8–12 weeks of consistent daily use.", "A good point to re-test if you started from a confirmed low result.", "Ongoing use matters more in low-sun months than high-sun ones."], tip: "A repeat blood test is the only way to know your actual level — not the quiz." },
  },
  "magnesium-complex": {
    week1: { heading: "The first week", bullets: ["Muscle relaxation is usually the fastest effect — cramps and twitching often ease within days.", "Sleep may feel deeper before it feels longer.", "Some people get mild loosening of stool as the gut adjusts; that settles."], tip: "Take it 30–60 minutes before bed if sleep is the main goal." },
    weeks23: { heading: "Weeks 2–3", bullets: ["Tension headaches, if magnesium-related, typically reduce in this window.", "A wound-down nervous system starts to feel less reactive to stress.", "PMS cramping, if applicable, is usually noticeably softer by the next cycle."], tip: "Reduce caffeine after 2pm — it actively depletes magnesium." },
    month1: { heading: "Month 1 and beyond", bullets: ["Muscle recovery after training improves as tissue magnesium stores refill.", "Most people find their effective dose and don't need to increase it further.", "If cramping was severe and doesn't improve, it's worth a blood test."], tip: "No need to cycle — this is a maintenance mineral, not a stimulant." },
  },
  "magnesium-oxide": {
    week1: { heading: "The first week", bullets: ["Effects on regularity are usually the fastest in this range — often within 24–48 hours.", "Start at the labelled dose; more can overshoot into looseness.", "Take with water, at the same time each day."], tip: "Mornings tend to work with the body's natural digestive rhythm." },
    weeks23: { heading: "Weeks 2–3", bullets: ["Regularity typically settles into a predictable pattern.", "If cramping or sleep issues persist alongside it, Magnesium Complex may be the better long-term fit.", "Fibre and water intake still matter — this supports the mechanism, it doesn't replace them."], tip: "No difference by week 2? Check fluid intake first." },
    month1: { heading: "Month 1 and beyond", bullets: ["Most people find a stable, comfortable rhythm by this point.", "Ongoing use is fine — oxide isn't associated with the dependency seen with stimulant laxatives.", "If symptoms shift toward cramping, sleep, or stress, that's a signal to reassess against the Complex."], tip: "Reassess in a month rather than switching formulas early." },
  },
  "iron-plus": {
    week1: { heading: "The first week", bullets: ["Iron repletion is slow — don't expect a first-week difference; blood cell turnover takes weeks.", "Take on an empty stomach if tolerated, with vitamin C to help absorption (already included).", "Avoid taking alongside coffee, tea, or calcium — all block absorption."], tip: "This formula's bisglycinate form is gentler on digestion than standard ferrous sulfate." },
    weeks23: { heading: "Weeks 2–3", bullets: ["Energy is usually still unchanged here — that's expected, not a sign it isn't working.", "The right window to have already booked a confirming blood test, if you haven't.", "Nail and hair changes, if iron-related, take longer than this to show."], tip: "Retest ferritin at 8–12 weeks, not sooner — it moves slowly." },
    month1: { heading: "Month 1 and beyond", bullets: ["Typically when people first notice a real energy shift, if iron was genuinely low.", "Breathlessness on exertion is usually one of the later symptoms to resolve.", "Nothing changed by 8 weeks? The cause likely isn't iron — worth a full blood panel."], tip: "Iron repletion is measured in months, not weeks." },
  },
  "zinc-copper-selenium": {
    week1: { heading: "The first week", bullets: ["Taste and smell, if dulled, are sometimes the first things to sharpen.", "Take with food — zinc on an empty stomach can cause nausea.", "Don't take alongside a calcium or iron supplement at the same time — they compete for absorption."], tip: "Evenings with dinner work well if mornings already have other supplements." },
    weeks23: { heading: "Weeks 2–3", bullets: ["Skin healing typically speeds up — cuts and breakouts resolve faster.", "Immune resilience to the next minor bug is usually noticeably better.", "Copper status stays protected because this formula includes it alongside the zinc."], tip: "More zinc isn't more benefit past a point — it actively works against copper." },
    month1: { heading: "Month 1 and beyond", bullets: ["Nail changes (white spots, ridging) take a full growth cycle to show — longer than a month.", "Ongoing use through cold-and-flu season is where this earns its keep most.", "No change to skin or healing by 8 weeks? Zinc likely wasn't the limiting factor."], tip: "Reassess against the full symptom list, not one signal alone." },
  },
  "vitacore-b-complex": {
    week1: { heading: "The first week", bullets: ["Energy from B vitamins is often felt fast — sometimes within days — since they're water-soluble.", "Urine may turn brighter yellow; that's riboflavin (B2), harmless.", "Take in the morning — B vitamins are mildly stimulating for some people."], tip: "With food reduces the rare chance of mild stomach upset." },
    weeks23: { heading: "Weeks 2–3", bullets: ["Afternoon energy crashes typically become less severe.", "Brain fog, if B12-related, is usually one of the slower symptoms to lift.", "Mouth ulcers or cracked corners, if present, usually heal in this window."], tip: "On metformin or long-term antacids? Expect this to take longer — ongoing depletion works against you." },
    month1: { heading: "Month 1 and beyond", bullets: ["Mood and focus improvements, where B12/folate were the driver, are typically clearest by now.", "A reasonable point to retest B12 if you started from a known low result.", "Long-term use is genuinely low-risk — excess B vitamins are simply excreted, not stored."], tip: "Worth taking indefinitely if you're vegetarian, vegan, or on the medications above." },
  },
  "glutathione-nac": {
    week1: { heading: "The first week", bullets: ["No dramatic shift expected — this replenishes a reserve, it doesn't create an immediate effect.", "Take consistently, same time each day, away from other supplements that compete for absorption.", "Mild detox-type symptoms (slight headache, fatigue) are possible early on and usually pass."], tip: "Hydration matters more than usual in the first week." },
    weeks23: { heading: "Weeks 2–3", bullets: ["Recovery time after training or minor illness often starts to shorten.", "Skin that looked dull sometimes brightens in this window.", "Chest congestion or lingering mucus, if oxidative-load related, often eases."], tip: "Reducing the load (less smoking, less pollution exposure) works with this, not instead of it." },
    month1: { heading: "Month 1 and beyond", bullets: ["Typically when people report feeling less “flat” after minor illness or exertion.", "Makes most sense long-term if the underlying exposure is ongoing too.", "Lifestyle changed already? The formula matters less over time — a good problem to have."], tip: "Pairs logically with reducing the exposure that depleted the reserve in the first place." },
  },
  "adaptogen-plus": {
    week1: { heading: "The first week", bullets: ["Adaptogens build gradually — most people don't feel a dramatic shift in week one.", "Take in the morning; ginseng-family herbs can be mildly energising late in the day.", "Mild digestive adjustment in the first few days is common and usually settles."], tip: "Pair with one lifestyle lever (sleep, caffeine timing) for a faster combined effect." },
    weeks23: { heading: "Weeks 2–3", bullets: ["The “wired but exhausted” feeling is often the first thing to soften.", "Sleep disrupted by 3am waking sometimes starts to consolidate.", "Stress reactivity — how fast small things rattle you — often eases here."], tip: "On thyroid medication or have high blood pressure? This formula isn't right for you — exactly why we check first." },
    month1: { heading: "Month 1 and beyond", bullets: ["Resilience under sustained stress is usually the clearest change — a steadier response, not an absence of stress.", "Flat motivation often returns gradually rather than suddenly.", "Works better alongside the stress load actually reducing, not as a substitute for that."], tip: "Reassess in a month — adaptogens are not a fast-acting category." },
  },
  "metabol-plus": {
    week1: { heading: "The first week", bullets: ["Effects are often felt meal-to-meal — take it with the meal you struggle with most.", "Bloating and heaviness after eating are usually the first things to ease.", "Ginger and fennel are also useful standalone if one specific meal is the problem."], tip: "The biggest single meal of the day is where this usually earns its keep most." },
    weeks23: { heading: "Weeks 2–3", bullets: ["A pattern usually emerges: which meals still cause trouble, and which don't.", "Gas and heaviness typically continue to improve.", "Reflux persisting past this point is worth ruling out a cause beyond digestion generally."], tip: "This supports digestion — it isn't a substitute for identifying a trigger food if one exists." },
    month1: { heading: "Month 1 and beyond", bullets: ["Most people have a good sense by now of whether this is solving the problem or just easing it.", "Digestion that's “slow” rather than acutely uncomfortable often needs more than a month.", "Reassess against fibre, water, and meal timing — the formula works with these, not instead of them."], tip: "Keep a rough note of which meals trigger symptoms — the fastest way to find the real cause." },
  },
  cellunex: {
    week1: { heading: "The first week", bullets: ["Some people notice fewer sharp cravings within the first week.", "Take before your largest or most carb-heavy meal, per label guidance.", "On diabetes medication? Have that conversation with your doctor this week, before continuing."], tip: "Pair with protein at the start of a meal — it blunts the same spike this formula targets." },
    weeks23: { heading: "Weeks 2–3", bullets: ["The 2–3 hour post-meal crash, if present, often becomes less severe.", "Energy swings through the day typically start to flatten out.", "Cravings for sugar specifically tend to ease before general appetite does."], tip: "Consistency matters more than dose here — skipping days blunts the effect." },
    month1: { heading: "Month 1 and beyond", bullets: ["A reasonable point to reassess energy stability across a full week.", "Weight changes, if any, are usually secondary to the energy and craving effects.", "Nothing shifted? Worth investigating with a doctor rather than increasing the dose."], tip: "A supporting formula, not a substitute for medical management of diagnosed blood sugar conditions." },
  },
  bundle: {
    week1: { heading: "The first week", bullets: ["Vitamin D and zinc start building reserves immediately; glutathione precursors need consistent daily use.", "Take all three with a meal that includes some fat, for the vitamin D.", "No dramatic shift expected yet — this bundle is about resilience, not a fast fix."], tip: "Same time, same meal, every morning — the easiest way to stay consistent with three products." },
    weeks23: { heading: "Weeks 2–3", bullets: ["Colds, if they come, are often shorter or milder — zinc and vitamin D working together on immune signalling.", "Recovery after training or minor illness starts to feel less flat.", "Skin and general energy are often the first subjective changes people report."], tip: "This is the exact combination the bundle exists for." },
    month1: { heading: "Month 1 and beyond", bullets: ["Immune and recovery effects typically compound here — fewer knock-downs, faster bounce-back.", "A good point to reassess whether all three are still earning their place.", "Ongoing use through higher-exposure months (winter, travel, heavy training) is where this earns its keep most."], tip: "Energy and recovery improving but immunity not? The antioxidant load may be the real story — worth continuing that one alone." },
  },
};

export const GATE_COPY = {
  ironBlocked:
    "Your answers are consistent with the pattern of low iron — but iron is the one mineral where more isn't automatically better, since it accumulates in the body. Before recommending it outright, confirm with a ferritin and full blood count. In the meantime, B vitamins are a safe adjacent option: B12 and folate deficiency produce a near-identical fatigue-and-pallor picture, with no accumulation risk.",
  adaptogenBlocked:
    "Adaptogen+ contains licorice root, which can raise blood pressure, and ashwagandha, which needs care alongside thyroid medication. Since that applies to you, we've routed you to Magnesium Complex instead — it addresses the same wired-but-exhausted pattern through a different mechanism.",
  cellunexCaution:
    "You mentioned you're on medication for blood sugar. Cellunex may improve insulin sensitivity, which means it can plausibly stack with that medication — please discuss it with your doctor before starting, rather than adding it to your cart today.",
  pregnancyBanner:
    "Because you're pregnant, breastfeeding, or under 18, we're not going to recommend adding anything to your cart here. The pattern below is still worth knowing — but the right next step is a conversation with your doctor or midwife, not a supplement order.",
  fallback: "Nothing stood out strongly, so we've gone with what you told us at the start you want to change.",
};

export const FOOTER_COPY = [
  "This is a wellness guide, not a medical assessment.",
  "Symptoms overlap across many possible causes — this is a pattern match, not a diagnosis.",
  "If iron, vitamin D, or B12 came up strongly, confirm with a blood test before treating it as settled.",
  "Speak to a doctor if symptoms persist.",
];

export const INTRO_COPY = {
  eyebrow: "NutriZen · 90 seconds",
  headline: "Find out what your body is *running low* on.",
  body: "Ten short questions about how you've been feeling. At the end we'll tell you which nutrients your symptoms point to, and why.",
  disclaimer: "This is a wellness guide, not a medical assessment.",
  cta: "Start",
};

export const EMAIL_GATE_COPY = {
  headline: "Your results are *ready*.",
  body: "Tell us where to send them. You'll see your full breakdown on screen right after, plus a copy to keep.",
  consentRequired: "I agree to NutriZen storing my answers, including health-related responses, to generate and send my results.",
  consentOptional: "Send me occasional wellness emails.",
  cta: "See my results",
};

// ---------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------
function computeMaxPossible(): Record<string, number> {
  const max: Record<string, number> = {};
  QUESTIONS.forEach((q) => {
    if (q.type === "single") {
      const bestPerBucket: Record<string, number> = {};
      q.options.forEach((opt) => {
        Object.keys(opt.weights).forEach((b) => {
          bestPerBucket[b] = Math.max(bestPerBucket[b] || 0, opt.weights[b as Bucket] || 0);
        });
      });
      Object.keys(bestPerBucket).forEach((b) => {
        max[b] = (max[b] || 0) + bestPerBucket[b] * 1.5;
      });
    } else {
      q.options.forEach((opt) => {
        if (opt.exclusive) return;
        Object.keys(opt.weights).forEach((b) => {
          max[b] = (max[b] || 0) + (opt.weights[b as Bucket] || 0);
        });
      });
    }
  });
  return max;
}

const MAX_POSSIBLE = computeMaxPossible();

interface Contribution {
  label: string;
  weight: number;
}

interface ScoreResult {
  raw: Record<string, number>;
  normalized: Record<string, number>;
  magSub: { complex: number; oxide: number };
  contributions: Record<string, Contribution[]>;
}

export function score(answers: Answers): ScoreResult {
  const raw: Record<string, number> = {};
  const magSub = { complex: 0, oxide: 0 };
  const contributions: Record<string, Contribution[]> = {};

  Object.keys(answers).forEach((qId) => {
    const picks = answers[qId] || [];
    const multiplier = qId === "q1" ? 1.5 : 1;
    picks.forEach((opt) => {
      Object.keys(opt.weights).forEach((bucket) => {
        const w = (opt.weights[bucket as Bucket] || 0) * multiplier;
        raw[bucket] = (raw[bucket] || 0) + w;
        contributions[bucket] = contributions[bucket] || [];
        contributions[bucket].push({ label: opt.label, weight: w });
      });
      if (opt.magSubtype) {
        magSub[opt.magSubtype] += (opt.weights.MAGNESIUM || 0) * multiplier;
      }
    });
  });

  const normalized: Record<string, number> = {};
  (Object.keys(BUCKETS) as Bucket[]).forEach((b) => {
    normalized[b] = MAX_POSSIBLE[b] ? (raw[b] || 0) / MAX_POSSIBLE[b] : 0;
  });

  return { raw, normalized, magSub, contributions };
}

export function tierLabel(n: number): string {
  if (n >= 0.65) return "strong pattern";
  if (n >= 0.45) return "clear pattern";
  return "early signs";
}

function topContributions(contributions: Record<string, Contribution[]>, bucket: string, count: number): string[] {
  const list = (contributions[bucket] || []).slice().sort((a, b) => b.weight - a.weight);
  const seen: Record<string, boolean> = {};
  const out: string[] = [];
  for (let i = 0; i < list.length && out.length < count; i++) {
    if (!seen[list[i].label]) {
      seen[list[i].label] = true;
      out.push(list[i].label);
    }
  }
  return out;
}

export function joinNatural(list: string[]): string {
  if (list.length === 0) return "";
  if (list.length === 1) return list[0].toLowerCase();
  if (list.length === 2) return list[0].toLowerCase() + " and " + list[1].toLowerCase();
  return list.slice(0, -1).map((s) => s.toLowerCase()).join(", ") + ", and " + list[list.length - 1].toLowerCase();
}

export interface ResultItem {
  bucket: string;
  role: "primary" | "supporting" | "addon";
  productId: string;
  product: Product;
  tier: string;
  normalized: number;
  track: "deficiency" | "function";
  trackLine: string;
  why: string;
  timeline: Timeline;
  echo: string[];
  gated: keyof typeof GATE_COPY | null;
  addToCartDisabled: boolean;
  redirectTo?: Bucket;
  redirectedFrom?: Bucket;
  bundleHits?: string[];
  freeDeliveryAddon?: boolean;
  isIronSafeAlternative?: boolean;
}

export interface QuizResult {
  items: ResultItem[];
  isFallback: boolean;
  globalCartBlocked: boolean;
  normalized: Record<string, number>;
}

export function buildResult(answers: Answers, safety: SafetyState): QuizResult {
  const s = score(answers);
  const ELIGIBLE = 0.35;
  const PRIMARY_MIN = 0.45;

  const order = (Object.keys(BUCKETS) as Bucket[]).sort((a, b) => s.normalized[b] - s.normalized[a]);
  const eligible = order.filter((b) => s.normalized[b] >= ELIGIBLE);

  let isFallback = false;
  let primaryBucket: Bucket | null = eligible.length && s.normalized[eligible[0]] >= PRIMARY_MIN ? eligible[0] : null;
  let supportingBuckets: Bucket[] = [];

  if (!primaryBucket) {
    isFallback = true;
    const q1picks = (answers.q1 || [])[0];
    const q1Bucket = q1picks ? (Object.keys(q1picks.weights)[0] as Bucket | undefined) : undefined;
    primaryBucket = q1Bucket || eligible[0] || "MAGNESIUM";
    supportingBuckets = eligible.filter((b) => b !== primaryBucket).slice(0, 2);
  } else {
    supportingBuckets = eligible.filter((b) => b !== primaryBucket).slice(0, 2);
  }

  const bundleTrio: Bucket[] = ["VIT_D", "ZINC", "ANTIOXIDANT"];
  const bundleHits = bundleTrio.filter((b) => s.normalized[b] >= ELIGIBLE);
  const bundleTriggered = bundleHits.length >= 2;

  function resolveProduct(bucket: Bucket): string {
    if (bucket === "MAGNESIUM") {
      if (s.magSub.oxide > s.magSub.complex) return "magnesium-oxide";
      return "magnesium-complex";
    }
    return BUCKETS[bucket].product as string;
  }

  function buildItem(bucket: Bucket, role: ResultItem["role"]): ResultItem {
    const productId = resolveProduct(bucket);
    const product = PRODUCTS[productId];
    const whyKey = bucket === "MAGNESIUM" ? (productId === "magnesium-oxide" ? "MAGNESIUM_OXIDE" : "MAGNESIUM_COMPLEX") : bucket;
    const item: ResultItem = {
      bucket,
      role,
      productId,
      product,
      tier: tierLabel(s.normalized[bucket]),
      normalized: s.normalized[bucket],
      track: BUCKETS[bucket].track,
      trackLine: TRACK_LINE[bucket],
      why: WHY_COPY[whyKey],
      timeline: TIMELINES[productId],
      echo: topContributions(s.contributions, bucket, 3),
      gated: null,
      addToCartDisabled: false,
    };

    if (bucket === "IRON") {
      const qualifies = !!safety.menstruating || !!safety.pregnant || !!safety.vegetarian || !!safety.lowIron;
      if (!qualifies) {
        item.gated = "ironBlocked";
        item.addToCartDisabled = true;
      }
    }
    if (bucket === "STRESS_LOAD") {
      if (safety.bpMed || safety.thyroidMed) {
        item.gated = "adaptogenBlocked";
        item.redirectTo = "MAGNESIUM";
      }
    }
    if (bucket === "BLOOD_SUGAR") {
      if (safety.diabetesMed) {
        item.gated = "cellunexCaution";
        item.addToCartDisabled = true;
      }
    }
    return item;
  }

  let items: ResultItem[] = [];
  const usedBuckets: Record<string, boolean> = {};

  if (bundleTriggered) {
    const bundleNormalized = Math.max(...bundleHits.map((b) => s.normalized[b]));
    const bundleItem: ResultItem = {
      bucket: "BUNDLE",
      role: "primary",
      productId: "bundle",
      product: PRODUCTS.bundle,
      tier: tierLabel(bundleNormalized),
      normalized: bundleNormalized,
      track: "deficiency",
      trackLine: "At least two of vitamin D, zinc, and your antioxidant reserve cleared the pattern — the exact combination this stack covers.",
      why: WHY_COPY.BUNDLE,
      timeline: TIMELINES.bundle,
      echo: bundleHits.reduce<string[]>((acc, b) => acc.concat(topContributions(s.contributions, b, 2)), []).slice(0, 4),
      gated: null,
      addToCartDisabled: false,
      bundleHits: bundleHits.map((b) => BUCKETS[b].label),
    };
    items.push(bundleItem);
    bundleTrio.forEach((b) => { usedBuckets[b] = true; });

    const remaining = order.filter((b) => !usedBuckets[b] && s.normalized[b] >= ELIGIBLE);
    remaining.slice(0, 2).forEach((b, idx) => {
      const it = buildItem(b, idx === 0 ? "addon" : "supporting");
      it.freeDeliveryAddon = idx === 0;
      items.push(it);
      usedBuckets[b] = true;
    });
  } else {
    const primaryItem = buildItem(primaryBucket, "primary");
    items.push(primaryItem);
    usedBuckets[primaryBucket] = true;

    supportingBuckets.forEach((b) => {
      if (usedBuckets[b]) return;
      items.push(buildItem(b, "supporting"));
      usedBuckets[b] = true;
    });
  }

  const finalItems: ResultItem[] = [];
  const finalProductIds: Record<string, boolean> = {};
  items.forEach((item) => {
    if (item.gated === "adaptogenBlocked") {
      const mgProduct = s.magSub.oxide > s.magSub.complex ? "magnesium-oxide" : "magnesium-complex";
      if (!finalProductIds[mgProduct]) {
        const redirected = buildItem("MAGNESIUM", item.role);
        redirected.redirectedFrom = "STRESS_LOAD";
        finalItems.push(redirected);
        finalProductIds[redirected.productId] = true;
      }
      return;
    }
    if (item.gated === "ironBlocked") {
      item.addToCartDisabled = true;
      if (!finalProductIds[item.productId]) {
        finalItems.push(item);
        finalProductIds[item.productId] = true;
      }
      if (!finalProductIds["vitacore-b-complex"] && finalItems.length < 3) {
        const bItem = buildItem("B_VITAMINS", "supporting");
        bItem.isIronSafeAlternative = true;
        finalItems.push(bItem);
        finalProductIds["vitacore-b-complex"] = true;
      }
      return;
    }
    if (!finalProductIds[item.productId]) {
      finalItems.push(item);
      finalProductIds[item.productId] = true;
    }
  });

  const trimmedItems = finalItems.slice(0, 3);
  const globalCartBlocked = !!safety.pregnant || safety.ageBracket === "Under 18";

  return {
    items: trimmedItems,
    isFallback,
    globalCartBlocked,
    normalized: s.normalized,
  };
}

export function formatPrice(n: number): string {
  return "R" + n.toFixed(0);
}

export function cartPermalink(items: ResultItem[]): string | null {
  const parts = items
    .filter((i) => !i.addToCartDisabled && i.product?.variantId)
    .map((i) => i.product.variantId + ":1");
  if (!parts.length) return null;
  return "https://checkout.nutrizen.co.za/cart/" + parts.join(",") + "?discount=QUIZ10";
}

export function pdpLink(product: Product): string {
  return "https://nutrizen.co.za/products/" + product.handle + "?utm_source=quiz";
}
