# Minesweeper in nodejs + client side js

#### favicon and tile assets by Dorota Klimczyk
#### 404 error asset from [https://unsplash.com/](https://unsplash.com) by [Rémi Jacquaint](https://unsplash.com/@jack_1?utm_medium=referral&utm_campaign=photographer-credit&utm_content=creditBadge)

This is what it is.  A simple Minesweeper clone served by [nodejs](https://www.nodejs.org/en/) and [expressjs](https://expressjs.com) with game logic in client side [js](https://developer.mozilla.org/en-US/docs/Web/JavaScript) with [jQuery](https://jquery.com).  Styling provided by [Materializecss](https://archives.materializecss.com/0.100.2/) v0.100.2. Emailing is handled by [gmail-send](https://www.npmjs.com/package/gmail-send).  Yes, you can cheat it, since the implementation is client side.  It's buggy.

`npm start` then point your browser to http://localhost:4000  Change the port to connect to in `port` (> 1024; 5000, 6000, 20000, etc).  Create a `gmail-credentials.json` file by visiting https://myaccount.google.com/apppasswords after logging in to a gmail account.  The format of `gmail-credentials.json` is as follows:

```sh
{
  "user": "aUser@gmail.com",
  "pass": "abcdefghijklmnop"
}
```
