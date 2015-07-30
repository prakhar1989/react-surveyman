#!/bin/bash
echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"
npm run build
msg="rebuilding app `date`"
if [ $# -eq 1 ]
  then msg="$1"
fi
git commit -am "$msg"
git push origin gh-pages
