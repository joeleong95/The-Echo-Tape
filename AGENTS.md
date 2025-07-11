# Agent Guidelines

This repository uses an agent-assisted workflow. Please follow the guidelines below when making changes.

**Project status**: The first episode is targeting roughly one hour of gameplay, but less than 10% of it has been produced so far.

## Running Tests
- Run `npm test` after any code change. This executes `test/check.js` to ensure required files exist and that `script.js` passes syntax checks.
- Run `npm run lint` to check style and catch common issues.
- If you edit any episode JSON, run `npm run build-episodes` first to regenerate the `.js` files before testing.
- GitHub Actions automatically runs `npm test` and `npm run lint` on every pull request.

## Writing Episodes
- Episode files live under the `episodes/` directory.
- Follow the structure and tips in `WRITING_GUIDE.md` when adding or editing episodes.
- After changing any episode JSON, run `npm run build-episodes` to regenerate the corresponding `.js` files. Commit the generated `.js` alongside the `.json`.

## Coding Conventions
- Keep JavaScript code valid for Node. The tests run `node -c` against `script.js`.
- Stick to the existing style (use semicolons and `const`/`let`).

## Assets
- Place audio in the `audio/` folder.
- Use the CSS classes defined in `style.css` (e.g., `dialogue`, `choice-btn`) for consistency.

## Workflow Notes
- Document notable changes in `CHANGELOG.md`.
- Modify `package.json` scripts only when necessary.
