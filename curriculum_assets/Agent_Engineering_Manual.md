# TECHNICAL MANUAL: Leeway Agent Engineering & ReAct Patterns

## Objective: Build Sovereign Tool-Calling Intelligence

This manual breaks down the "Intelligence Layer" of the Leeway framework. Architects should use these patterns to build portable agent logic following LeeWay Standards.

---

### 1. The ReAct Pattern (Reason + Act)
Traditional models predict the next token. Agents **predict the next action.**
The loop must follow this sequence:
1.  **Thought:** The agent analyzes the goal and current state.
2.  **Action:** The agent selects a specific tool (e.g., Search, Calculator, Database).
3.  **Observation:** The agent receives the output from the tool.
4.  **Reflection:** The agent decides if the goal is met or if another loop is needed.

### 2. Standard Tool Interface (TypeScript)
Your agents are only as good as their tools. Use this interface for all custom munitions:

```typescript
interface LeewayTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: any) => Promise<string>;
}
```

### 3. Prompt Engineering: The Leeway Standard
A LeeWay-compliant prompt follows the **S.O.V.E.R.E.I.G.N.** method:
*   **S**ituation: Establish role and environment.
*   **O**bjective: Define the primary mission goal.
*   **V**erification: How will success be measured?
*   **E**xecution: Step-by-step instructions.
*   **R**estrictions: Non-negotiable constraints.
*   **E**rror paths: What to do if tools fail.
*   **I**ntent: The "Why" behind the request.
*   **G**overnance: Reference specific LeeWay Standards.
*   **N**ode: Identify the processing node (e.g., Aria, Vector).

---

### 🛠️ Architect Challenge
**Mission:** Integrate a "Memory Retrieval" tool into your basic Agent Class.
**Requirement:** The agent must pull historical context from a local Vector Store to resolve an ambiguous architectural query.
