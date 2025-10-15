const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
  name: "esbuild-problem-matcher",

  setup(build) {
    build.onStart(() => {
      console.log("[watch] build started");
    });
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        console.error(
          `    ${location.file}:${location.line}:${location.column}:`
        );
      });
      console.log("[watch] build finished");
    });
  },
};

async function main() {
  // Copy webview files
  const webviewsSource = "src/webviews";
  const webviewsTarget = "dist/webviews";

  // Create target directory if it doesn't exist
  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist");
  }
  if (!fs.existsSync(webviewsTarget)) {
    fs.mkdirSync(webviewsTarget);
  }

  // Copy all HTML files
  if (fs.existsSync(webviewsSource)) {
    const files = fs.readdirSync(webviewsSource);
    files.forEach((file) => {
      if (file.endsWith(".html")) {
        fs.copyFileSync(
          path.join(webviewsSource, file),
          path.join(webviewsTarget, file)
        );
        console.log(`Copied ${file} to dist/webviews/`);
      }
    });

    // Copy assets folder
    const assetsSource = path.join(webviewsSource, "assets");
    const assetsTarget = path.join(webviewsTarget, "assets");

    if (fs.existsSync(assetsSource)) {
      // Create assets directories
      if (!fs.existsSync(assetsTarget)) {
        fs.mkdirSync(assetsTarget, { recursive: true });
      }

      // Function to copy directory recursively
      function copyDir(src, dest) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }

        const entries = fs.readdirSync(src, { withFileTypes: true });

        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);

          if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(
              `Copied ${path.relative(
                "src/webviews",
                srcPath
              )} to dist/webviews/`
            );
          }
        }
      }

      copyDir(assetsSource, assetsTarget);
    }
  }

  // Copy favicon.ico to dist
  if (fs.existsSync("favicon.ico")) {
    fs.copyFileSync("favicon.ico", "dist/favicon.ico");
    console.log("Copied favicon.ico to dist/");
  }

  // Copy services folder
  const servicesSource = "src/services";
  const servicesTarget = "dist/services";

  if (fs.existsSync(servicesSource)) {
    if (!fs.existsSync(servicesTarget)) {
      fs.mkdirSync(servicesTarget, { recursive: true });
    }

    const serviceFiles = fs.readdirSync(servicesSource);
    serviceFiles.forEach((file) => {
      if (file.endsWith(".js")) {
        fs.copyFileSync(
          path.join(servicesSource, file),
          path.join(servicesTarget, file)
        );
        console.log(`Copied ${file} to dist/services/`);
      }
    });
  }

  const ctx = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    format: "cjs",
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: "node",
    outfile: "dist/extension.js",
    external: ["vscode"],
    logLevel: "silent",
    plugins: [
      /* add to the end of plugins array */
      esbuildProblemMatcherPlugin,
    ],
  });
  if (watch) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
