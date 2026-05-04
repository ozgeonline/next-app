"use client";

import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";
import { ArrowLeft, ArrowRight, Edit3, Save, Trash2, X } from "lucide-react";
import { useToast } from "@/context/toast/ToastProvider";
import { Button } from "@/components/ui/button/Button";
import styles from "./shared-meals.module.css";

type SharedMeal = {
  id: string;
  title: string;
  slug: string;
  image: string;
  summary: string;
  instructions: string;
  createdAt: string;
  updatedAt?: string;
  averageRating: number;
};

type SharedMealsResponse = {
  meals: SharedMeal[];
};

type EditableMealFields = {
  title: string;
  summary: string;
  instructions: string;
};

const fetcher = async (url: string): Promise<SharedMealsResponse> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch shared meals");
  return response.json();
};

function getInitialFormState(meal: SharedMeal): EditableMealFields {
  return {
    title: meal.title,
    summary: meal.summary,
    instructions: meal.instructions,
  };
}

export default function SharedMeals() {
  const { toast } = useToast();
  const { data, error, isLoading, mutate } = useSWR<SharedMealsResponse>("/api/meals/shared", fetcher);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [formState, setFormState] = useState<EditableMealFields | null>(null);
  const [pendingMealId, setPendingMealId] = useState<string | null>(null);

  const meals = data?.meals || [];

  const startEditing = (meal: SharedMeal) => {
    setEditingMealId(meal.id);
    setFormState(getInitialFormState(meal));
  };

  const cancelEditing = () => {
    setEditingMealId(null);
    setFormState(null);
  };

  const updateField = (field: keyof EditableMealFields, value: string) => {
    setFormState((current) => current ? { ...current, [field]: value } : current);
  };

  const saveMeal = async (mealId: string) => {
    if (!formState) return;

    setPendingMealId(mealId);

    try {
      const response = await fetch(`/api/meals/shared/${mealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Meal could not be updated.");
        return;
      }

      mutate(
        (current) => ({
          meals: current?.meals.map((meal) => meal.id === mealId ? { ...meal, ...result.meal } : meal) || [],
        }),
        { revalidate: false }
      );
      cancelEditing();
      toast.success("Meal updated successfully.");
    } catch {
      toast.error("Meal could not be updated.");
    } finally {
      setPendingMealId(null);
    }
  };

  const deleteMeal = async (mealId: string) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this shared meal?");
    if (!shouldDelete) return;

    setPendingMealId(mealId);

    try {
      const response = await fetch(`/api/meals/shared/${mealId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.error || "Meal could not be deleted.");
        return;
      }

      mutate(
        (current) => ({
          meals: current?.meals.filter((meal) => meal.id !== mealId) || [],
        }),
        { revalidate: false }
      );
      toast.success("Meal deleted successfully.");
    } catch {
      toast.error("Meal could not be deleted.");
    } finally {
      setPendingMealId(null);
    }
  };

  return (
    <section className={styles.sharedSection}>
      <div className={styles.sectionHeader}>
        <div>
          <h3 className={styles.sectionTitle}>My Shared Meals</h3>
          <p className={styles.sectionSub}>Manage recipes you published to the community.</p>
        </div>
        <Button
          href="/profile"
          variant="plain"
          className={styles.backButton}
          iconLeft={<ArrowLeft size={16} />}
        >
          Back to profile
        </Button>
      </div>

      {isLoading && <p className={styles.emptyText}>Loading shared meals...</p>}
      {error && <p className={styles.errorText}>Shared meals could not be loaded.</p>}

      {!isLoading && !error && meals.length === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>You have not shared any meals yet.</p>
          <Button href="/meals/share" variant="primary">
            Share a meal
          </Button>
        </div>
      )}

      {meals.length > 0 && (
        <div className={styles.mealsList}>
          {meals.map((meal) => {
            const isEditing = editingMealId === meal.id;
            const isPending = pendingMealId === meal.id;

            return (
              <article key={meal.id} className={styles.mealCard}>
                <div className={styles.imageWrapper}>
                  <Image src={meal.image} alt={meal.title} fill className={styles.mealImage} />
                </div>

                <div className={styles.cardContent}>
                  {isEditing && formState ? (
                    <div className={styles.editForm}>
                      <label className={styles.fieldLabel} htmlFor={`title-${meal.id}`}>Title</label>
                      <input
                        id={`title-${meal.id}`}
                        className={styles.textInput}
                        value={formState.title}
                        maxLength={100}
                        onChange={(event) => updateField("title", event.target.value)}
                      />

                      <label className={styles.fieldLabel} htmlFor={`summary-${meal.id}`}>Summary</label>
                      <textarea
                        id={`summary-${meal.id}`}
                        className={styles.textArea}
                        value={formState.summary}
                        maxLength={300}
                        rows={3}
                        onChange={(event) => updateField("summary", event.target.value)}
                      />

                      <label className={styles.fieldLabel} htmlFor={`instructions-${meal.id}`}>Instructions</label>
                      <textarea
                        id={`instructions-${meal.id}`}
                        className={styles.textArea}
                        value={formState.instructions}
                        maxLength={5000}
                        rows={5}
                        onChange={(event) => updateField("instructions", event.target.value)}
                      />
                    </div>
                  ) : (
                    <>
                      <p className={styles.meta}>Shared {new Date(meal.createdAt).toLocaleDateString()}</p>
                      <h4 className={styles.mealTitle}>{meal.title}</h4>
                      <p className={styles.summary}>{meal.summary}</p>
                    </>
                  )}
                </div>

                <div className={styles.cardActions}>
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="plain"
                        className={styles.cancelButton}
                        onClick={cancelEditing}
                        disabled={isPending}
                        iconLeft={<X size={16} />}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="plain"
                        className={styles.saveButton}
                        onClick={() => saveMeal(meal.id)}
                        disabled={isPending}
                        iconLeft={<Save size={16} />}
                      >
                        {isPending ? "Saving..." : "Save"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        href={`/meals/${meal.slug}`}
                        variant="plain"
                        className={styles.viewButton}
                        iconRight={<ArrowRight size={15} />}
                      >
                        View
                      </Button>
                      <Button
                        type="button"
                        variant="plain"
                        className={styles.editButton}
                        onClick={() => startEditing(meal)}
                        iconLeft={<Edit3 size={16} />}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="plain"
                        className={styles.deleteButton}
                        onClick={() => deleteMeal(meal.id)}
                        disabled={isPending}
                        iconLeft={<Trash2 size={16} />}
                      >
                        {isPending ? "Deleting..." : "Delete"}
                      </Button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
