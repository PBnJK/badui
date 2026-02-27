# Phone Number Plinko! (Plinkophone™)

For [borked](https://borked.irtaza.xyz/) and [flavortown](https://flavortown.hackclub.com)

## Screenshots

![Screenshot of Plinkophone running](https://raw.githubusercontent.com/pbnJK/badui/main/static/screenshot1.png)

## What is this?

This repo contains a (purposefully) annoyingly-designed input system for phone
numbers in online forms in the form of a game of Plinko, implemented in pure
HTML/CSS + JavaScript. It also looks pretty [ugly](#faq)

## How does it work?

The more important/interesting calculations can be found on the `js/ball.js` and
`js/collision.js` files, the former calculating the ball physics, and, the latter,
ball & hole collisions. The website just uses a `canvas` node to render stuff,
nothing fancy.

It's really not a technical marvel or anything...

## How do I use it?

Since this doesn't have any dynamic, fancy-schmancy web stuff, you can just clone
or download the repo and open the `index.html` file on your web browser of choice,
and it will be fully playable. Of course, you can always use good ol' `python -m SimpleHTTPServer`
or [live-server](https://www.npmjs.com/package/live-server) if you really need to
look at this through localhost (I used the latter for hot-reloading)

You can also access it on my [personal website](https://pbnjk.github.io/badui)!

## Credits

## FAQ

> Brother I can't see anything

Tack on `?pretty` to the URL for nicer colors... (/me rolls eyes)
