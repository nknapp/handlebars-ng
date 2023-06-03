import { EditorLanguage } from "../CodeMirror";

export interface CodeEditorProps {
  label: string;
  value: string;
  language?: EditorLanguage;
  readonly?: boolean;
  onInput?: (newValue: string) => void;
}
