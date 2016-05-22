Reads markdown files and spellchecks them, using [open source dictionary files](#dictionaries-being-used).

## CLI Usage

```katex
  hello katex
```


There fare two modes, interactive fixing, which will allow you to fix mistakes and add exceptions to a custom dictionary and a report mode which will report the list of errors.

### CLI Options

### Excluding patterns

Multiple patterns can be used on the command line and can use `!` for negation. for example.

```
mdspell '**/*.md' '!**/node_modules/**/*.md'
```

#### Ignore numbers (`-n`, `--ignore-numbers`)

Ignores numbers like `1.2` and `1,2.4`.

```js
   function hello() {
     console.log('hello, world');
   }
```

#### Ignore acronyms (`-a`, `--ignore-acronyms`)

Ignores acronyms like `NPM`. Also ignores numbers. Does not ignore single letters for example. `U`.

#### No suggestions (`-x`, `--no-suggestions`)

Suggestions are slow at present, so use this to remove them.

#### American English (`--en-us`)

Use the American English dictionary. We default to British English but will change in the next major to American.

#### British English (`--en-gb`)

Use the British English dictionary. We default default to British English but will change in the next major to American.

#### Spanish (`--es-es`)

Use the Spanish dictionary.

#### Dictionary (`-d`, `--dictionary`)

Specify a custom dictionary to load. The passed filename should not include a file extension and `markdown-spellcheck` will try to load the file with `.aif` and `.dic` extensions.

### Interactive Mode

The default interactive mode shows you the context of the spelling mistake and gives you options with what to do about it. for example.

```
Spelling - readme.md
 shows you the context of the speling mistake and gives you options
?   (Use arrow keys)
  Ignore
  Add to file ignores
  Add to dictionary - case insensitive
> Enter correct spelling
  spelling
  spieling
  spewing
  selling
  peeling
```

Where `speling` will be highlighted in red.

 * "Ignore" will ignore that word and not ask about it again in the current run. If you re-run the command again though, it will appear.
 * "Add to file ignores" will ignore the word in this file only.
 * "Add to dictionary - case insensitive" will add to the dictionary for all files and match any case. for example. with the word `Microsoft` both `Microsoft` and `microsoft` would match.
 * "Add to dictionary - case sensitive" will add to the dictionary for all files and match the case that has been used. for example with the word `Microsoft`, the word `microsoft` will not match.

All exclusions will be stored in a `.spelling` file in the directory from which you run the command.

### Report Mode

Using the `--report` (`-r`) option will show a report of all the spelling mistakes that have been found. This mode is useful for CI build reports.

## `.spelling` files

The `.spelling` file is self documenting as it includes...

```
# markdown-spellcheck spelling configuration file
# Format - lines begining # are comments
# global dictionary is at the start, file overrides afterwards
# one word per line, to define a file override use ' - filename'
# where filename is relative to this configuration file
```

## Use To Stop Spelling Regressions

### Usage with `npm`

Add to your `package.json` and then run in report mode. If new spelling errors occur that are not ignored in the `.spelling` file, an error exit code will be set.

For instance, if your `package.json` has:

```
  "scripts": {
    "test": "gulp test"
  },
```

Change it to...

```json
  "scripts": {
    "test": "mdspell -r **/*.md && gulp test"
  },
```

### Usage in `grunt`

See [grunt-mdspell](https://github.com/ColinEberhardt/grunt-mdspell).

### Usage in `gulp`

### Dictionaries being used

#### English-GB

See [https://github.com/marcoagpinto/aoo-mozilla-en-dict](https://github.com/marcoagpinto/aoo-mozilla-en-dict).

Missing word? Raise it at [https://github.com/marcoagpinto/aoo-mozilla-en-dict/issues](https://github.com/marcoagpinto/aoo-mozilla-en-dict/issues).

#### English-US

See [http://wordlist.aspell.net/dicts/](http://wordlist.aspell.net/dicts/).

Missing word? Raise it at [https://github.com/kevina/wordlist/issues](https://github.com/kevina/wordlist/issues).
