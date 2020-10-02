import isEmpty from "validator/lib/isEmpty";

export function validateComment(comment) {
  let err = { hasError: false };
  const s = comment + "";

  if (isEmpty(s, { ignore_whitespace: true })) {
    err.comment = "Comment cannot be empty!";
    err.hasError = true;
  }

  return err;
}
