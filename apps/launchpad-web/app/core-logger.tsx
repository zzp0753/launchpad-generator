'use client';

import { useEffect } from "react";
import { CORE_LOADED } from "@packages/core";

export function CoreLogger() {
  useEffect(() => {
    console.log("core", CORE_LOADED);
  }, []);

  return null;
}
