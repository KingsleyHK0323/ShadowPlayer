/* Authored by: OpenAI-Codex_Responsible: Website */
(() => {
  "use strict";

  const themeKey = "shadowplayer-theme";
  const themes = new Set(["system", "light", "dark"]);
  const themePicker = document.querySelector(".theme-picker");
  const themeSelect = document.querySelector("#theme-select");

  function applyTheme(value) {
    const theme = themes.has(value) ? value : "system";
    document.documentElement.dataset.theme = theme;
    if (themeSelect) themeSelect.value = theme;
  }

  if (themePicker && themeSelect) {
    let savedTheme = "system";
    try {
      savedTheme = localStorage.getItem(themeKey) || "system";
    } catch {
      // The selected theme remains usable for this page when storage is blocked.
    }
    applyTheme(savedTheme);
    themePicker.hidden = false;
    themeSelect.addEventListener("change", () => {
      applyTheme(themeSelect.value);
      try {
        localStorage.setItem(themeKey, themeSelect.value);
      } catch {
        // Continue with the current page's selection.
      }
    });
    window.addEventListener("storage", (event) => {
      if (event.key === themeKey) applyTheme(event.newValue);
    });
  }

  const search = document.querySelector("#guide-search");
  const searchContainer = document.querySelector(".guide-search");
  const searchStatus = document.querySelector("[data-search-status]");
  const noResults = document.querySelector("[data-no-results]");
  const topics = Array.from(document.querySelectorAll("[data-guide-topic]"));
  if (search && searchContainer && searchStatus && noResults && topics.length) {
    const filterTopics = () => {
      const query = search.value.trim().toLowerCase();
      let count = 0;
      for (const topic of topics) {
        const matches = topic.textContent.toLowerCase().includes(query);
        topic.hidden = !matches;
        if (matches) count += 1;
      }
      noResults.hidden = count !== 0;
      searchStatus.textContent = query ? `${count} ${count === 1 ? "topic" : "topics"} found.` : "Searches the topics on this page.";
    };
    search.addEventListener("input", filterTopics);
    document.querySelectorAll(".guide-aside a").forEach((link) => {
      link.addEventListener("click", () => {
        if (search.value) {
          search.value = "";
          filterTopics();
        }
      });
    });
    searchContainer.hidden = false;
  }

  const apiStatus = document.querySelector("[data-api-status]");
  if (!apiStatus) return;

  const repoUrl = "https://api.github.com/repos/KingsleyHK0323/ShadowPlayer";
  const stars = document.querySelector('[data-stat="stars"]');
  const forks = document.querySelector('[data-stat="forks"]');
  const release = document.querySelector('[data-stat="release"]');
  const contributors = document.querySelector("[data-contributors]");
  const contributorStatus = document.querySelector("[data-contributor-status]");
  apiStatus.textContent = "Loading public GitHub data…";

  async function fetchJson(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } });
      if (!response.ok) {
        const error = new Error("GitHub request failed");
        error.status = response.status;
        throw error;
      }
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }

  function validCount(value) {
    return Number.isSafeInteger(value) && value >= 0;
  }

  function addContributor(person) {
    if (!person || typeof person.login !== "string" || !/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(person.login)) return false;
    let avatar;
    try {
      avatar = new URL(person.avatar_url);
    } catch {
      return false;
    }
    if (avatar.protocol !== "https:" || avatar.hostname !== "avatars.githubusercontent.com") return false;
    const item = document.createElement("li");
    const link = document.createElement("a");
    const image = document.createElement("img");
    link.href = `https://github.com/${encodeURIComponent(person.login)}`;
    link.setAttribute("aria-label", `View ${person.login} on GitHub`);
    image.src = avatar.href;
    image.alt = "";
    image.width = 32;
    image.height = 32;
    image.loading = "lazy";
    image.referrerPolicy = "no-referrer";
    link.append(image);
    item.append(link);
    contributors.append(item);
    return true;
  }

  Promise.allSettled([
    fetchJson(repoUrl),
    fetchJson(`${repoUrl}/releases/latest`),
    fetchJson(`${repoUrl}/contributors?per_page=6`),
  ]).then(([repoResult, releaseResult, contributorResult]) => {
    let unavailable = false;
    const repo = repoResult.status === "fulfilled" ? repoResult.value : null;
    const repoAvailable = Boolean(repo && validCount(repo.stargazers_count) && validCount(repo.forks_count));
    if (repoAvailable) {
      stars.textContent = repo.stargazers_count.toLocaleString();
      forks.textContent = repo.forks_count.toLocaleString();
    } else {
      unavailable = true;
    }
    if (releaseResult.status === "fulfilled" && typeof releaseResult.value?.tag_name === "string" && releaseResult.value.tag_name.trim()) {
      release.textContent = releaseResult.value.tag_name.trim().slice(0, 60);
    } else if (repoAvailable && releaseResult.status === "rejected" && releaseResult.reason?.status === 404) {
      release.textContent = "No stable release";
    } else {
      release.textContent = "Unavailable";
      unavailable = true;
    }
    if (contributorResult.status === "fulfilled" && Array.isArray(contributorResult.value)) {
      const shown = contributorResult.value.slice(0, 6).filter(addContributor).length;
      contributorStatus.textContent = shown ? "" : "No contributors to show";
    } else {
      contributorStatus.textContent = "Unavailable";
      unavailable = true;
    }
    apiStatus.textContent = unavailable ? "Some GitHub data is unavailable. Visit the repository for current information." : "Public GitHub data loaded for this visit.";
  });
})();
