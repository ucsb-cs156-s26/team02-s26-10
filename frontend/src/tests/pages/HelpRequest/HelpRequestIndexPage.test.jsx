import { render, screen, waitFor } from "@testing-library/react";
import HelpRequestIndexPage from "main/pages/HelpRequest/HelpRequestIndexPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

describe("HelpRequestIndexPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const setupAdminUser = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.adminUser);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();

  test("Renders empty table without crashing for ordinary user", async () => {
    setupUserOnly();
    axiosMock.onGet("/api/helprequest/all").reply(200, []);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Help Requests")).toBeInTheDocument();
    });

    const createButton = screen.queryByText("Create Help Request");
    expect(createButton).not.toBeInTheDocument();
  });

  test("renders three help requests correctly for regular user", async () => {
    setupUserOnly();
    axiosMock
      .onGet("/api/helprequest/all")
      .reply(200, helpRequestFixtures.threeRequests);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("HelpRequestTable-cell-row-0-col-id"),
      ).toHaveTextContent("1");
    });

    expect(
      screen.getByTestId("HelpRequestTable-cell-row-1-col-id"),
    ).toHaveTextContent("2");
    expect(
      screen.getByTestId("HelpRequestTable-cell-row-2-col-id"),
    ).toHaveTextContent("3");

    const createButton = screen.queryByText("Create Help Request");
    expect(createButton).not.toBeInTheDocument();
  });

  test("renders three help requests and create button for admin user", async () => {
    setupAdminUser();
    axiosMock
      .onGet("/api/helprequest/all")
      .reply(200, helpRequestFixtures.threeRequests);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <HelpRequestIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId("HelpRequestTable-cell-row-0-col-id"),
      ).toHaveTextContent("1");
    });

    expect(
      screen.getByTestId("HelpRequestTable-cell-row-1-col-id"),
    ).toHaveTextContent("2");
    expect(
      screen.getByTestId("HelpRequestTable-cell-row-2-col-id"),
    ).toHaveTextContent("3");

    const createButton = await screen.findByText("Create Help Request");
    expect(createButton).toBeInTheDocument();
    expect(createButton).toHaveAttribute("href", "/helprequest/create");
  });
});
