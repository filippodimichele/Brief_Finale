import DOM, { withPlugins } from "just-dom";
import { createRouterPlugin } from "@just-dom/router";
import { lucidePlugin } from "@just-dom/lucide";

const router = createRouterPlugin();

// @just-dom/signals — import { createSignal, reactive, effect, computed } where needed

export const jd = withPlugins(DOM, [router, lucidePlugin]);