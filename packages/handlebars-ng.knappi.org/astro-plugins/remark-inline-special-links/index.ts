import { Plugin } from "unified";
import { visit } from "./visit";
import { LinkCollector } from "./LinkCollector";
import { MyNode, SpecialLinksConfig } from "./types";
import { createComponentCall } from "./createComponentCall";
import { createImports } from "./createImports";

export { FILENAME, DATA } from "./LinkCollector";
export { SpecialLinksConfig } from "./types";

interface Link extends MyNode {
  url: string;
}

export const inlineSpecialLinks: Plugin = (options: SpecialLinksConfig) => {
  return (tree: MyNode, file) => {
    const links = new LinkCollector(file.path, options);
    for (const { node, replaceWith } of visit<Link>(tree, "link")) {
      const replacement = links.replacementForLink(node.url);
      if (replacement != null) {
        const newLocal = createComponentCall(replacement);
        replaceWith(newLocal);
      }
    }

    if (links.importsRequired) {
      const imports = createImports([...links.imports]);
      tree.children?.unshift(imports);
      file.extname = ".mdx";
    }
  };
};
