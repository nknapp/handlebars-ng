export type EditorLanguage = "handlebars" | "javascript" | "json" | "html";

export interface CodeMirrorProps {
  id: string;
  value: string;
  language?: EditorLanguage | undefined;
  onInput?: (value: string) => void;
  readonly?: boolean;
}
