"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import { ArrowLeft, Edit3, MessageCircle, Reply, Save, Trash2, X } from "lucide-react";
import { useToast } from "@/context/toast/ToastProvider";
import { Button } from "@/components/ui/button/Button";
import styles from "./meal-comments.module.css";

type MealComment = {
  id: string;
  mealId: string;
  parentCommentId: string | null;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  canManage: boolean;
};

type CommentsResponse = {
  comments: MealComment[];
};

type MealCommentsProps = {
  mealId: string;
  isAuthenticated: boolean;
  isMealCreator: boolean;
  onBackToRecipe?: () => void;
  onCommentCountChange?: (count: number) => void;
};

const COMMENT_MAX_LENGTH = 500;

const fetcher = async (url: string): Promise<CommentsResponse> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
};

function formatCommentDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default function MealComments({
  mealId,
  isAuthenticated,
  isMealCreator,
  onBackToRecipe,
  onCommentCountChange,
}: MealCommentsProps) {
  const { toast } = useToast();
  const { data, error, isLoading, mutate } = useSWR<CommentsResponse>(
    `/api/meals/comments?mealId=${mealId}`,
    fetcher
  );
  const [content, setContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [pendingCommentId, setPendingCommentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const comments = data?.comments || [];
  const parentComments = comments.filter((comment) => !comment.parentCommentId);
  const repliesByParentId = comments.reduce<Record<string, MealComment[]>>((acc, comment) => {
    if (!comment.parentCommentId) return acc;

    return {
      ...acc,
      [comment.parentCommentId]: [...(acc[comment.parentCommentId] || []), comment],
    };
  }, {});

  useEffect(() => {
    onCommentCountChange?.(comments.length);
  }, [comments.length, onCommentCountChange]);

  const submitComment = async (parentCommentId?: string) => {
    const nextContent = parentCommentId ? replyContent : content;

    if (!nextContent.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/meals/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealId, content: nextContent, parentCommentId }),
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Comment could not be added.");
        return;
      }

      mutate(
        (current) => ({
          comments: [result.comment, ...(current?.comments || [])],
        }),
        { revalidate: false }
      );
      setContent("");
      setReplyContent("");
      setReplyingToCommentId(null);
      toast.success(parentCommentId ? "Reply posted successfully." : "Comment posted successfully.");
    } catch {
      toast.error("Comment could not be added.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (comment: MealComment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent("");
    setReplyingToCommentId(null);
    setReplyContent("");
  };

  const saveComment = async (commentId: string) => {
    if (!editingContent.trim()) return;

    setPendingCommentId(commentId);

    try {
      const response = await fetch(`/api/meals/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editingContent }),
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Comment could not be updated.");
        return;
      }

      mutate(
        (current) => ({
          comments: current?.comments.map((comment) => (
            comment.id === commentId ? result.comment : comment
          )) || [],
        }),
        { revalidate: false }
      );
      cancelEditing();
      toast.success("Comment updated successfully.");
    } catch {
      toast.error("Comment could not be updated.");
    } finally {
      setPendingCommentId(null);
    }
  };

  const deleteComment = async (commentId: string) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!shouldDelete) return;

    setPendingCommentId(commentId);

    try {
      const response = await fetch(`/api/meals/comments/${commentId}`, {
        method: "DELETE",
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(result.error || "Comment could not be deleted.");
        return;
      }

      mutate(
        (current) => ({
          comments: current?.comments.filter((comment) => comment.id !== commentId) || [],
        }),
        { revalidate: false }
      );
      toast.success("Comment deleted successfully.");
    } catch {
      toast.error("Comment could not be deleted.");
    } finally {
      setPendingCommentId(null);
    }
  };

  return (
    <section className={styles.commentsSection}>
      <div className={styles.sectionHeader}>
        <div className={styles.iconCircle}>
          <MessageCircle size={18} />
        </div>
        <div>
          <h2>Comments</h2>
          <p>{comments.length} community notes</p>
        </div>
      </div>

      {onBackToRecipe && (
        <Button
          type="button"
          variant="plain"
          className={styles.backToRecipeButton}
          onClick={onBackToRecipe}
          iconLeft={<ArrowLeft size={15} />}
        >
          Back to recipe
        </Button>
      )}

      {isAuthenticated && !isMealCreator ? (
        <div className={styles.commentForm}>
          <textarea
            value={content}
            maxLength={COMMENT_MAX_LENGTH}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Share your thoughts about this recipe..."
            className={styles.commentInput}
          />
          <div className={styles.formFooter}>
            <span>{content.length}/{COMMENT_MAX_LENGTH}</span>
            <Button
              type="button"
              variant="plain"
              className={styles.submitButton}
              onClick={() => submitComment()}
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      ) : isAuthenticated && isMealCreator ? (
        <div className={styles.ownerNotice}>
          <p>You created this recipe, so you can reply to community comments instead of posting a direct comment.</p>
        </div>
      ) : (
        <div className={styles.loginPrompt}>
          <p>Log in to join the conversation.</p>
          <Button href="/login" variant="primary">
            Login to comment
          </Button>
        </div>
      )}

      {isLoading && <p className={styles.emptyText}>Loading comments...</p>}
      {error && <p className={styles.errorText}>Comments could not be loaded.</p>}

      {!isLoading && !error && parentComments.length === 0 && (
        <p className={styles.emptyText}>No comments yet. Be the first to share a thought.</p>
      )}

      {parentComments.length > 0 && (
        <div className={styles.commentList}>
          {parentComments.map((comment) => {
            const isEditing = editingCommentId === comment.id;
            const isPending = pendingCommentId === comment.id;
            const replies = repliesByParentId[comment.id] || [];
            const isReplying = replyingToCommentId === comment.id;

            return (
              <article key={comment.id} className={styles.commentCard}>
                <div className={styles.commentMeta}>
                  <div>
                    <h3>{comment.userName}</h3>
                    <span>{formatCommentDate(comment.createdAt)}</span>
                  </div>
                  {comment.canManage && !isEditing && (
                    <div className={styles.commentActions}>
                      <Button
                        type="button"
                        variant="plain"
                        className={styles.iconButton}
                        onClick={() => startEditing(comment)}
                        aria-label="Edit comment"
                      >
                        <Edit3 size={15} />
                      </Button>
                      <Button
                        type="button"
                        variant="plain"
                        className={styles.deleteButton}
                        onClick={() => deleteComment(comment.id)}
                        disabled={isPending}
                        aria-label="Delete comment"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className={styles.editBox}>
                    <textarea
                      value={editingContent}
                      maxLength={COMMENT_MAX_LENGTH}
                      onChange={(event) => setEditingContent(event.target.value)}
                      className={styles.commentInput}
                    />
                    <div className={styles.editActions}>
                      <Button
                        type="button"
                        variant="plain"
                        className={styles.cancelButton}
                        onClick={cancelEditing}
                        disabled={isPending}
                        iconLeft={<X size={15} />}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="plain"
                        className={styles.saveButton}
                        onClick={() => saveComment(comment.id)}
                        disabled={isPending || !editingContent.trim()}
                        iconLeft={<Save size={15} />}
                      >
                        {isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className={styles.commentText}>{comment.content}</p>
                )}

                {isAuthenticated && !comment.canManage && !isEditing && (
                  <Button
                    type="button"
                    variant="plain"
                    className={styles.replyButton}
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingContent("");
                      setReplyingToCommentId(comment.id);
                      setReplyContent("");
                    }}
                    iconLeft={<Reply size={15} />}
                  >
                    Reply
                  </Button>
                )}

                {isReplying && (
                  <div className={styles.replyForm}>
                    <textarea
                      value={replyContent}
                      maxLength={COMMENT_MAX_LENGTH}
                      onChange={(event) => setReplyContent(event.target.value)}
                      placeholder="Write a reply..."
                      className={styles.commentInput}
                    />
                    <div className={styles.editActions}>
                      <Button
                        type="button"
                        variant="plain"
                        className={styles.cancelButton}
                        onClick={cancelEditing}
                        disabled={isSubmitting}
                        iconLeft={<X size={15} />}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="plain"
                        className={styles.saveButton}
                        onClick={() => submitComment(comment.id)}
                        disabled={isSubmitting || !replyContent.trim()}
                        iconLeft={<Reply size={15} />}
                      >
                        {isSubmitting ? "Replying..." : "Post Reply"}
                      </Button>
                    </div>
                  </div>
                )}

                {replies.length > 0 && (
                  <div className={styles.replyList}>
                    {replies.map((reply) => {
                      const isReplyEditing = editingCommentId === reply.id;
                      const isReplyPending = pendingCommentId === reply.id;

                      return (
                        <div key={reply.id} className={styles.replyCard}>
                          <div className={styles.commentMeta}>
                            <div>
                              <h3>{reply.userName}</h3>
                              <span>{formatCommentDate(reply.createdAt)}</span>
                            </div>
                            {reply.canManage && !isReplyEditing && (
                              <div className={styles.commentActions}>
                                <Button
                                  type="button"
                                  variant="plain"
                                  className={styles.iconButton}
                                  onClick={() => startEditing(reply)}
                                  aria-label="Edit reply"
                                >
                                  <Edit3 size={15} />
                                </Button>
                                <Button
                                  type="button"
                                  variant="plain"
                                  className={styles.deleteButton}
                                  onClick={() => deleteComment(reply.id)}
                                  disabled={isReplyPending}
                                  aria-label="Delete reply"
                                >
                                  <Trash2 size={15} />
                                </Button>
                              </div>
                            )}
                          </div>

                          {isReplyEditing ? (
                            <div className={styles.editBox}>
                              <textarea
                                value={editingContent}
                                maxLength={COMMENT_MAX_LENGTH}
                                onChange={(event) => setEditingContent(event.target.value)}
                                className={styles.commentInput}
                              />
                              <div className={styles.editActions}>
                                <Button
                                  type="button"
                                  variant="plain"
                                  className={styles.cancelButton}
                                  onClick={cancelEditing}
                                  disabled={isReplyPending}
                                  iconLeft={<X size={15} />}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  type="button"
                                  variant="plain"
                                  className={styles.saveButton}
                                  onClick={() => saveComment(reply.id)}
                                  disabled={isReplyPending || !editingContent.trim()}
                                  iconLeft={<Save size={15} />}
                                >
                                  {isReplyPending ? "Saving..." : "Save"}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className={styles.commentText}>{reply.content}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
