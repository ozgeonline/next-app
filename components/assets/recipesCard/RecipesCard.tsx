import Link from "next/link";
import Image from "next/image";
import connect from "@/lib/db";
import { getUserFromCookies } from "@/lib/getUserFromCookies";
import Meal from "@/app/models/Meal";
import RatingStars from "@/components/meals/RatingStars";
import styles from "./recipes.module.css";
import { Star, StarHalf } from "lucide-react";

interface RecipesCardProps {
  spotlight: boolean;
  // Dışarıdan meals almaya gerek kalmadı, bileşen kendi çekecek
}

// 1. ADIM: Yardımcı Fonksiyon - Veriyi En Performanslı Şekilde Çekme (Aggregation)
async function getTopRecipes() {
  await connect();

  // N+1 problemini çözen mucize: Aggregation Pipeline
  // Tek bir sorgu ile hem son 5 yemeği alır hem de Rating tablosuyla birleştirip ortalamasını hesaplar.
  const mealsData = await Meal.aggregate([
    { $sort: { createdAt: -1 } },
    { $limit: 5 }, // Sadece 5 tane çek. (Yüzlerce çekip slice yapmaktan kurtulduk)
    {
      $lookup: {
        from: "ratings", // Rating modelinin MongoDB'deki collection adı (genelde küçük harf ve çoğuldur)
        localField: "_id",
        foreignField: "mealId",
        as: "mealRatings"
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        image: 1,
        summary: 1,
        creator: 1,
        ratingCount: { $size: "$mealRatings" },
        averageRating: { $avg: "$mealRatings.rating" }
      }
    }
  ]);

  // MongoDB'den dönen veriyi React'in seveceği temiz bir formata dönüştürüyoruz
  return mealsData.map(meal => ({
    id: meal._id.toString(),
    title: meal.title || "Untitled Meal",
    slug: meal.slug || meal._id.toString(),
    image: meal.image || null, // Boş string yerine direkt null check
    summary: meal.summary || "No summary available",
    creator: meal.creator || "Unknown",
    averageRating: meal.averageRating || 0, // Eğer rating yoksa 0 ata
    ratingCount: meal.ratingCount || 0,
  }));
}

// 2. ADIM: Yardımcı Fonksiyon - Yıldızları Çizme
const renderStars = (averageRating: number) => {
  const stars = [];
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full-${i}`} fill="#111" strokeWidth={1} stroke="#111" />);
  }

  if (hasHalfStar) {
    stars.push(<StarHalf key="half" fill="#111" strokeWidth={1} stroke="#111" />);
  }

  for (let i = stars.length; i < 5; i++) {
    stars.push(<Star key={`empty-${i}`} strokeWidth={1} stroke="#111" />);
  }

  return stars;
};

// 3. ADIM: Ana Bileşen - Sadece Arayüze Odaklanır
export default async function RecipesCard({ spotlight }: RecipesCardProps) {
  // Veriyi ve kullanıcıyı paralel olarak çekeriz (Daha hızlı yükleme)
  const [transformedMeals, user] = await Promise.all([
    getTopRecipes(),
    getUserFromCookies()
  ]);

  const userId = user?.userId || null;

  return (
    <>
      {transformedMeals.map((meal) => (
        <div key={meal.id} className={styles.container}>
          <div className={styles.card}>
            <div className={styles["recipe-card"]}>
              <div className={spotlight ? styles["spotlight-image"] : styles["recipe-image"]}>
                <Image
                  src={meal.image || "/images/placeholder.jpg"} // Eğer resim yoksa patlamamasini saglar
                  alt={meal.title}
                  fill // width={0} vb uğraşmak yerine modern yöntem
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={styles["image-inner"]}
                  style={{ objectFit: 'cover' }}
                />
                {!spotlight && (
                  <Link className={styles["recipe-link"]} href={`/meals/${meal.slug}`}>
                    View Details
                  </Link>
                )}
              </div>

              {spotlight && (
                <div className={styles["recipe-overlay"]}>
                  <div className={styles["spotlight-info"]}>
                    <h3>{meal.title}</h3>
                    <p>by <span>{meal.creator}</span></p>

                    <div className={styles.stars}>
                      {userId ? (
                        <RatingStars mealId={meal.id} initialRating={meal.averageRating} />
                      ) : (
                        <div className={styles.ratingCountWrapper}>
                          {renderStars(meal.averageRating)}
                          <span className={styles.ratingCount}>
                            ({meal.ratingCount} {meal.ratingCount === 1 ? "rating" : "ratings"})
                          </span>
                        </div>
                      )}
                    </div>

                    <Link
                      href={`/meals/${meal.slug}`}
                      className={`${styles["spotlight-button"]} text-gold-on-dark`}
                    >
                      See Recipe
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
