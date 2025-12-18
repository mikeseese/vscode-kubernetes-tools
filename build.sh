# replace the package.json version with a suffix of -dev and increment the last patch version
rm -rf *.vsix
jq --indent 4 '.version |= (split(".") | .[0:2] + [((.[2]|tonumber) + 1|tostring)] | join("."))' package.json > package.tmp.json && mv package.tmp.json package.json
jq --indent 4 '.version += "-dev"' package.json > package.tmp.json && mv package.tmp.json package.json

yarn
yarn package

git restore package.json yarn.lock
