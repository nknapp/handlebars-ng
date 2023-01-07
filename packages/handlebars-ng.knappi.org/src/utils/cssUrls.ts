/**
 * We can use this when we need to pass icon urls in astro-components to the styles. See Defaultlayout.astro
 */
export function cssUrls(
  varNameToPath: Record<string, string>
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(varNameToPath).map(wrapValueWithUrl)
  );
}

function wrapValueWithUrl([key, value]: [string, string]): [string, string] {
  return [key, `url('${value}')`];
}
