const cp = require('child_process');

function pushToGHPages() {
  try {
    /*
    cp.execSync('git add . && git commit -am "--skip-ci CI test"', {
      cwd: __dirname + '/build'
    });
    cp.execSync('git push origin gh-pages', { cwd: __dirname + '/build' });
    */
    cp.execSync('git config --global user.email "sidorares@yandex.com"');
    cp.execSync('git config --global user.name "Andrey Sidorov"');
    cp.execSync('git init', { cwd: __dirname + '/build' });
    cp.execSync('git co -b gh-pages', { cwd: __dirname + '/build' });
    cp.execSync('git add origin  https://$GITHUB_TOKEN:x-oauth-basic@github.com/sidorares/andreysidorov.com.git', {
      cwd: __dirname + '/build'
    });
    cp.execSync('git add .', { cwd: __dirname + '/build' });
    cp.execSync('git commit -m "--skip-ci build artefacts"', { cwd: __dirname + '/build' });
    cp.execSync('git push --force origin gh-pages', { cwd: __dirname + '/build' });
  } catch (e) {
    console.log(e.message);
    console.log(e);
  }
}

pushToGHPages();
