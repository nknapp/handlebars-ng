import "@testing-library/jest-dom";
import { vi } from "vitest";
import "@vitest/web-worker";

vi.mock("./internal-components/CodeMirror/CodeMirror.tsx");
