import React from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

type State = "idle" | "invalid" | "checking" | "ok" | "taken";

type Props = { min: number; max: number };

function useLoginCheck({ min, max }: Props) {
  const [value, setValue] = React.useState("");
  const [state, setState] = React.useState<State>("idle");

  const controller = React.useRef<AbortController | null>(null);
  const timer = React.useRef<number | null>(null);

  const onChangeLogin = (v: string) => {
    setValue(v);
    if (controller.current) controller.current.abort();
    if (timer.current) window.clearTimeout(timer.current);

    if (!v || v.length < min || v.length > max) {
      setState(v ? "invalid" : "idle");
      return;
    }

    setState("checking");
    timer.current = window.setTimeout(async () => {
      try {
        controller.current = new AbortController();
        const res = await fetch(
          `http://localhost:5000/api/check-login?login=${encodeURIComponent(
            v
          )}`,
          { signal: controller.current.signal }
        );
        const data = await res.json().catch(() => ({} as any));
        const taken = !!data?.result;
        setState(taken ? "taken" : "ok");
      } catch {
        setState("idle");
      }
    }, 400);
  };

  const validateStatus =
    state === "invalid"
      ? "error"
      : state === "taken"
      ? "error"
      : state === "ok"
      ? "success"
      : state === "checking"
      ? "validating"
      : "";

  const help =
    state === "invalid"
      ? `Логин от ${min} до ${max} символов`
      : state === "taken"
      ? "Логин занят"
      : undefined;

  const suffix =
    state === "ok" ? (
      <CheckCircleOutlined style={{ color: "#52c41a" }} />
    ) : state === "taken" ? (
      <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
    ) : null;

  return {
    state,
    value,
    onChangeLogin,
    validateStatus,
    help,
    suffix,
    isTaken: state === "taken",
    isChecking: state === "checking",
  };
}

export default useLoginCheck;
