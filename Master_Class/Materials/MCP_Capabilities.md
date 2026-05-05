# 🔌 Machine Control Protocol (MCP) Capabilities

As an autonomous agent operating within the LeeWay Standards ecosystem, the **Prime Agent** requires explicit, governed tools to interact with the host operating system, filesystem, and internet. 

The following **Machine Control Protocols (MCPs)** have been extracted from the active session and represent the core capability suite of the Sovereign Agent:

## 1. Filesystem & Navigation MCPs
*   **`list_dir`**: Extracts the absolute structure, size, and type of files within a given directory.
*   **`view_file`**: Reads raw file contents to ingest code logic and configuration.
*   **`grep_search`**: Utilizes ultra-fast ripgrep pattern matching across the repository to locate specific logic.

## 2. Code Mutation & Evolution MCPs
*   **`write_to_file`**: Generates and structures entirely new files, directories, and configuration schemas.
*   **`replace_file_content`**: Executes contiguous block edits on existing codebases securely.
*   **`multi_replace_file_content`**: Executes complex, non-contiguous block edits simultaneously across a file without breaking syntax.

## 3. Host Operating System Execution MCPs
*   **`run_command`**: Proposes and executes native CLI commands (PowerShell/Bash) on the host machine. Every command must pass the Governance safety check.
*   **`send_command_input`**: Injects standard input into long-running interactive terminal processes.
*   **`command_status`**: Monitors asynchronous background tasks, builds, and test executions.

## 4. Internet & Perception MCPs
*   **`search_web`**: Queries the live internet for external documentation, latest packages, and context.
*   **`read_url_content`**: Parses and extracts raw markdown from live webpages for documentation ingestion.
*   **`browser_subagent`**: Spawns an autonomous sub-agent to visually navigate, click, and interact with complex web interfaces, enabling the Prime agent to test deployed web apps.

## 5. Generative Media MCPs
*   **`generate_image`**: Synthesizes UI mockups, infographics, and visual assets directly into the repository based on architectural prompts.

---

### Integration with `src/agents/mcp/`
These live prime-level tools map directly to the conceptual agents stored in `src/agents/mcp/` (such as `process-agent.js`, `env-agent.js`, and `transport-agent.js`). They ensure that the AI has deterministic, limited, and governed access to your machine.
