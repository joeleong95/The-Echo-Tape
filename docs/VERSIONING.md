# Versioning

This project uses a simple four-part build number: `MAJOR.MODERATE.MINOR.HOTFIX`.
Only the hotfix digit increments for each release. Changes from several days may
be grouped under one number when they are small.

To publish a new version:

1. Add your changes to `CHANGELOG.md` under the latest heading.
2. Bump the build number and update the date.
3. Run `npm test` to ensure all checks pass. If you changed any episode JSON,
   run `npm run build-episodes` first.

The numbers do not reflect API stability—they just provide an ordered list of
releases.
