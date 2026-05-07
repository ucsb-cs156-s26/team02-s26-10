import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
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

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("ArticlesCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  test("renders without crashing", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("ArticlesForm-title")).toBeInTheDocument();
    });
  });

  test("when you fill in the form and hit submit, it makes a request to the backend", async () => {
    const queryClient = new QueryClient();

    const article = {
      id: 17,
      title: "Test Article",
      url: "https://example.com/article",
      explanation: "This is a useful article.",
      email: "test@example.com",
      dateAdded: "2022-04-20T00:00",
    };

    axiosMock.onPost("/api/articles/post").reply(202, article);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("ArticlesForm-title")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId("ArticlesForm-title"), {
      target: { value: "Test Article" },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-url"), {
      target: { value: "https://example.com/article" },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-explanation"), {
      target: { value: "This is a useful article." },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-dateAdded"), {
      target: { value: "2022-04-20T00:00" },
    });

    fireEvent.click(screen.getByTestId("ArticlesForm-submit"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].url).toBe("/api/articles/post");
    expect(axiosMock.history.post[0].params).toEqual({
      title: "Test Article",
      url: "https://example.com/article",
      explanation: "This is a useful article.",
      email: "test@example.com",
      dateAdded: "2022-04-20T00:00",
    });

    expect(mockToast).toBeCalledWith(
      "New Article Created - id: 17 title: Test Article",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/articles" });
  });
});
