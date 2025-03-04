import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store";
import Registration from "../pages/auth/Registration";
import { useRegisterUserMutation } from "../store/api/userApiSlice";
import { toast } from "react-toastify";

jest.mock("../store/api/userApiSlice", () => ({
  useRegisterUserMutation: jest.fn(),
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

const renderRegistration = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Registration />
      </MemoryRouter>
    </Provider>
  );

describe("Registration Page Tests", () => {
  let mockRegisterUser: jest.Mock;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockRegisterUser = jest.fn().mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({}),
    });
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useRegisterUserMutation as jest.Mock).mockReturnValue([mockRegisterUser, { isLoading: false }]);
  });

  it("Registration form displays test", () => {
    renderRegistration();

    expect(screen.getByPlaceholderText(/Namn/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Lösenord/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Registrera/i })).toBeInTheDocument();
  });

  it("Empty inputs test", async () => {
    renderRegistration();

    fireEvent.click(screen.getByRole("button", { name: /Registrera/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Alla fält måste fyllas i!", { position: "top-right" });
    });
  });

  it("Invalid email test", async () => {
    renderRegistration();

    fireEvent.change(screen.getByPlaceholderText(/Namn/i), { target: { value: "Andy Gud" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "andy@.se" } });
    fireEvent.change(screen.getByPlaceholderText(/Lösenord/i), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /Registrera/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Ange en giltig e-postadress!", { position: "top-right" });
    });
  });

  it("Short password test", async () => {
    renderRegistration();

    fireEvent.change(screen.getByPlaceholderText(/Namn/i), { target: { value: "Andy Gud" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "andy@gud.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Lösenord/i), { target: { value: "123" } });

    fireEvent.click(screen.getByRole("button", { name: /Registrera/i }));

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith("Lösenordet måste vara minst 6 tecken långt!", { position: "top-right" });
    });
  });

  it("redirects after successful registration test", async () => {
    renderRegistration();

    fireEvent.change(screen.getByPlaceholderText(/Namn/i), { target: { value: "Andy Gud" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "andy@gud.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Lösenord/i), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /Registrera/i }));

    await waitFor(() => expect(mockRegisterUser).toHaveBeenCalledTimes(1));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("Duplicate user error test", async () => {
    mockRegisterUser.mockReturnValueOnce({
      unwrap: jest.fn().mockRejectedValue({ originalStatus: 400 }),
    });

    renderRegistration();

    fireEvent.change(screen.getByPlaceholderText(/Namn/i), { target: { value: "Andy Gud" } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: "andy@gud.com" } });
    fireEvent.change(screen.getByPlaceholderText(/Lösenord/i), { target: { value: "123456" } });

    fireEvent.click(screen.getByRole("button", { name: /Registrera/i }));

    await waitFor(() => expect(mockRegisterUser).toHaveBeenCalledTimes(1));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Användaren finns redan!", { position: "top-right" });
    });
  });
});
