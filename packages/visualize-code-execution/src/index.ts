import fs from "fs";
import path from "path";
import os from "os";
import { execSync, spawn } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { Frame, Step, Variables } from "./types.js";

export async function visualizeCodeExecution(html: string): Promise<string> {
  const codes = html.matchAll(
    /<code [^>]*? data-visualize-execution[^>]*?>([\w\W]*?)<\/code>/gm
  );

  for (const result of Array.from(codes).reverse()) {
    let code = cleanUpCode(result[1]);

    const startIndex = result.index + result[0].length - result[1].length - 7;
    const endIndex = result.index + result[0].length + 6;

    const visualizationCode = await codeExecutionVisualization(code);
    html = html.slice(0, endIndex) + visualizationCode + html.slice(endIndex);
    console.log(html);
  }

  return html;
}

function cleanUpCode(code: string): string {
  if (!code.match(/fn main\(\)/gm)) {
    code = `fn main() {
        ${code}
      }`;
  }

  code = code.replaceAll(/^.*?\/\/ Error.*?$/gm, "\n");
  code = code.replaceAll(/&lt;/gm, "<");
  code = code.replaceAll(/&gt;/gm, ">");

  console.log(code);
  return code;
}

async function codeExecutionVisualization(rustCode: string): Promise<string> {
  const cratePath = createTmpCrate(rustCode);

  execSync("cargo build --target-dir target", {
    cwd: cratePath,
  });
  const steps = await executeAndDebugProgram(cratePath);

  const id = `rust-execution-visualizer-${uuidv4()}`;

  return `<rust-execution-visualizer id="${id}"></rust-execution-visualizer>

    ${steps
      .map(
        (step) => `
      <script-fragment>
        <script type="text/template">
      document.querySelector("#${id}").frames = JSON.parse('${JSON.stringify(
          step
        ).replaceAll("\\", "\\\\")}');
        </script>
      </script-fragment>
      `
      )
      .join("")}
    `;
}

function createTmpCrate(code: string): string {
  const tmpDir = fs.mkdtempSync(
    path.join(os.tmpdir(), "visualize-code-execution")
  );
  fs.mkdirSync(`${tmpDir}/src`);

  fs.writeFileSync(`${tmpDir}/Cargo.toml`, cargoToml());
  fs.writeFileSync(`${tmpDir}/src/main.rs`, code);

  return tmpDir;
}

function cargoToml() {
  return `[package]
name = "inline-code"
version = "0.1.0"
edition = "2021"

[profile.dev]
opt-level = 0
`;
}

async function executeAndDebugProgram(cratePath: string): Promise<Step[]> {
  const rustGdb = spawn("rust-gdb", ["target/debug/inline-code"], {
    cwd: cratePath,
  });

  const code = fs.readFileSync(`${cratePath}/src/main.rs`).toString();
  const codeLines = code.split("\n").length;

  await expect(rustGdb, "(gdb) ");
  await runAndExpect(rustGdb, "break 1", /\(gdb\) $/gm, 3000);
  await runAndExpect(rustGdb, "run", /\(gdb\) $/gm, 3000, 1000);
  await runAndExpect(rustGdb, "clear", /\(gdb\) $/gm);

  const steps: Step[] = [];

  let finished = false;

  while (!finished) {
    const frameMatches = await runAndExpect(
      rustGdb,
      "backtrace full",
      /#(\d) .*? inline_code::(?:.*?::)*(.*?) \((.*?)\) at src\/(.*?).rs:(\d+)\n([^#]*)/gm
    );

    const frames: Frame[] = [];

    for (let i = 0; i < frameMatches.length; i++) {
      const match = frameMatches[i];
      const variables: Variables = {};

      const functionArguments = match[3]
        .split(", ")
        .filter((a) => a !== "")
        .map((arg) => arg.split("=")[0]);

      const variablesNames = functionArguments;

      const localVars = match[6];

      if (!localVars.includes("No locals.")) {
        const varMatches = localVars.matchAll(/\s*([^= ]+?) = [^\n]+/gm);
        for (const varName of [...varMatches]) {
          if (!variablesNames.includes(varName[1])) {
            variablesNames.push(varName[1]);
          }
        }
      }
      await runAndExpect(rustGdb, `frame ${i}`, /.*/gm);

      for (const varName of variablesNames) {
        const typeMatches = await runAndExpect(
          rustGdb,
          `ptype ${varName}`,
          /[^=]* = (.*)/gm
        );
        const type = typeMatches[0][1];
        const printMatches = await runAndExpect(
          rustGdb,
          `print ${varName}`,
          /[^=]* = (.*)$/gm
        );

        const value = printMatches[0][1];

        variables[varName] = {
          type,
          value,
        };
      }

      frames.push({
        fn_name: match[2],
        line: parseInt(match[5]),
        variables,
      });
    }
    steps.push(frames);

    try {
      await runAndExpect(rustGdb, "step", /.*/gm, 5000, 1000);
    } catch (e) {}
    let whereMatches = await runAndExpect(
      rustGdb,
      "where",
      /#0[\s\S]*?\s+at\s*? (.*?):(\d+)$/gm
    );
    while (whereMatches[0][1] !== "src/main.rs") {
      await runAndExpect(rustGdb, "finish", /\(gdb\) /gm);
      whereMatches = await runAndExpect(
        rustGdb,
        "where",
        /#0[\s\S]*?\s+at\s*? (.*?):(\d+)$/gm
      );
      if (parseInt(whereMatches[0][2]) === codeLines) {
        finished = true;
        break;
      }
    }
  }

  console.log(JSON.stringify(steps));

  rustGdb.stdin.write("q\n");

  return steps;
}

async function expect(child, expectation, timeout = 3000) {
  return new Promise((resolve, reject) => {
    child.stdout.on("data", (data) => {
      if (typeof expectation === "string") {
        if (data.toString() === expectation) resolve(data.toString());
      } else {
        const results = [...data.toString().matchAll(expectation)];
        if (results.length > 0) resolve(results);
      }
    });
    child.stderr.on("data", (data) => reject(data.toString()));

    setTimeout(() => reject("Timeout reached"), timeout);
  });
}

async function runAndExpect(
  child,
  command: string,
  expectation: RegExp,
  timeout = 3000,
  stdoutTimeout = 50
): Promise<RegExpMatchArray[]> {
  return new Promise((resolve, reject) => {
    let result = "";
    child.stdin.write(command + "\n");
    child.stdout.on("data", (data) => (result += data.toString() + "\n"));
    child.stderr.on("data", (data) => reject(data.toString()));
    setTimeout(() => {
      const results = [...result.matchAll(expectation)];
      if (results.length > 0) resolve(results);
    }, stdoutTimeout);
    setTimeout(() => reject("Timeout reached"), timeout);
  });
}

async function runAndExpectString(
  child,
  command: string,
  expectation: string,
  timeout = 3000,
  stdoutTimeout = 50
): Promise<void> {
  return new Promise((resolve, reject) => {
    let result = "";
    child.stdin.write(command + "\n");
    child.stdout.on("data", (data) => (result += data.toString() + "\n"));
    child.stderr.on("data", (data) => reject(data.toString()));
    setTimeout(() => {
      if (result === expectation) resolve(undefined);
    }, stdoutTimeout);
    setTimeout(() => reject("Timeout reached"), timeout);
  });
}
