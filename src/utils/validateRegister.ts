import { EmailPasswordInput } from "src/resolvers/EmailPasswordInput";

export const validateRegister = (credentials: EmailPasswordInput) => {
  if (!credentials.email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }

  if (credentials.email.length <= 2) {
    return [
      {
        field: "email",
        message: "length must be grater than 2",
      },
    ];
  }

  if (credentials.password.length <= 3) {
    return [
      {
        field: "password",
        message: "length must be grater than 3",
      },
    ];
  }

  return null;
};
