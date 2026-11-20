const FAV_KEY = "seedvault:favorites";

export function loadLocalFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveLocalFavorites(favorites: string[]) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
}
