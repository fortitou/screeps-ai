To use first you need to create two branches, `master` and `sim` using the in-game editor. Then just run `node sync.js` from 
your local machine. When you're on your local `master` branch it will push to `master` in game, any other branch (including 
detached states) will push to `sim`. Note that it will push unstaged changes, so be careful when switching to branches with 
modified code.

There is support included for compressing your JS files on the server side via UglifyJS. Some users reported some speedups 
by compressing their code, however I did not notice any significant gains. Furthermore, UglifyJS does not yet support ES6 
features, so it's disabled by default.
