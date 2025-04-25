import fs from "node:fs";
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

  const extension = meal.image.name.split('.').pop();
  // const idx = meal.image.id;
  // console.log("idx:", idx);
  const fileName = `${meal.slug}.${extension}`;
  const stream = fs.createWriteStream(`public/images/${fileName}`);
  const bufferedImg = await meal.image.arrayBuffer();
  stream.write(Buffer.from(bufferedImg), (error) => {
    if (error) {
      throw new Error('Saving image failed');
    }
  });

  meal.image = `/images/${fileName}`;
  
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