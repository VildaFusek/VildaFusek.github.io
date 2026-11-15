// Jediným zdrojem projektů je data/projects.json.
const containers = {
  software: document.querySelector("#software-projects"),
  website: document.querySelector("#website-projects"),
};

function safeLink(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value, document.baseURI);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function createCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";
  const heading = document.createElement("h3");
  heading.textContent = project.name;
  const description = document.createElement("p");
  description.textContent = project.description;
  card.append(heading, description);

  const details = [
    project.role,
    Array.isArray(project.technologies) ? project.technologies.filter((item) => typeof item === "string").join(" / ") : "",
    project.status,
  ].filter((item) => typeof item === "string" && item);
  if (details.length) {
    const meta = document.createElement("p");
    meta.className = "project-meta";
    meta.textContent = details.join(" · ");
    card.append(meta);
  }

  const links = document.createElement("div");
  links.className = "project-links";
  for (const [key, label] of [["repository", "Zdrojový kód"], ["demo", "Živý web"], ["release", "Vydání"]]) {
    const href = safeLink(project[key]);
    if (!href) continue;
    const link = document.createElement("a");
    link.className = "text-link";
    link.href = href;
    link.textContent = `${label} ↗`;
    links.append(link);
  }
  card.append(links);
  return card;
}

async function loadProjects() {
  try {
    const response = await fetch(new URL("../../data/projects.json", import.meta.url));
    if (!response.ok) return;
    const projects = await response.json();
    if (!Array.isArray(projects)) return;
    for (const [type, container] of Object.entries(containers)) {
      if (!container) continue;
      const matching = projects.filter((project) =>
        project && project.type === type &&
        typeof project.name === "string" && project.name.trim() &&
        typeof project.description === "string"
      );
      if (matching.length) container.replaceChildren(...matching.map(createCard));
    }
  } catch {
    // Při nedostupnosti dat zůstává čitelný statický obsah.
  }
}

loadProjects();
