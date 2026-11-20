"use client";

import { initSuperTokens } from "../config/supertokens";

if (typeof window !== "undefined") {
  initSuperTokens();
}

export default function SuperTokensInit() {
  return null;
}
