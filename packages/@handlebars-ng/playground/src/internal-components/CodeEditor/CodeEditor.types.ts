import { EditorLanguage } from "../CodeMirror";

export interface CodeEditorProps {
  label: string;
  value: string;
  language?: EditorLanguage;
  onInput: (newValue: string) => void;
}
