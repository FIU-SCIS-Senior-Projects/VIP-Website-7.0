previous=$(pwd)
code=$(dirname "$0")

cd ${code}
npm install

cd "${code}/deployment"
npm install

cd ${previous}