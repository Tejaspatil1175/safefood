import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/app/")({
  beforeLoad: () => {
    throw redirect({ to: "/app/$", params: { _splat: "user/dashboard" } });
  },
  component: () => null,
});
