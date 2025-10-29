# Model Context Protocol integration

Model Context Protocol (MCP) connects models to external tools and context. It’s supported by both the Codex CLI and the Codex IDE extension, making it a convenient way to give Codex access to documentation, browsers, or design tooling such as Figma.

## Supported MCP features

Codex supports the following MCP capabilities:

- STDIO servers (launched via a local command)
- Environment variables
- Streamable HTTP servers (reachable via URL)
- Bearer token authentication
- OAuth authentication (enable by setting `experimental_use_rmcp_client = true` in `config.toml`)

## Configure MCP servers

MCP configuration for Codex lives in `~/.codex/config.toml` and is shared between the CLI and IDE extension. You can manage servers either with the CLI or by editing the config file directly.

### CLI workflow

Add a server:

```bash
codex mcp add <server-name> --env VAR1=VALUE1 --env VAR2=VALUE2 -- <stdio server-command>
```

Example – install Context7, a free MCP server for developer documentation:

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp
```

List additional commands with:

```bash
codex mcp --help
```

While codex is running, use `/mcp` inside the terminal UI to view actively connected servers.

### config.toml workflow

For more control, open the configuration file and add an entry under `[mcp_servers.<server-name>]`:

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]

[mcp_servers.context7.env]
MY_ENV_VAR = "MY_ENV_VALUE"
experimental_use_rmcp_client = true

[mcp_servers.figma]
url = "https://mcp.figma.com/mcp"
```

Available fields:

- `command` – required for STDIO servers
- `args` – optional array of command arguments
- `env` – optional environment variables
- `url` – required for HTTP servers
- `bearer_token` – optional token used in the `Authorization` header
- `startup_timeout_sec` – optional startup timeout
- `tool_timeout_sec` – optional timeout per tool execution
- `experimental_use_rmcp_client` – top-level flag enabling the new RMCP client and OAuth for streamable HTTP servers

## Examples of useful MCP servers

Popular servers that pair well with Codex include:

- Context7 — up-to-date developer documentation
- Figma Local or Remote — interact with your design files
- Playwright — automate and inspect a browser
- Chrome Developer Tools — remote-control a Chrome session
- Sentry — surface error logs
- GitHub — manage repositories, pull requests, and issues beyond raw git commands

## Run Codex as an MCP server

Codex itself can operate as an MCP server so that other clients, including custom Agents SDK workflows, can call it.

Start a server:

```bash
codex mcp-server
```

Launch Codex with the Model Context Protocol Inspector:

```bash
npx @modelcontextprotocol/inspector codex mcp-server
```

Send a `tools/list` request to discover the built-in tools:

- `codex` – start a Codex session. Accepts parameters matching the Codex Config struct, including `prompt`, `approval-policy`, `sandbox`, `model`, `profile`, and more.
- `codex-reply` – continue an existing session by providing `conversationId` and a follow-up `prompt`.

Because Codex tasks can take several minutes, increase the MCP Inspector timeouts (`Request` and `Total`) to 600000ms (10 minutes).

### Example: build tic-tac-toe with MCP Inspector

Use the MCP inspector and `codex mcp-server` to build a simple tic-tac-toe game:

| Property          | Value                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| `approval-policy` | `never`                                                               |
| `sandbox`         | `workspace-write`                                                     |
| `prompt`          | `Implement a simple tic-tac-toe game with HTML, Javascript, and CSS.` |

Click **Run Tool** and watch the emitted events as Codex writes `index.html` inside the workspace.

## OAuth-enabled servers

If you need to connect to OAuth-backed MCP servers, enable the RMCP client by adding `experimental_use_rmcp_client = true` to the top level of `config.toml`. This unlocks OAuth authentication for streamable HTTP servers while also switching STDIO connections to the new client implementation.
