# WPDS Assets Manager (Logos, Icons, Illustrations)

Our contribution and installation docs are located https://build.washingtonpost.com/foundations/wam

## Proposed new workflow

1. A pull assets workflow is created in the WPDS repo.
2. The workflow is run on the WPDS repo every day.
3. The workflow pulls the assets from the WPDS repo and saves them in the WPDS repo.
4. The workflow opens a pull request with the icon changes.
5. The commit message has a brief description of the changes (updated icons, new icons, etc).
6. The pull request tags the design team to review
7. The design team reviews the pull request and approves it.
8. The workflow merges the pull request.
9. The workflow updates the WPDS repo with the new assets.
