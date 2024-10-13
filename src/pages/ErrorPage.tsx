import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

function errorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    return error.message;
  } else if (typeof error === "string") {
    return error;
  } else {
    console.error(error);
    return "Unknown error";
  }
}

export default function ErrorPage() {
  const error = errorMessage(useRouteError());

  return (
    <>
      <p>Looks like something went wrong...</p>
      <p>
        <i>{error}</i>
      </p>

      <Link to="/" style={{ textDecoration: "underline" }}>
        Return home
      </Link>
    </>
  );
}
