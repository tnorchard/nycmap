export function displayHost(url: string) {
  try {
    return new URL(url.startsWith("http") ? url : `https://${url}`).host.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

export function hrefFor(url: string) {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
}
