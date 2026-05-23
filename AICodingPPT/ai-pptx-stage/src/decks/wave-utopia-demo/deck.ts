import { defineDeck, wide16x9 } from "../../deck/authoring";
import { slide as agentStart } from "./pages/001-agent-start/page";
import { slide as optimizationConflict } from "./pages/002-optimization-conflict/page";
import { slide as selfDefinition } from "./pages/003-self-definition/page";
import { theme } from "./theme";

export const deck = defineDeck({
  id: "wave-utopia-demo",
  title: "Wave Utopia AI Coding 决赛演示",
  size: wide16x9,
  theme,
  slides: [agentStart, optimizationConflict, selfDefinition]
});

export default deck;
