# Summary

This is a minimal project to reproduce an issue in `Clinic.js`:
- https://github.com/clinicjs/node-clinic/issues/447

Steps (`pnpm`):
1. Start Dev Container
2. Install dependencies: `pnpm i`
3. Build project: `pnpm build`
4. Run clinic.js: `NO_INSIGHT=1 pnpm exec clinic flame -- node ./dist/index.js`

Steps (`npm`):
1. Start Dev Container
2. Install dependencies: `npm i`
3. Build project: `npm run build`
4. Run clinic.js: `NO_INSIGHT=1 npm exec clinic flame -- -- node ./dist/index.js`
