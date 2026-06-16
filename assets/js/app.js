const appScriptUrl = document.currentScript ? document.currentScript.src : window.location.href;
const iconAssetBaseUrl = new URL("../media/icons/", appScriptUrl).href;

function iconElement(iconName) {
  const image = document.createElement("img");
  image.className = "card-icon";
  image.src = new URL(iconName, iconAssetBaseUrl).href;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  return image;
}

function pageHref(fileName) {
  return window.location.pathname.includes("/pages/") ? `./${fileName}` : `./pages/${fileName}`;
}

function textElement(tagName, text, className) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function clearAndAppend(container, items) {
  container.replaceChildren(...items);
}

function cardElement(item, options = {}) {
  const article = document.createElement("article");
  article.className = `card ${options.className || ""}`.trim();
  article.setAttribute("data-reveal", "");

  if (item.icon) article.append(iconElement(item.icon));
  if (item.category) article.append(textElement("span", item.category, "card-tag"));
  if (item.metric) article.append(textElement("span", item.metric, "card-metric"));
  article.append(textElement("h3", item.title));
  article.append(textElement("p", item.description));

  return article;
}

function renderAbout() {
  const features = document.getElementById("aboutFeatures");
  const panels = document.getElementById("aboutPanels");

  if (features) {
    clearAndAppend(features, siteData.aboutFeatures.map((item) => textElement("li", item)));
  }

  if (panels) {
    const panelItems = siteData.aboutPanels.map((item) => {
      const panel = document.createElement("div");
      panel.setAttribute("data-reveal", "");
      panel.append(textElement("h4", item.heading), textElement("p", item.text));
      return panel;
    });
    clearAndAppend(panels, panelItems);
  }
}

function renderServices() {
  const container = document.getElementById("servicesGrid");
  if (!container) return;
  clearAndAppend(container, siteData.services.map((service) => cardElement(service, { className: "service-card" })));
}

function renderCta() {
  const container = document.getElementById("ctaBanner");
  if (!container) return;

  const copy = document.createElement("div");
  copy.setAttribute("data-reveal", "");
  copy.append(textElement("p", siteData.cta.eyebrow, "eyebrow"), textElement("h2", siteData.cta.headline));

  const link = document.createElement("a");
  link.className = "btn btn-primary";
  link.href = pageHref(siteData.cta.buttonHref);
  link.textContent = siteData.cta.buttonText;

  clearAndAppend(container, [copy, link]);
}

function initGalleryCarousel() {
  const image = document.getElementById("galleryImage");
  const caption = document.getElementById("galleryCaption");
  const previous = document.getElementById("galleryPrev");
  const next = document.getElementById("galleryNext");
  if (!image || !caption || !previous || !next) return;

  const slides = [
    ["./assets/media/images/gallery/666fc69d.avif", "Property gallery", "PRABHUBOLE property gallery image"],
    ["./assets/media/images/gallery/1a22c97e.avif", "Guest accommodation", "PRABHUBOLE guest accommodation image"],
    ["./assets/media/images/gallery/1f26ceb3.avif", "Guest facilities", "PRABHUBOLE guest facilities image"],
    ["./assets/media/images/gallery/24ac6ff2.avif", "Hospitality space", "PRABHUBOLE hospitality space image"],
    ["./assets/media/images/gallery/415ef073.avif", "Property amenity", "PRABHUBOLE property amenity image"],
    ["./assets/media/images/gallery/4c65c16d.avif", "Accommodation detail", "PRABHUBOLE accommodation detail image"],
    ["./assets/media/images/gallery/056489be.avif", "Guest area", "PRABHUBOLE guest area image"],
    ["./assets/media/images/gallery/6a63ac85.avif", "Facility view", "PRABHUBOLE facility view image"],
    ["./assets/media/images/gallery/8fff84fe.avif", "Room feature", "PRABHUBOLE room feature image"],
    ["./assets/media/images/gallery/94153c87.avif", "Property view", "PRABHUBOLE property view image"],
    ["./assets/media/images/gallery/997724fd.avif", "Interior detail", "PRABHUBOLE interior detail image"],
    ["./assets/media/images/gallery/d8964b8b.avif", "Guest service area", "PRABHUBOLE guest service area image"],
    ["./assets/media/images/gallery/e4ba10dd.avif", "Hospitality detail", "PRABHUBOLE hospitality detail image"],
    ["./assets/media/images/gallery/ef9dde5c.avif", "Property detail", "PRABHUBOLE property detail image"],
  ];
  let index = 0;

  function showSlide(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    image.src = slides[index][0];
    caption.textContent = slides[index][1];
    image.alt = slides[index][2];
  }

  previous.addEventListener("click", () => showSlide(index - 1));
  next.addEventListener("click", () => showSlide(index + 1));
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll("[data-reveal]");

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((section) => observer.observe(section));
}

function initializeContent() {
  renderAbout();
  renderServices();
  renderCta();
  initGalleryCarousel();
  initRevealAnimations();
}

document.addEventListener("DOMContentLoaded", initializeContent);
