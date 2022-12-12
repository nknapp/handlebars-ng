export interface HandlebarsTest {
  filename: string;
  description: string;
  template: string;
  ast: object;
  input: object;
  helpers?: Record<string, string>;
  output: string;
  failsInOriginalHandlebars?: boolean;
}
