import React, { useEffect, useRef, useState } from "react";
import { CheckCircleOutlined } from "@ant-design/icons";
import { checkLoginApi } from "../../api/auth";

type State = "idle" | "checking" | "ok" | "taken";

type Options = {
  min: number;
  max: number;
  debounceMs?: number;
};

export default function useLoginCheck(opts: Options) {
  const { min, max, debounceMs = 400 } = opts;

  const [state, setState] = useState<State>("idle");
  const timer = useRef<number | null>(null);

  const onChangeLogin = (value: string) => {
    if (!value || value.length < min || value.length > max) {
      setState("idle");
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = null;
      return;
    }

    setState("checking");
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(async () => {
      const res = await checkLoginApi(value);

      const raw = (res as any)?.data;
      const available =
        res?.ok && raw && typeof raw.available === "boolean"
          ? (raw.available as boolean)
          : undefined;

      if (available === true) {
        setState("ok");
      } else if (available === false) {
        setState("taken");
      } else {
        setState("idle");
      }
    }, debounceMs) as unknown as number;
  };

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const validateStatus =
    state === "taken" ? "error" : state === "ok" ? "success" : undefined;

  const help = state === "taken" ? "Логин занят" : undefined;

  const suffix =
    state === "ok" ? (
      <CheckCircleOutlined style={{ color: "#52c41a" }} />
    ) : null;

  return { state, onChangeLogin, validateStatus, help, suffix };
}
