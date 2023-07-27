import { EditorLanguage } from "../CodeMirror";

export interface CodeEditorProps {
  label: string;
  value: string;
  language?: EditorLanguage;
  readonly?: boolean;
  overlayText?: string;
  onInput?: (newValue: string) => void;
}
