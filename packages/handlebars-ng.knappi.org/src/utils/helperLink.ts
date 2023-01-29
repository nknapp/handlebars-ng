export interface HelperLinkReturn {
  slug: string;
  hash: string;
  path: string;
}

export function helperLink(name: string): HelperLinkReturn {
  const slug = name.replace(/\W/, "_");
  const hash = "#" + slug;
  return {
    slug,
    hash,
    path: `/helper-definitions/`,
  };
}

export function helperDefinitionUrl(name: string): string {
  const { path, hash } = helperLink(name);
  return `${path}${hash}`;
}
