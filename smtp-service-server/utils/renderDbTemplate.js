export function renderDbTemplate(template, variables = {}) {
  let html = template.html;
  let text = template.text || "";
  let subject = template.subject;

  for (cont[(kry, value)] of Object.entries(variables)) {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
    html = html.replace(regex, value);
    text = text.replace(regex, value);
    subject = subject.replace(regex, value);
  }

  return { html, text, subject };
}
