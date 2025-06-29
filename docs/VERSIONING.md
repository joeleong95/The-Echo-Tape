# Versioning

The release number lives in the `version` field of `package.json` and follows a
standard `MAJOR.MINOR.PATCH` format. The build script reads this value and
embeds it into the service worker’s `CACHE_NAME`. Bumping the version forces
users to fetch a new cache of the application.
The 0.0.x numbering scheme began with release 0.0.3.

To publish a new version:

1. Add your changes to `CHANGELOG.md` under the latest heading.
2. Update the `version` in `package.json`.
3. If you changed any episode JSON, run `npm run build-episodes`.
4. Run `npm test` to ensure all checks pass before committing.

The numbers are purely for ordering releases and do not imply API stability.
