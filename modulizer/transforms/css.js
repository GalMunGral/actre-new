const postcss = require("postcss");
const path = require("path");
const fs = require("fs");
const util = require("util");
const config = require("../config");

const copyFile = util.promisify(fs.copyFile);
const writeFile = util.promisify(fs.writeFile);
const root = process.cwd();

module.exports = (file) => {
  const context = path.dirname(file.path);
  const tasks = [];

  const plugin = () => {
    return {
      postcssPlugin: "transform-url",
      Declaration(decl) {
        const matches = decl.value.matchAll(/url\((.*?)\)/g);
        for (let match of matches) {
          const resource = match[1]
            .replace(/^['"`](.*)['"`]$/, "$1") // remove quotes
            .replace(/[?#].*$/, ""); // remove queries and hashes
          if (resource.startsWith(".")) {
            const modulePath = path.join(context, resource);
            const filename = path.basename(resource);
            const outputPath = path.join(root, config.contentBase, filename);
            tasks.push(copyFile(modulePath, outputPath));
            decl.value = decl.value.replace(
              /* original url */ match[0],
              `url(/${filename})`
            );
          }
        }
      },
    };
  };
  plugin.postcss = true;

  const filename = path.basename(file.path);
  const outputPath = path.join(root, config.contentBase, filename);
  tasks.push(
    postcss([plugin])
      .process(file.content, { from: file.path })
      .then((result) =>
        writeFile(outputPath, result.css, { encoding: "utf-8" })
      )
  );

  return Promise.all(tasks).then(() => {
    return {
      ...file,
      content: `\
\
const link = document.createElement('link');
link.rel = "stylesheet";
link.href = "/${filename}";
document.head.appendChild(link);

export default "/${filename}";
\
`,
    };
  });

  // return Promise.all(tasks).then(([result]) => {
  //   const escapedCss = result.css.replace(/\\/g, "\\\\");
  //   // BUGFIX: All backslashes need to be escaped when put inside a literal, i.e. `\` => `"\\"`
  //   return {
  //     ...file,
  //     content: `
  //       const style = \`${escapedCss}\`;

  //       const styleElement = document.createElement('style');
  //       styleElement.textContent = style;
  //       document.head.appendChild(styleElement)

  //       export default style;
  //     `,
  //   };
  // });
};
