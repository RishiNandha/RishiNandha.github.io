export type Currency = 'INR' | 'GBP';
export interface IngredientAmount {
  quantity: number; maxQuantity?: number; unit: string; name: string;
  alternative?: { quantity: number; unit: string; name: string };
}
export interface Recipe {
  currency: Currency; slug: string; title: string; description: string; image: string;
  minutes: number; servings: number; protein: number; calories: number;
  costs: Record<Currency, number | null>; ingredients: string[];
  instructions: string; publish: boolean;
  ingredientAmounts?: Record<string, IngredientAmount>;
  alternativeBatch?: { label: string; minCost: number; maxCost: number; protein: number; calories: number };
  costNotes?: Partial<Record<Currency, string>>;
  nutritionNote?: string;
  proteinBreakdown?: string;
  estimateNotes?: Partial<Record<Currency, string>>;
  regionalIngredientNotes?: Partial<Record<Currency, Record<string, string>>>;
  ingredientLinks?: Partial<Record<Currency, Record<string, string>>>;
}
export function validateRecipe(value: unknown, filename: string): Recipe {
  const r = value as Recipe;
  const fail = () => { throw new Error(`Invalid recipe: ${filename}. See cookbook/README.md.`); };
  if (!r || typeof r !== 'object') return fail();
  if (!['INR', 'GBP'].includes(r.currency)) fail();
  for (const key of ['slug', 'title', 'description', 'image', 'instructions'] as const)
    if (typeof r[key] !== 'string' || !r[key].trim()) fail();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.slug)) fail();
  if (!/^(https?:\/\/|\/(?!\/))/.test(r.image)) fail();
  for (const key of ['minutes', 'servings', 'calories'] as const)
    if (!Number.isFinite(r[key]) || r[key] <= 0) fail();
  if (!Number.isFinite(r.protein) || r.protein < 0 || typeof r.publish !== 'boolean') fail();
  if (!Array.isArray(r.ingredients) || !r.ingredients.length || r.ingredients.some(i => typeof i !== 'string' || !i.trim())) fail();
  for (const c of ['INR', 'GBP'] as const)
    if (!r.costs || (r.costs[c] !== null && (!Number.isFinite(r.costs[c]) || r.costs[c]! <= 0))) fail();
  if (r.ingredientLinks) {
    for (const [currency, links] of Object.entries(r.ingredientLinks)) {
      if (!['INR', 'GBP'].includes(currency) || !links || typeof links !== 'object') fail();
      for (const [ingredient, url] of Object.entries(links)) {
        if (!r.ingredients.includes(ingredient) || typeof url !== 'string') fail();
        try { if (new URL(url).protocol !== 'https:') fail(); } catch { fail(); }
      }
    }
  }
  for (const [ingredient, amount] of Object.entries(r.ingredientAmounts ?? {})) {
    if (!r.ingredients.includes(ingredient) || !Number.isFinite(amount.quantity) || amount.quantity <= 0 || typeof amount.unit !== 'string' || typeof amount.name !== 'string') fail();
    if (amount.maxQuantity !== undefined && (!Number.isFinite(amount.maxQuantity) || amount.maxQuantity < amount.quantity)) fail();
    if (amount.alternative && (!Number.isFinite(amount.alternative.quantity) || amount.alternative.quantity <= 0)) fail();
  }
  return r;
}
const markdowns = import.meta.glob('./markdowns/*/*.md', { query: '?raw', eager: true, import: 'default' }) as Record<string, string>;
const files = import.meta.glob('./recipes/*/*.json', { eager: true, import: 'default' });
const all = Object.entries(files).map(([file, data]) => {
  const recipe = data as Recipe;
  const region = file.split('/')[2];
  if (region !== recipe.currency?.toLowerCase()) throw new Error(`Recipe currency does not match directory: ${file}`);
  return validateRecipe({ ...recipe, instructions: markdowns[`./markdowns/${region}/${recipe.slug}.md`] }, file);
});
if (new Set(all.map(r => `${r.currency}/${r.slug}`)).size !== all.length) throw new Error('Duplicate recipe slug within currency');
export function recipesForCurrency(currency: Currency): Recipe[] {
  const published = all.filter(r => r.publish);
  const slugs = [...new Set(published.map(r => r.slug))];
  return slugs.map(slug => published.find(r => r.slug === slug && r.currency === currency)
    ?? published.find(r => r.slug === slug)!);
}
export const regionOnlyLabel = (recipe: Recipe) => recipe.currency === 'INR' ? 'India only' : 'UK only';
export const proteinPerCost = (r: Recipe, c: Currency) => r.currency !== c || r.costs[c] === null ? null : r.protein / r.costs[c]!;
export const proteinPer100Calories = (r: Recipe) => r.protein / r.calories * 100;
export const money = (value: number | null, c: Currency) => value === null ? 'Cost unavailable' : new Intl.NumberFormat(c === 'INR' ? 'en-IN' : 'en-GB', { style: 'currency', currency: c }).format(value);

function quarterLabel(value: number): string {
  const whole = Math.floor(value);
  const quarter = Math.round((value - whole) * 4);
  return `${whole || (quarter ? '' : '0')}${['', '¼', '½', '¾'][quarter]}`;
}
function quantityLabel(value: number, maximum = value): string {
  const lower = Math.floor(value * 4 + 0.000001) / 4;
  const upper = Math.ceil(maximum * 4 - 0.000001) / 4;
  return lower === upper ? quarterLabel(lower) : `${quarterLabel(lower)}–${quarterLabel(upper)}`;
}
export function ingredientLabel(recipe: Recipe, ingredient: string, multiplier: number): string {
  const amount = recipe.ingredientAmounts?.[ingredient];
  if (!amount) return ingredient;
  const label = `${quantityLabel(amount.quantity * multiplier, (amount.maxQuantity ?? amount.quantity) * multiplier)} ${amount.unit} ${amount.name}`.replace(/ +/g, ' ').trim();
  const alt = amount.alternative;
  return alt ? `${label} (or ${quantityLabel(alt.quantity * multiplier)} ${alt.unit} ${alt.name})` : label;
}
