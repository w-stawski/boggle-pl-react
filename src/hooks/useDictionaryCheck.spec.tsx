import { act, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useEffect } from "react";
import { useDictionaryCheck } from "./useDictionaryCheck";
import type { Word } from "../utils/types";

type DictApi = ReturnType<typeof useDictionaryCheck>;

type MockResponse = {
  ok: boolean;
  json: () => Promise<Word[]>;
};

function DictHarness({ onReady }: { onReady: (api: DictApi) => void }) {
  const api = useDictionaryCheck();

  useEffect(() => {
    onReady(api);
  }, [onReady, api]);

  return (
    <div>
      <span data-testid="loading">{api.areResultsLoading ? "1" : "0"}</span>
      <span data-testid="count">{api.checkedWords.length}</span>
    </div>
  );
}

describe("useDictionaryCheck", () => {
  it("sets loading=true while fetch is pending and applies results", async () => {
    const checkWords = vi.fn();

    const pending: { resolve?: (resp: MockResponse) => void } = {};
    globalThis.fetch = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        pending.resolve = resolve;
      });
    }) as unknown as typeof fetch;

    let api: DictApi | null = null;
    const onReady = (hook: DictApi) => {
      api = hook;
    };

    render(<DictHarness onReady={onReady} />);

    await waitFor(() => expect(api).not.toBeNull());
    const getApi = (): DictApi => {
      if (!api) throw new Error("api not ready");
      return api;
    };

    const words: Word[] = [{ val: "TEST", points: null }];

    act(() => {
      checkWords.mockImplementation(() => getApi().checkWords(words));
      getApi().checkWords(words);
    });

    await waitFor(() =>
      expect(screen.getByTestId("loading").textContent).toBe("1"),
    );

    act(() => {
      pending.resolve?.({
        ok: true,
        json: async () => [{ val: "TEST", points: 3 }],
      });
    });

    await waitFor(() =>
      expect(screen.getByTestId("count").textContent).toBe("1"),
    );
    expect(getApi().checkedWords[0]).toEqual({ val: "TEST", points: 3 });
  });

  it("only applies the latest request results (race safety)", async () => {
    let resolve1: ((resp: MockResponse) => void) | null = null;
    let resolve2: ((resp: MockResponse) => void) | null = null;

    globalThis.fetch = vi.fn()
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolve1 = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolve2 = resolve;
          }),
      );

    let api: DictApi | null = null;
    render(
      <DictHarness
        onReady={(hook) => {
          api = hook;
        }}
      />,
    );

    await waitFor(() => expect(api).not.toBeNull());
    const getApi = (): DictApi => {
      if (!api) throw new Error("api not ready");
      return api;
    };

    const words1: Word[] = [{ val: "A", points: null }];
    const words2: Word[] = [{ val: "B", points: null }];

    act(() => {
      getApi().checkWords(words1);
      getApi().checkWords(words2);
    });

    // Resolve second request first
    act(() => {
      resolve2?.({
        ok: true,
        json: async () => [{ val: "B", points: 7 }],
      });
    });

    await waitFor(() =>
      expect(screen.getByTestId("count").textContent).toBe("1"),
    );
    expect(getApi().checkedWords[0]).toEqual({ val: "B", points: 7 });

    // Resolve first request afterwards; should NOT override
    act(() => {
      resolve1?.({
        ok: true,
        json: async () => [{ val: "A", points: 2 }],
      });
    });

    await waitFor(() =>
      expect(getApi().checkedWords[0]).toEqual({ val: "B", points: 7 }),
    );
  });

  it("does not update state after unmount (unmount safety)", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    let resolve1: ((resp: MockResponse) => void) | null = null;

    globalThis.fetch = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolve1 = resolve;
      });
    }) as unknown as typeof fetch;

    let api: DictApi | null = null;
    const { unmount } = render(
      <DictHarness
        onReady={(hook) => {
          api = hook;
        }}
      />,
    );

    await waitFor(() => expect(api).not.toBeNull());
    const getApi = (): DictApi => {
      if (!api) throw new Error("api not ready");
      return api;
    };

    const words: Word[] = [{ val: "TEST", points: null }];

    act(() => {
      getApi().checkWords(words);
    });

    unmount();

    act(() => {
      resolve1?.({
        ok: true,
        json: async () => [{ val: "TEST", points: 3 }],
      });
    });

    // Allow promise queue to flush
    await act(async () => {
      await Promise.resolve();
    });

    // If unmounted state updates happened, React would warn via console.error.
    expect(console.error).not.toHaveBeenCalled();
  });
});

