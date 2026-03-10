import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpAcc } from "../../src/components/auth/signup-account";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "@redux/api/apiSlice";
import { toast, Toaster } from "sonner";
import { server } from "./vitest.setup";
import { useRouter } from "next/navigation";

const mkPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mkPush,
    refresh: vi.fn()
  })
}))

vi.mock("next/headers", () => ({
  cookies: () => ({
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  }),
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
  });

describe("SignUpAcc", () => {

  let testStore: ReturnType<typeof createTestStore>;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    testStore = createTestStore();
    user = userEvent.setup();

    render(
      <Provider store={testStore}>
        <Toaster />
        <SignUpAcc>
          <button data-testid="sign-up-button">Open</button>
        </SignUpAcc>
      </Provider>
    );
  });

  afterEach(() => {
    // unmounts the comonents that we defined in render()
    cleanup();

    // Since we are using the Dialog from shadcn, we need to 
    // clear the innerHTML, to avoid multiple instances of the dialog
    document.body.innerHTML = "";
  });

  it("should successfully register a user and redirect to home", async () => {

    await user.click(screen.getByTestId("sign-up-button"));

    await user.type(screen.getByTestId("name"), "John Doe");
    await user.type(screen.getByTestId("username"), "validuser");
    await user.type(screen.getByTestId("email"), "john@example.com");
    await user.type(screen.getByTestId("phone"), "12345678901");
    await user.type(screen.getByTestId("key"), "password123");
    await user.type(screen.getByTestId("keyConfirm"), "password123");

    const submitBtn = screen.getByTestId("create-account-button");
    await user.click(submitBtn);

    await waitFor(() => {
      const successToast = document.querySelector(".toast-success");

      expect(successToast).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mkPush).toHaveBeenCalledWith("/home");
    });
  });

})