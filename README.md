# WPDS Assets Manager (Logos, Icons, Illustrations)

[Our contribution and installation docs](https://build.washingtonpost.com/foundations/wam)

## Using our WAM Bot to upload assets

1. Download [Hoppscotch](https://hoppscotch.io/).
2. Open Hoppscotch and create a new request.
3. Set the request method to `POST`.
4. Set the request URL to `https://wpds-assets-manager.preview.now.washingtonpost.com/api/upload`.
5. Set the request body to `multipart/form-data`.
6. Add a key called `[nameOfIcon].svg` and set the value to the file you want to upload.
7. Click submit and wait for the response.
8. Then check our GitHub pull requests to see if the bot has created a PR for you.
9. If the bot has created a PR, then ask for a peer to review and merge it.
