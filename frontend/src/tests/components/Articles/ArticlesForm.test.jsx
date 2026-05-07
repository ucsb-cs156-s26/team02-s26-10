import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router";
import { expect } from "vitest";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("ArticlesForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByText(/Title/);
    await screen.findByText(/Create/);
    expect(screen.getByText(/Title/)).toBeInTheDocument();
  });

  test("renders correctly when passing in an Article", async () => {
    render(
      <Router>
        <ArticlesForm initialContents={articlesFixtures.oneArticle} />
      </Router>,
    );
    await screen.findByTestId(/ArticlesForm-id/);
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId(/ArticlesForm-id/)).toHaveValue("1");
  });

  test("Correct Error messages on bad input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-dateAdded");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(dateAddedField, { target: { value: "bad-input" } });
    fireEvent.change(emailField, { target: { value: "not-an-email" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Date Added must be in ISO format/);
    expect(
      screen.getByText(/Date Added must be in ISO format/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Email must be a valid email address./),
    ).toBeInTheDocument();
  });

  test("Correct Error messages on missing input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-submit");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/Title is required./);
    expect(screen.getByText(/Title is required./)).toBeInTheDocument();
    expect(screen.getByText(/URL is required./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/Email is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date Added is required./)).toBeInTheDocument();
  });

  test("No Error messages on good input", async () => {
    const mockSubmitAction = vi.fn();

    render(
      <Router>
        <ArticlesForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-title");

    const titleField = screen.getByTestId("ArticlesForm-title");
    const urlField = screen.getByTestId("ArticlesForm-url");
    const explanationField = screen.getByTestId("ArticlesForm-explanation");
    const emailField = screen.getByTestId("ArticlesForm-email");
    const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
    const submitButton = screen.getByTestId("ArticlesForm-submit");

    fireEvent.change(titleField, { target: { value: "Test Article" } });
    fireEvent.change(urlField, { target: { value: "https://example.com" } });
    fireEvent.change(explanationField, { target: { value: "A test article" } });
    fireEvent.change(emailField, { target: { value: "test@example.com" } });
    fireEvent.change(dateAddedField, {
      target: { value: "2022-01-02T12:00:00" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Date Added must be in ISO format/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Email must be a valid email address./),
    ).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>,
    );
    await screen.findByTestId("ArticlesForm-cancel");
    const cancelButton = screen.getByTestId("ArticlesForm-cancel");

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});