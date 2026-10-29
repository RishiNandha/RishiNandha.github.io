import { Link, useSearchParams } from 'react-router';
import { money, regionOnlyLabel, proteinPerCost, proteinPer100Calories } from '../assets/cookbook/recipes';
import type { Currency, Recipe } from '../assets/cookbook/recipes';
import './Irecipe.css';

export function Stats({ recipe: r, currency: c }: { recipe: Recipe; currency: Currency }) {
  const efficiency = proteinPerCost(r, c);
  const local = r.currency === c;
  return <dl className="cookbook-stats">
    <div><dt>Time</dt><dd>{r.minutes} min</dd></div>
    <div><dt>Cost / serving</dt><dd>{local ? money(r.costs[c], c) : regionOnlyLabel(r)}{local && r.costNotes?.[c] && <small className="cookbook-estimate-note"> ({r.costNotes[c]})</small>}</dd></div>
    <div><dt>Ingredients</dt><dd>{r.ingredients.length}</dd></div>
    <div><dt>Protein / serving</dt><dd>{r.protein} g</dd></div>
    <div><dt>Calories / serving</dt><dd>{r.calories} kcal{r.nutritionNote && <small className="cookbook-estimate-note"> ({r.nutritionNote})</small>}</dd></div>
    <div><dt>Protein / {c === 'INR' ? '₹' : '£'}</dt><dd>{!local ? regionOnlyLabel(r) : efficiency === null ? 'Unavailable' : `${efficiency.toFixed(2)} g`}</dd></div>
    <div><dt>Protein / 100 kcal</dt><dd>{proteinPer100Calories(r).toFixed(2)} g</dd></div>
  </dl>;
}
export function RecipeCard({ recipe, currency }: { recipe: Recipe; currency: Currency }) {
  return <Link className="cookbook-card" to={`/activism/cookbook/${recipe.slug}?currency=${currency}`}>
    <img src={recipe.image} alt={recipe.title} loading="lazy" />
    <div className="cookbook-card-body"><h2>{recipe.title}</h2><p>{recipe.description}</p><Stats recipe={recipe} currency={currency} /><span>Read recipe →</span></div>
  </Link>;
}
export function CurrencySelect() {
  const [params, setParams] = useSearchParams();
  const currency: Currency = params.get('currency') === 'GBP' ? 'GBP' : 'INR';
  return <label>Local prices <select value={currency} onChange={e => setParams(previous => { previous.set('currency', e.target.value); return previous; }, { replace: true })}><option value="INR">India · INR (₹)</option><option value="GBP">United Kingdom · GBP (£)</option></select></label>;
}
