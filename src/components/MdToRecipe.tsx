import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { recipesForCurrency, ingredientLabel, money, regionOnlyLabel } from '../assets/cookbook/recipes';
import { Stats, CurrencySelect } from './Irecipe';
import { AuthorBox } from './MdToBlog';
import './MdToBlog.css';
import './Irecipe.css';

function RecipeJumpLinks() {
  return <nav className="toc" aria-label="Recipe sections"><p className="related__heading">On this page</p><ul className="toc__list">
    {['Image', 'Ingredients', 'Method', 'Cost breakdown', 'Protein breakdown'].map(label => <li key={label}><a className="toc__link" href={`#${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a></li>)}
  </ul></nav>;
}
export default function MdToRecipe() {
  const { slug } = useParams();
  const [multiplier, setMultiplier] = useState(1);
  const [params] = useSearchParams();
  const currency = params.get('currency') === 'GBP' ? 'GBP' : 'INR';
  const control = <CurrencySelect />;
  const recipes = recipesForCurrency(currency);
  const recipe = recipes.find(r => r.slug === slug);
  if (!recipe) return <article className="cookbook"><Link to={`/activism/cookbook?currency=${currency}`}>← Cookbook</Link><h1>Recipe not found</h1></article>;
  const moreRecipes = recipes.filter(r => r.slug !== recipe.slug).slice(0, 4);
  const local = recipe.currency === currency;
  const notes = local ? recipe.estimateNotes?.[currency] ?? '' : '';
  return <div className="blog-page recipe-page">
    <header className="blog-page__header">
      <Link className="blog-page__back" to={`/activism/cookbook?currency=${currency}`}>← Cookbook</Link>
      <h1 className="blog-page__title">{recipe.title}</h1><p>{recipe.description}</p>
      <div className="recipe-currency">{control}</div>
    </header>
    <div className="blog-page__body recipe-page__body">
      <aside className="recipe-toc"><RecipeJumpLinks /></aside>
      <article className="blog-page__content recipe-content">
        <figure id="image" className="figure"><img src={recipe.image} alt={recipe.title} /></figure>
        <Stats recipe={recipe} currency={currency} />
        <div className="recipe-batch-controls" role="group" aria-label="Batch size">
          {[1, 2, 3].map(size => <button key={size} type="button" aria-pressed={multiplier === size} onClick={() => setMultiplier(size)}>{size}×</button>)}
        </div>
        <p className="recipe-batch-summary">
          <span aria-live="polite">Ingredients make {recipe.servings * multiplier} serving{recipe.servings * multiplier === 1 ? '' : 's'}. Batch estimate: {local ? money(recipe.costs[currency] === null ? null : recipe.costs[currency]! * recipe.servings * multiplier, currency) : regionOnlyLabel(recipe)}, {Number((recipe.protein * recipe.servings * multiplier).toFixed(1))} g protein, {Math.round(recipe.calories * recipe.servings * multiplier)} kcal.</span>{' '}
          Card statistics and breakdowns below are per serving. Larger batches may need a wider pan or cooking in batches.
        </p>
        {local && recipe.alternativeBatch && <p className="recipe-alternative">{recipe.alternativeBatch.label}: {money(recipe.alternativeBatch.minCost * multiplier, currency)}–{money(recipe.alternativeBatch.maxCost * multiplier, currency)} per batch, {Number((recipe.alternativeBatch.protein * multiplier).toFixed(1))} g protein, {Math.round(recipe.alternativeBatch.calories * multiplier)} kcal.</p>}
        <section id="ingredients"><h2>Ingredients</h2>
          {!local && <p>{recipe.currency === 'GBP' ? 'UK' : 'India'} recipe. Ingredients and nutrition shown are for that version.</p>}
          {currency === 'INR' && recipe.ingredientLinks?.INR && <p>Shop linked ingredients on Instamart (local prices and availability vary).</p>}
          <ul>{recipe.ingredients.map((ingredient, n) => {
            const href = recipe.ingredientLinks?.[currency]?.[ingredient];
            const label = ingredientLabel(recipe, ingredient, multiplier);
            const note = recipe.regionalIngredientNotes?.[currency]?.[ingredient];
            return <li key={n}>{href ? <a href={href} target="_blank" rel="noopener noreferrer">{label}</a> : label}
              {note && <p className="recipe-region-note">{note}</p>}
            </li>;
          })}</ul>
        </section>
        <section id="method"><h2>Method</h2><div className="cookbook-method"><ReactMarkdown remarkPlugins={[remarkGfm]}>{recipe.instructions}</ReactMarkdown></div></section>
        <section id="cost-breakdown"><h2>Cost breakdown</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{local ? notes.replace(/^### Estimates\n/, '').replace('### Cost breakdown (India)\n', '') || recipe.costNotes?.[currency] || '' : regionOnlyLabel(recipe)}</ReactMarkdown>
        </section>
        <section id="protein-breakdown"><h2>Protein breakdown</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{recipe.proteinBreakdown || `Approximately ${recipe.protein} g per serving. Ingredient breakdown pending.`}</ReactMarkdown>
        </section>
        <AuthorBox />
      </article>
      <aside className="blog-page__related-col recipe-related"><p className="related__heading">More recipes</p><div className="related__list">
        {moreRecipes.map(r => <Link key={r.slug} className="related-card" to={`/activism/cookbook/${r.slug}?currency=${currency}`}>
          <div className="related-card__thumb"><img src={r.image} alt="" loading="lazy" /></div>
          <div className="related-card__body"><p className="related-card__title">{r.title}</p><span className="related-card__date">{r.minutes} min · {r.protein} g protein</span></div>
        </Link>)}
        {!moreRecipes.length && <p>More recipes will appear here as they are added.</p>}
      </div></aside>
    </div>
  </div>;
}