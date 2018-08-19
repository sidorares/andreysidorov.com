const cp = require('child_process');

function pushToGHPages() {
  try {
    cp.execSync('git add . && git commit -am "--skip-ci CI test"', {
      cwd: __dirname + '/build'
    });
    cp.execSync('git push origin gh-pages', { cwd: __dirname + '/build' });
  } catch (e) {
    console.log(e.message);
    console.log(e);
  }
}

pushToGHPages();
