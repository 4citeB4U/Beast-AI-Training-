/**
 * LEEWAY COMPLIANCE HEADER
 * Path: /Master_Class/Module_2_Agent_Anatomy_LLM_School.md
 * Status: ACTIVE COMPLIANCE MONITORING
 */

# Module 2: Agent Anatomy — The "LLM School" Framework

LeeWay agents are not just simple prompts; they are structured, sovereign units of intelligence. 

## Skill Atoms vs. Workflows
*   **Skill Atoms:** Expertise is broken into "Skill Atoms"—small, modular units of capability (e.g., Code Generation, Security Auditing, Web Crawling). Currently, the ecosystem manages between 44 and 52 production-ready skills.
*   **Workflows:** "Proven sequences" that compose 5-10 skill atoms into end-to-end processes.

## The Triple-Threat Memory System
To achieve true "Lifelong Learning," agents do not just execute; they utilize three distinct memory layers:
1. **Episodic:** Remembering specific past tasks and their outcomes. This provides instant recall for immediate context.
2. **Semantic:** Storing facts, persistent knowledge, and world-data over the long term.
3. **Procedural:** Learning the "how"—the proven sequences and workflows required to execute complex tasks flawlessly.

## Autonomous Improvement
Agents perform a "Veritas" self-audit after tasks to build knowledge, making them "smarter immediately" without manual human retraining. Every task builds persistent knowledge.

## Example: Skill Atom JSON Definition
To make this concrete, here is how a single Skill Atom is defined in the system before being loaded by the Execution Engine:
```json
{
  "atom_id": "SKILL_NOVA_004",
  "name": "Syntax Auto-Fixer",
  "family": "NovaForge",
  "description": "Automatically repairs broken python syntax detected by the Veritas Gate.",
  "required_memory": ["Episodic", "Procedural"],
  "compliance_target": 85
}
```
