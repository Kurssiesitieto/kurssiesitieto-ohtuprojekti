import preprocessContent from "./PreprocessContent";

export const findDescription = (text, titles) => {
  const descriptions = [];
  for (let title of titles) {
    let start0 = -1;
    if (text.indexOf(title) !== -1) {
      start0 = text.indexOf(title);
    }

    const start = text.indexOf("</h5>", start0) + 5;
    const end = text.indexOf("</p>", start);
    const cutDesc = text.slice(start, end);
    let fixedDesc = preprocessContent(cutDesc);

    if (start0 === -1) {
      fixedDesc = "";
    }

    descriptions.push([title, fixedDesc]);
  }
  return descriptions;
};

export default findDescription;
