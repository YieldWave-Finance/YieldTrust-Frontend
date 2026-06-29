import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import Home from "../page";

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  cleanup();
});

describe("Home page", () => {
  it("renders the loading skeleton while fetching", () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as unknown as typeof fetch;

    const { container } = render(<Home />);

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders the error state when fetch fails", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: "Server error" }),
      }),
    ) as unknown as typeof fetch;

    render(<Home />);

    const retryButton = await screen.findByText("Retry");
    expect(retryButton).toBeInTheDocument();
  });

  it("renders escrow table and grant cards on success", async () => {
    const mockData = {
      escrows: [
        {
          id: "esc-1",
          title: "Test Escrow",
          amount: "1000",
          status: "funded",
          beneficiary: "GABCD...",
          createdAt: "2026-01-01",
        },
      ],
      grants: [
        {
          id: "gr-1",
          name: "Test Grant",
          totalAllocated: "50000",
          totalDistributed: "15000",
          recipientCount: 3,
          active: true,
        },
      ],
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      }),
    ) as unknown as typeof fetch;

    render(<Home />);

    expect(
      await screen.findByRole("heading", {
        name: "Dashboard",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Active Grants")).toBeInTheDocument();
    expect(screen.getByText("Escrows")).toBeInTheDocument();
    expect(screen.getByText(/Total Active Grants/i)).toBeInTheDocument();
    expect(await screen.findByText("Test Escrow")).toBeInTheDocument();
    expect(await screen.findByText("Test Grant")).toBeInTheDocument();
  });
});
