const errors: { [lang in string]: { [key in string]: string } } = JSON.parse(`{
  "ko": {
    "": "오류 발생!"
  }
}`);

export const toLocaleErrorMessage = (error: unknown): string => {
  const localeErrors = errors["ko"];
  if (error instanceof Error && error.message in localeErrors) return localeErrors[error.message];
  return localeErrors[""];
};
