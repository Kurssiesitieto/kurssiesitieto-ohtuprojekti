export function PreprocessContent(htmlContent) {
  let formattedContent = htmlContent
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?p>/gi, "\n");
  formattedContent = formattedContent.replace(/<[^>]*>/g, "");
  formattedContent = formattedContent.replace(/\n\s*\n\s*\n+/g, "\n\n");

  if (formattedContent.startsWith('"') && formattedContent.endsWith('"')) {
    formattedContent = formattedContent.substring(
      1,
      formattedContent.length - 1
    );
  }
  return formattedContent;
}

export default PreprocessContent;
