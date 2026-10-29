import { useSearchParams } from 'react-router';
import { useState } from 'react';
import { recipesForCurrency, proteinPerCost, proteinPer100Calories } from '../assets/cookbook/recipes';
import { RecipeCard, CurrencySelect } from '../components/Irecipe';

export default function Cookbook() {
  const [params] = useSearchParams();
  const currency = params.get('currency') === 'GBP' ? 'GBP' : 'INR';
  const control = <CurrencySelect />;
  const [sort, setSort] = useState('cost');
  const [minCost, setMinCost] = useState('');
  const [minCalories, setMinCalories] = useState('');
  const [query, setQuery] = useState('');
  const recipes = recipesForCurrency(currency);
  const visible = recipes.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) &&
    (!minCost || (proteinPerCost(r, currency) !== null && proteinPerCost(r, currency)! >= Number(minCost))) &&
    (!minCalories || proteinPer100Calories(r) >= Number(minCalories)))
    .sort((a, b) => (sort === 'cost' ? (proteinPerCost(b, currency) ?? -1) - (proteinPerCost(a, currency) ?? -1) : sort === 'calories' ? proteinPer100Calories(b) - proteinPer100Calories(a) : a.title.localeCompare(b.title)) || a.title.localeCompare(b.title));
  return <section className="cookbook"><h1>Cookbook</h1><p>Recipes for getting more protein from your budget and calories.</p>
    <div className="cookbook-controls">{control}
      <label>Sort by<select value={sort} onChange={e => setSort(e.target.value)}><option value="cost">Protein / cost</option><option value="calories">Protein / 100 kcal</option><option value="title">Dish name</option></select></label>
      <details className="cookbook-more-filters"><summary>Filters{(query || minCost || minCalories) ? ` (${[query, minCost, minCalories].filter(Boolean).length})` : ''}</summary><div className="cookbook-filter-fields">
      <label>Search dishes<input type="search" value={query} onChange={e => setQuery(e.target.value)} /></label>
      <label>Minimum g protein / {currency === 'INR' ? '₹' : '£'}<input type="number" min="0" step="any" value={minCost} onChange={e => setMinCost(e.target.value)} /></label>
      <label>Minimum g protein / 100 kcal<input type="number" min="0" step="any" value={minCalories} onChange={e => setMinCalories(e.target.value)} /></label>
      <button onClick={() => { setQuery(''); setMinCost(''); setMinCalories(''); setSort('cost'); }}>Reset filters</button>
      </div></details>
    </div><p>Prices are separate local estimates, not currency conversions. Nutrition and cost are per serving.</p>
    <p role="status">{visible.length} recipe{visible.length === 1 ? '' : 's'}</p>
    <div className="cookbook-grid">{visible.map(r => <RecipeCard key={r.slug} recipe={r} currency={currency} />)}</div>
    {!visible.length && <p>{recipes.length ? 'No recipes match these filters.' : 'The cookbook is ready. Recipes will appear here as they are added.'}</p>}
  </section>;
}
