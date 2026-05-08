import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
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

describe("RecommendationRequestCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();

  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /recommendationrequest", async () => {
    const queryClient = new QueryClient();
    const recommendationRequest = {
      id: 3,
      requesterEmail: "cgaucho@ucsb.edu",
      professorEmail: "phtcon@ucsb.edu",
      explanation: "BS/MS program",
      dateRequested: "2022-04-20T00:00",
      dateNeeded: "2022-05-01T00:00",
      done: false,
    };

    axiosMock
      .onPost("/api/recommendationrequest/post")
      .reply(202, recommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Requester Email"), {
      target: { value: "cgaucho@ucsb.edu" },
    });
    fireEvent.change(screen.getByLabelText("Professor Email"), {
      target: { value: "phtcon@ucsb.edu" },
    });
    fireEvent.change(screen.getByLabelText("Explanation"), {
      target: { value: "BS/MS program" },
    });
    fireEvent.change(screen.getByLabelText("Date Requested"), {
      target: { value: "2022-04-20T00:00" },
    });
    fireEvent.change(screen.getByLabelText("Date Needed"), {
      target: { value: "2022-05-01T00:00" },
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "cgaucho@ucsb.edu",
      professorEmail: "phtcon@ucsb.edu",
      explanation: "BS/MS program",
      dateRequested: "2022-04-20T00:00",
      dateNeeded: "2022-05-01T00:00",
      done: false,
    });

    expect(mockToast).toBeCalledWith(
      "New Recommendation Request Created - id: 3",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });
  });
});
