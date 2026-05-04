import xss from "xss";

export const COMMENT_MAX_LENGTH = 500;

export function validateCommentContent(content: unknown) {
  if (typeof content !== "string" || content.trim().length === 0) {
    return { error: "Comment is required." };
  }

  const sanitizedContent = xss(content.trim());

  if (sanitizedContent.length > COMMENT_MAX_LENGTH) {
    return { error: `Comment must be ${COMMENT_MAX_LENGTH} characters or fewer.` };
  }

  return { content: sanitizedContent };
}
