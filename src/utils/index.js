import HTMLReactParser from "html-react-parser";

export function formatDate(inputDateString) {
  const inputDate = new Date(inputDateString);

  const options = { year: "numeric", month: "2-digit", day: "2-digit" };

  const formattedDate = inputDate
    .toLocaleDateString("en-CA", options)
    .replace(/-/g, "-");

  return formattedDate;
}

export function parseHtml(htmlContent) {
  return HTMLReactParser(htmlContent);
}
