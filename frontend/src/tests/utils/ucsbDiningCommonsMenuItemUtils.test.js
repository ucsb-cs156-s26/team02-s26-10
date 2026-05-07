import {
  onDeleteSuccess,
  cellToAxiosParamsDelete,
} from "main/utils/ucsbDiningCommonsMenuItemUtils";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

describe("ucsbDiningCommonsMenuItemUtils tests", () => {
  test("onDeleteSuccess logs and toasts the message", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation();

    onDeleteSuccess("Item deleted");

    expect(consoleSpy).toHaveBeenCalledWith("Item deleted");
    expect(toast).toHaveBeenCalledWith("Item deleted");

    consoleSpy.mockRestore();
  });

  test("cellToAxiosParamsDelete returns correct params", () => {
    const cell = { row: { original: { id: 42 } } };

    const result = cellToAxiosParamsDelete(cell);

    expect(result).toEqual({
      url: "/api/ucsbdiningcommonsmenuitem",
      method: "DELETE",
      params: { id: 42 },
    });
  });
});
