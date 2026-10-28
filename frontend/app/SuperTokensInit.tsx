"use client";

import { useEffect, useRef } from "react";
import { initSuperTokens } from "../config/supertokens";

export default function SuperTokensInit() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initSuperTokens();
      initialized.current = true;
    }
  }, []);

  return null;
}
