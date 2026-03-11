import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

// Mock scrollIntoView as it's not implemented in JSDOM
window.HTMLElement.prototype.scrollIntoView = vi.fn();
