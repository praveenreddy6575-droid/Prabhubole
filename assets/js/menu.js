const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const mobileNavQuery = window.matchMedia("(max-width: 1120px)");

function pageKeyFromPath(path) {
  const page = path.split("/").pop() || "index.html";
  if (page === "" || page === "index.html" || page === "index") return "home";
  return page.replace(".html", "");
}

function pageKeyFromHref(href) {
  if (!href) return "";
  const page = href.split("/").pop();
  return page === "" || page === "index.html" || page === "index" ? "home" : page.replace(".html", "");
}

function setActiveNav(pageKey) {
  navLinks.forEach((link) => {
    const linkKey = pageKeyFromHref(link.getAttribute("href"));
    const isActive = linkKey === pageKey;
    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function navFocusables() {
  if (!nav) return [];
  return [...nav.querySelectorAll("a, button, select, input, textarea, [tabindex]")];
}

function syncMobileNavState() {
  if (!nav || !toggle) return;
  const isMobile = mobileNavQuery.matches;
  const isOpen = nav.classList.contains("open");
  nav.setAttribute("aria-hidden", String(isMobile && !isOpen));

  navFocusables().forEach((item) => {
    if (isMobile && !isOpen) {
      item.setAttribute("tabindex", "-1");
    } else {
      item.removeAttribute("tabindex");
    }
  });
}

function closeNav() {
  if (!nav || !toggle) return;
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open navigation");
  syncMobileNavState();
}

function toggleNav() {
  if (!nav || !toggle) return;
  const expanded = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!expanded));
  toggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
  nav.classList.toggle("open", !expanded);
  syncMobileNavState();
}

if (toggle && nav) {
  toggle.addEventListener("click", toggleNav);

  navLinks.forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("resize", () => {
    if (!mobileNavQuery.matches && nav.classList.contains("open")) {
      closeNav();
    }
    syncMobileNavState();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNav();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setActiveNav(pageKeyFromPath(window.location.pathname));
  syncMobileNavState();
});
