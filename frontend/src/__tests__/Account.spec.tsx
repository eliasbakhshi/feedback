import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
import Account from "../pages/user/account";
import { useGetAccountInfoQuery, useUpdatePasswordMutation, useUpdateNameMutation } from "../store/api/userApiSlice";
import { toast } from "react-toastify";

jest.mock("../store/api/userApiSlice", () => ({
  useGetAccountInfoQuery: jest.fn(),
  useUpdatePasswordMutation: jest.fn(),
  useUpdateNameMutation: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const renderAccountPage = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    </Provider>
  );

describe("Account Page Tests", () => {
  let mockUpdateName: jest.Mock;
  let mockUpdatePassword: jest.Mock;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockUpdateName = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({}),
    });
    mockUpdatePassword = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({}),
    });
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useUpdateNameMutation as jest.Mock).mockReturnValue([mockUpdateName, { isLoading: false }]);
    (useUpdatePasswordMutation as jest.Mock).mockReturnValue([mockUpdatePassword, { isLoading: false }]);
    (useGetAccountInfoQuery as jest.Mock).mockReturnValue({
      data: [{ fullname: "Andy Gud", email: "andy@gud.com" }],
    });
  });

  it("Account page displays test", () => {
    renderAccountPage();

    expect(screen.getByText(/Konto inställningar/i)).toBeInTheDocument();
    expect(screen.getByText(/Namn/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Nuvarande lösenord/i)).toBeInTheDocument();
  });

  it("Change name test", async () => {
    renderAccountPage();

    fireEvent.click(screen.getByAltText(/edit name/i));
    fireEvent.change(screen.getByDisplayValue(/Andy Gud/i), { target: { value: "Andy Guden" } });
    fireEvent.click(screen.getByText(/Spara/i));

    await waitFor(() => {
      expect(mockUpdateName).toHaveBeenCalledWith({ UserId: "1", NewName: "Andy Guden" });
      expect(toast.success).toHaveBeenCalledWith("Namn uppdaterad!", { position: "top-right" });
    });
  });

  it("Change password test", async () => {
    renderAccountPage();

    fireEvent.click(screen.getByAltText(/edit password/i));
    fireEvent.change(screen.getByLabelText(/Nuvarande lösenord/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/Nytt lösenord/i), { target: { value: "1234567890" } });
    fireEvent.change(screen.getByLabelText(/Bekräfta lösenord/i), { target: { value: "1234567890" } });
    fireEvent.click(screen.getByText(/Spara/i));

    await waitFor(() => {
      expect(mockUpdatePassword).toHaveBeenCalledWith({
        UserId: "1",
        CurrentPassword: "123456",
        NewPassword: "1234567890",
      });
      expect(toast.success).toHaveBeenCalledWith("Lösenord uppdaterad!", { position: "top-right" });
    });
  });
});
