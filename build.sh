set -e

# build the server
tsc app.ts --module "commonjs" -t ES5

# build the game
tsc --out public/game.js game/Game.ts -t ES5

# join the libraries
cat libs/*.js > public/libs.js