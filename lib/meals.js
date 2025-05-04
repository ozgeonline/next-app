import sql from "better-sqlite3";
import slugify from "slugify";
import xss from "xss";

const db = sql('meals.db');

export async function getMeals() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  //throw new Error('something went wrong');
  return db.prepare('SELECT * FROM meals').all()
}

export function getMeal(slug) {
  return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
  meal.slug = slugify(meal.title, { lower: true });
  meal.instructions =xss(meal.instructions);

  let slugExists = db.prepare('SELECT slug FROM meals WHERE slug = ?').get(meal.slug);
  let counter = 1;
  while (slugExists) {
    meal.slug = slugify(meal.title, { lower: true }) + '-' + counter;
    slugExists = db.prepare('SELECT slug FROM meals WHERE slug = ?').get(meal.slug);
    counter++;
  }

  meal.image = meal.image.startsWith('http') ? meal.image : `/images/${meal.slug}`;
  //console.log("Meal received:", meal);

  
  const stmt = db.prepare(`
      INSERT INTO meals (slug, title, image, summary, instructions, creator, creator_email)
      VALUES (
         @slug,
         @title,
         @image,
         @summary,
         @instructions,
         @creator,
         @creator_email
      )
  `);
  stmt.run(meal);
}