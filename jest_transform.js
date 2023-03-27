'use strict';

const swcJest = require('@swc/jest');

const lImport = 'import '.length;
const lGlobals = '//@jest/globals";\n"use strict";\n'.length;
const lFrom = ' from "'.length;

module.exports = {
  createTransformer(opts) {
    const swcTransformer = swcJest.createTransformer(opts);

    return {
      ...swcTransformer,
      process(sourceText, sourcePath, options) {
        const globalsImport = sourceText.indexOf('@jest/globals');
        if (globalsImport < 0) {
          return swcTransformer.process(sourceText, sourcePath, options);
        }

        const lineStart = sourceText
          .slice(0, globalsImport)
          .lastIndexOf('import');

        const preamble = sourceText.slice(0, lineStart);
        const imports = sourceText.slice(
          lineStart + lImport,
          globalsImport - lFrom,
        );

        sourceText = `${preamble}//${sourceText.slice(lineStart)}`;
        const result = swcTransformer.process(sourceText, sourcePath, options);

        const code = result.code.slice(globalsImport + lGlobals);
        result.code = `${preamble}"use strict";\nconst ${imports} = require("@jest/globals");\n${code}`;

        return result;
      },
    };
  },
};
