import { apiRequest } from "./api-client.js";

const menuToggle = document.querySelector("#menu-toggle");
const siteNav = document.querySelector("#site-nav");
const year = document.querySelector("#year");

if (year) year.textContent = String(new Date().getFullYear());

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav?.classList.toggle("is-open") ?? false;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

// A health check confirms the API is reachable; it does not imply optional services are configured.
apiRequest("/health")
  .then((result) => {
    document.documentElement.dataset.apiStatus = result.status === "ok" ? "online" : "unknown";
  })
  .catch(() => {
    document.documentElement.dataset.apiStatus = "offline";
  });
