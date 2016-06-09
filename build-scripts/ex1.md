# Some code:

```js
var body = md.render(ex1);

var html = "test";
```

Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia,

```run-gnuplot
set xrange [0:0.25]
set yrange [0:15]
set samples 400
plot 4*exp(-(x/0.07)**2)+10*exp(-(160*(x-0.14))**2)
```

Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia,

```run-latex
% A Venn diagram with PDF blending
% Author: Stefan Kottwitz
% https://www.packtpub.com/hardware-and-creative/latex-cookbook
\documentclass{minimal}
\usepackage{tikz}
\begin{document}
\begin{tikzpicture}
  \begin{scope}
    \fill[red!30!white]   ( 90:1.2) circle (2);
    \fill[green!30!white] (210:1.2) circle (2);
    \fill[blue!30!white]  (330:1.2) circle (2);
  \end{scope}
  \node at ( 90:2)    {Typography};
  \node at ( 210:2)   {Design};
  \node at ( 330:2)   {Coding};
  \node {\LaTeX};
\end{tikzpicture}
\end{document}
```

comparing KaTeX and native latex

katex:

$$
f(x) = \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi
$$

Latex:

```run-latex
\documentclass{minimal}
\begin{document}
test
$ f(x) = \int_{-\infty}^\infty \hat f(\xi)\,e^{2 \pi i \xi x} \,d\xi $
\end{document}
```



### Latex / tikz graph

```run-latex
% A complete graph
% Author: Quintin Jean-Noël
% <http://moais.imag.fr/membres/jean-noel.quintin/>
\documentclass{minimal}
\usepackage{tikz}
\usetikzlibrary[topaths]
% A counter, since TikZ is not clever enough (yet) to handle
% arbitrary angle systems.
\newcount\mycount
\begin{document}
\begin{tikzpicture}[transform shape]
  %the multiplication with floats is not possible. Thus I split the loop in two.
  \foreach \number in {1,...,8}{
      % Computer angle:
        \mycount=\number
        \advance\mycount by -1
  \multiply\mycount by 45
        \advance\mycount by 0
      \node[draw,circle,inner sep=0.25cm] (N-\number) at (\the\mycount:5.4cm) {};
    }
  \foreach \number in {9,...,16}{
      % Computer angle:
        \mycount=\number
        \advance\mycount by -1
  \multiply\mycount by 45
        \advance\mycount by 22.5
      \node[draw,circle,inner sep=0.25cm] (N-\number) at (\the\mycount:5.4cm) {};
    }
  \foreach \number in {1,...,15}{
        \mycount=\number
        \advance\mycount by 1
  \foreach \numbera in {\the\mycount,...,16}{
    \path (N-\number) edge[->,bend right=3] (N-\numbera)  edge[<-,bend
      left=3] (N-\numbera);
  }
}
\end{tikzpicture}
\end{document}
```

Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia,


```run-dot
digraph {
  unhappy[
    shape="box",
    style=rounded,
    label="React makes you sad."
  ]
  unhappy -> are_you_using_react_boilerplates;

  # Boilerplate Fatigue

  are_you_using_react_boilerplates[
    shape="diamond",
    label="Are you learning
    React by copying from the
    boilerplate projects?"
  ]
  are_you_using_react_boilerplates -> boilerplates_dont_teach[label="yes"]
  are_you_using_react_boilerplates -> steal_from_boilerplates[label="no"]

  boilerplates_dont_teach[
    shape="box",
    label="Learning React by copying boilerplates
    is like learning to cook by eating food in
    fancy restaurants. It doesn’t work. You need
    to start with basics and ignore the fear of
    missing out. It’s unfounded. People create
    boilerplates to show off what they built
    or learned, not to help you learn. They are
    created by and for power users, and are often
    way more experimental than they care to admit.
    Boilerplates compete for attention which leads
    to more bloat. If you’re in it for React, learn
    it in the order Pete Hunt described in his guide:
    https://github.com/petehunt/react-howto.
    Look at boilerplates no sooner than you can
    create your own."
  ]
  boilerplates_dont_teach -> are_you_using_flux

  steal_from_boilerplates[
    shape="box",
    label="While boilerplates are not a good
    way to learn the technologies they combine,
    they are useful to see how these technologies
    can be tied together *after* you’re comfortable
    with each of them independently. It’s a great
    way to discover new technologies but you
    shouldn’t feel obligated to use them at all.
    Don’t give up on boilerplates completely.
    Just keep in mind that a boilerplate is
    a bag of tricks, not a solid base for your app."
  ]
  steal_from_boilerplates -> are_you_using_flux

  # Flux Fatigue

  are_you_using_flux[
    shape="diamond",
    label="Are you using
    a Flux library
    (or Redux)?"
  ]
  are_you_using_flux -> is_too_much_flux[label="yes"]
  are_you_using_flux -> is_not_enough_flux[label="no"]

  is_too_much_flux[
    shape="diamond",
    label="Does it add
    a lot of boilerplate
    for no obvious gain?"
  ]
  is_too_much_flux -> remove_flux[label="yes"]
  is_too_much_flux -> are_you_using_bundler[label="no"]

  is_not_enough_flux[
    shape="diamond",
    label="Do you have a few
    bloated stateful components at the top
    of your component hierarchy that are
    often the source of bugs?"
  ]
  is_not_enough_flux -> add_flux[label="yes"]
  is_not_enough_flux -> are_you_using_bundler[label="no"]

  add_flux[
    shape="box",
    label="Consider adding a Flux library.
    It can help externalize the state
    shared between many components
    and update it consistently."
  ]
  add_flux -> are_you_using_bundler

  remove_flux[
    shape="box",
    label="Remove the Flux library.
    Get a good feel for structuring
    apps in vanilla React by reading
    “Thinking in React” in the official docs."
  ]
  remove_flux -> are_you_using_bundler

  # Bundler Fatigue

  are_you_using_bundler[
    shape="diamond",
    label="Are you using
    a JavaScript bundler
    (e.g. Webpack, Browserify)?"
  ]
  are_you_using_bundler -> are_you_working_on_production_app_with_bundler[label="yes"]
  are_you_using_bundler -> are_you_working_on_production_app_without_bundler[label="no"]

  are_you_working_on_production_app_with_bundler[
    shape="diamond",
    label="Are you working
    on a production app?"
  ]
  are_you_working_on_production_app_with_bundler -> do_you_know_es2015[label="yes"]
  are_you_working_on_production_app_with_bundler -> remove_bundler[label="no"]

  are_you_working_on_production_app_without_bundler[
    shape="diamond",
    label="Are you working
    on a production app?"
  ]
  are_you_working_on_production_app_without_bundler -> add_bundler[label="yes"]
  are_you_working_on_production_app_without_bundler -> do_you_know_es2015[label="no"]

  add_bundler[
    shape="box",
    label="Add a bundler as a build step
    to keep dependencies manageable
    and serve the JavaScript code efficiently.
    Use Google Page Speed insights tool
    to gauge how well you are doing.
    Remember to minify and envify
    your code."
  ]
  add_bundler -> do_you_know_es2015

  remove_bundler[
    shape="box",
    label="There is no need for a bundler
    if you are just learning React.
    Copy https://github.com/jarsbe/react-simple
    and start hacking with no build step.
    Use <script> tags until you are comfortable
    with React and want to learn more about module
    systems and different bundlers."
  ]
  remove_bundler -> do_you_know_es2015

  # ES2015 Fatigue

  do_you_know_es2015[
    shape="diamond",
    label="Do you feel
    comfortable using ES2015 features
    (e.g. classes and fat arrows)?"
  ]
  do_you_know_es2015 -> use_es5[label="no"]
  do_you_know_es2015 -> are_you_using_dangerous_features[label="yes"]

  use_es5[
    shape="box",
    label="Don’t use ES2015 yet.
    You don’t need it to learn React.
    Third-party libraries will often use
    ES2015 syntax in their documentation but
    you don’t need third-party libraries when
    you are just learning React itself.
    When you feel like updating your JavaScript
    knowledge, https://leanpub.com/understandinges6/read
    is an amazing guide. Use http://babeljs.io/repl
    to verify your assumptions."
  ]
  use_es5 -> do_you_update_packages_asap

  # ESnext Fatigue

  are_you_using_dangerous_features[
    shape="diamond",
    label="Are you using
    experimental language features
    that didn’t make it into ES2015
    (e.g. decorators)?"
  ]
  are_you_using_dangerous_features -> can_you_spend_days_on_your_tooling[label="yes"]
  are_you_using_dangerous_features -> do_you_update_packages_asap[label="no"]

  can_you_spend_days_on_your_tooling[
    shape="diamond",
    label="Can you spend days on
    fixing your tooling every few weeks
    due to bugs, incompatibilities,
    and standard changes?"
  ]
  can_you_spend_days_on_your_tooling -> do_you_update_packages_asap[label="yes"]
  can_you_spend_days_on_your_tooling -> stick_to_es2015[label="no"]

  stick_to_es2015[
    shape="box",
    label="Stick to using at most ES2015,
    JSX, and object spread operator."
  ]
  stick_to_es2015 -> do_you_update_packages_asap

  # Semver Fatigue

  do_you_update_packages_asap[
    shape="diamond",
    label="Do you update to new
    major versions of your dependencies
    as they come out?"
  ]
  do_you_update_packages_asap -> give_it_two_months[label="yes"]
  do_you_update_packages_asap -> consider_updating_react[label="no"]

  give_it_two_months[
    shape="box",
    label="Unless we are talking about React
    which is tested heavily before every release,
    consider slowing down rate of package updates.
    You can try new versions of the dependencies but
    it’s best to keep them in a branch for a couple of
    months until the community finds and fixes the
    most common issues. Don’t make decisions based on
    the fear of missing out! When looking for older docs,
    don’t forget to check tagged releases on GitHub, e.g.
    https://github.com/reactjs/react-router/tree/0.13.x/doc"
  ]
  give_it_two_months -> are_you_still_sad

  consider_updating_react[
    shape="box",
    label="This is a good call.
    However we encourage you to
    try (in a branch!) new versions of
    React as soon as they come out.
    Unlike many community packages,
    they are tested heavily by Facebook.
    Keep an eye on the release notes
    as they link to the codemods that
    automate parts of the migration process
    for you."
  ]
  consider_updating_react -> are_you_still_sad

  # End

  are_you_still_sad[
    shape="diamond",
    label="Are you still sad?"
  ]
  are_you_still_sad -> rant[label="yes"];
  are_you_still_sad -> happy[label="no"];

  rant[
    shape="box",
    label="Write a constructive blog post
    about the problems you encountered.
    Refrain from personal attacks.
    Be polite. Help the community
    figure out the solutions. Consider
    another stack that better suits
    your needs (e.g. Ember)."
  ]
  rant -> happy

  happy[
    shape="box",
    label="React makes you happy!
    Or, at least, it doesn’t make you that sad anymore."
  ]
  happy -> share

  share [
    shape="box",
    style=rounded,
    label="Share this flowchart: http://bit.ly/react-makes-you-sad.
    Based on and inspired by https://github.com/petehunt/react-howto."
  ]
}
```
GoT graph (from http://pastebin.com/C1tvnkED)

```run-dot
digraph "A Song of Ice and Fire" {
    fontsize=32;
    label="A Song of Ice and Fire\nChapter Graph";
    labelloc=t;
    ranksep=equally;
    concentrate=true;
    compound=true;

    node [shape=record, color=blue, style=filled, fillcolor=lightsteelblue1]; AGOTKEY [label="A Game\nOf Thrones"];
    AGOT0  [label="Prologue\n(Will)"];                              AGOT1  [label="Bran I"];
    AGOT2  [label="Catelyn I"];                                     AGOT3  [label="Daenerys I"];
    AGOT4  [label="{Eddard I|Robert arrives\nat Winterfell}"];      AGOT5  [label="{Jon I|Royal feast\nat Winterfell}"];
    AGOT6  [label="Catelyn II"];                                    AGOT7  [label="Arya I"];
    AGOT8  [label="Bran II"];                                       AGOT9  [label="Tyrion I"];
    AGOT10 [label="{Jon II|Departure from\nWinterfell}"];           AGOT11 [label="{Daenerys II|Marriage to Drogo}"];
    AGOT12 [label="Eddard II"];                                     AGOT13 [label="Tyrion II"];
    AGOT14 [label="Catelyn III"];                                   AGOT15 [label="Sansa I"];
    AGOT16 [label="Eddard III"];                                    AGOT17 [label="{Bran III|Bran awakens}"];
    AGOT18 [label="Catelyn IV"];                                    AGOT19 [label="Jon III"];
    AGOT20 [label="{Eddard IV|Ned arrives at\nKing's Landing}"];    AGOT21 [label="Tyrion III"];
    AGOT22 [label="Arya II"];                                       AGOT23 [label="{Daenerys III|Dany is pregnant}"];
    AGOT24 [label="Bran IV"];                                       AGOT25 [label="Eddard V"];
    AGOT26 [label="Jon IV"];                                        AGOT27 [label="Eddard VI"];
    AGOT28 [label="{Catelyn V|Catelyn\ncaptures Tyrion}"];          AGOT29 [label="{Sansa II|Tourney of\nthe Hand}"];
    AGOT30 [label="Eddard VII"];                                    AGOT31 [label="Tyrion IV"];
    AGOT32 [label="Arya III"];                                      AGOT33 [label="{Eddard VIII|Robert orders\nDany’s death}"];
    AGOT34 [label="Catelyn VI"];                                    AGOT35 [label="{Eddard IX|Jaime attacks Ned}"];
    AGOT36 [label="Daenerys IV"];                                   AGOT37 [label="Bran V"];
    AGOT38 [label="Tyrion V"];                                      AGOT39 [label="Eddard X"];
    AGOT40 [label="{Catelyn VII|Tyrion's\ntrial}"];                 AGOT41 [label="Jon V"];
    AGOT42 [label="Tyrion VI"];                                     AGOT43 [label="Eddard XI"];
    AGOT44 [label="{Sansa III|Beric sent\nagainst Gregor}"];        AGOT45 [label="Eddard XII"];
    AGOT46 [label="{Daenerys V|Death of Viserys}"];                 AGOT47 [label="{Eddard XIII|Death of Robert}"];
    AGOT48 [label="Jon VI"];                                        AGOT49 [label="Eddard XIV"];
    AGOT50 [label="Arya IV"];                                       AGOT51 [label="{Sansa IV|Letters sent}"];
    AGOT52 [label="Jon VII"];                                       AGOT53 [label="{Bran VI|Robb goes\nto war}"];
    AGOT54 [label="Daenerys VI"];                                   AGOT55 [label="Catelyn VIII"];
    AGOT56 [label="Tyrion VII"];                                    AGOT57 [label="{Sansa V|Barristan\ndismissed}"];
    AGOT58 [label="Eddard XV"];                                     AGOT59 [label="{Catelyn IX|Freys join\nthe Starks}"];
    AGOT60 [label="Jon VIII"];                                      AGOT61 [label="Daenerys VII"];
    AGOT62 [label="{Tyrion VIII|Battle of the\nGreen Fork}"];       AGOT63 [label="{Catelyn X|Whispering Wood|Robb captures Jaime}"];
    AGOT64 [label="Daenerys VIII"];                                 AGOT65 [label="{Arya V|Death of\nNed Stark}"];
    AGOT66 [label="Bran VII"];                                      AGOT67 [label="Sansa VII"];
    AGOT68 [label="Daenerys IX"];                                   AGOT69 [label="Tyrion IX"];
    AGOT70 [label="Jon IX"];                                        AGOT71 [label="{Catelyn XI|Robb declared king}"];
    AGOT72 [label="{Daenerys X|Birth of Dragons}"];

    node [shape=record, color=gold3, style=filled, fillcolor=lemonchiffon1]; ACOKKEY [label="A Clash\nOf Kings"];
    ACOK0  [label="Prologue\n(Cressen)"];                           ACOK1  [label="Arya I"];
    ACOK2  [label="{Sansa I|Joffrey's 13th\nnameday}"];             ACOK3  [label="Tyrion I"];
    ACOK4  [label="Bran I"];                                        ACOK5  [label="Arya II"];
    ACOK6  [label="{Jon I|Great Ranging\ndeparts}"];                ACOK7  [label="Catelyn I"];
    ACOK8  [label="{Tyrion II|Janos sent\nto the Wall}"];           ACOK9  [label="Arya III"];
    ACOK10 [label="{Davos I|Stannis\ndeclared king}"];              ACOK11 [label="{Theon I|Balon\ndeclared king}"];
    ACOK12 [label="Daenerys I"];                                    ACOK13 [label="Jon II"];
    ACOK14 [label="Arya IV"];                                       ACOK15 [label="Tyrion III"];
    ACOK16 [label="Bran II"];                                       ACOK17 [label="Tyrion IV"];
    ACOK18 [label="Sansa II"];                                      ACOK19 [label="Arya V"];
    ACOK20 [label="Tyrion V"];                                      ACOK21 [label="Bran III"];
    ACOK22 [label="{Catelyn II|Stannis besieges\nStorm's End}"];    ACOK23 [label="Jon III"];
    ACOK24 [label="Theon II"];                                      ACOK25 [label="Tyrion VI"];
    ACOK26 [label="{Arya VI|Arrival at\nHarrenhall}"];              ACOK27 [label="{Daenerys II|Dany arrives\nat Qarth}"];
    ACOK28 [label="Bran IV"];                                       ACOK29 [label="Tyrion VII"];
    ACOK30 [label="Arya VII"];                                      ACOK31 [label="{Catelyn III|Stannis and\nRenly parley}"];
    ACOK32 [label="Sansa III"];                                     ACOK33 [label="{Catelyn IV|Death of Renly}"];
    ACOK34 [label="Jon IV"];                                        ACOK35 [label="{Bran V|Reek brought to\nWinterfell}"];
    ACOK36 [label="Tyrion VIII"];                                   ACOK37 [label="{Theon III|Raid on\nStony Shore}"];
    ACOK38 [label="{Arya VIII|Tywin leaves\nHarrenhall}"];          ACOK39 [label="Catelyn V"];
    ACOK40 [label="Daenerys III"];                                  ACOK41 [label="{Tyrion IX|Myrcella sent\nto Dorne|Riot}"];
    ACOK42 [label="{Davos II|Death of Cortnay\nPenrose}"];          ACOK43 [label="Jon V"];
    ACOK44 [label="Tyrion X"];                                      ACOK45 [label="{Catelyn VI|Battle of\nthe Fords}"];
    ACOK46 [label="{Bran VI|Theon takes\nWinterfell}"];             ACOK47 [label="{Arya IX|Bolton takes\nHarrenhall}"];
    ACOK48 [label="Daenerys IV"];                                   ACOK49 [label="Tyrion XI"];
    ACOK50 [label="{Theon IV|'Deaths' of\nBran & Rickon}"];         ACOK51 [label="Jon VI"];
    ACOK52 [label="Sansa IV"];                                      ACOK53 [label="Jon VII"];
    ACOK54 [label="Tyrion XII"];                                    ACOK55 [label="{Catelyn VII|Release of Jaime}"];
    ACOK56 [label="Theon V"];                                       ACOK57 [label="{Sansa V|Battle of\nBlackwater begins}"];
    ACOK58 [label="Davos III"];                                     ACOK59 [label="Tyrion XIII"];
    ACOK60 [label="Sansa VI"];                                      ACOK61 [label="Tyrion XIV"];
    ACOK62 [label="{Sansa VII|Battle of\nBlackwater ends}"];        ACOK63 [label="Daenerys V"];
    ACOK64 [label="Arya X"];                                        ACOK65 [label="Sansa VIII"];
    ACOK66 [label="{Theon VI|Ramsay takes\nWinterfell}"];           ACOK67 [label="Tyrion XV"];
    ACOK68 [label="Jon VIII"];                                      ACOK69 [label="Bran VII"];

    node [shape=record, color=forestgreen, style=filled, fillcolor=darkolivegreen1]; ASOSKEY [label="A Storm\nOf Swords"];
    ASOS0  [label="{Prologue (Chett)|Others attack\nthe Fist}"];    ASOS1  [label="Jaime I"];
    ASOS2  [label="Catelyn I"];                                     ASOS3  [label="Arya I"];
    ASOS4  [label="Tyrion I"];                                      ASOS5  [label="Davos I"];
    ASOS6  [label="Sansa I"];                                       ASOS7  [label="Jon I"];
    ASOS8  [label="Daenerys I"];                                    ASOS9  [label="Bran I"];
    ASOS10 [label="Davos II"];                                      ASOS11 [label="Jaime II"];
    ASOS12 [label="Tyrion II"];                                     ASOS13 [label="Arya II"];
    ASOS14 [label="Catelyn II"];                                    ASOS15 [label="Jon II"];
    ASOS16 [label="Sansa II"];                                      ASOS17 [label="Arya III"];
    ASOS18 [label="Samwell I"];                                     ASOS19 [label="Tyrion III"];
    ASOS20 [label="{Catelyn III|Death of\nRickard Karstark}"];      ASOS21 [label="{Jaime III|Death of\nCleos Frey}"];
    ASOS22 [label="Arya IV"];                                       ASOS23 [label="Daenerys II"];
    ASOS24 [label="Bran II"];                                       ASOS25 [label="Davos III"];
    ASOS26 [label="Jon III"];                                       ASOS27 [label="Daenerys III"];
    ASOS28 [label="{Sansa III|Marriage of\nTyrion & Sansa}"];       ASOS29 [label="Arya V"];
    ASOS30 [label="Jon IV"];                                        ASOS31 [label="Jaime IV"];
    ASOS32 [label="Tyrion IV"];                                     ASOS33 [label="{Samwell II|Death of\nCommander\nMormont}"];
    ASOS34 [label="Arya VI"];                                       ASOS35 [label="{Catelyn IV|Death of\nHoster Tully}"];
    ASOS36 [label="{Davos IV|Davos named\nHand}"];                  ASOS37 [label="Jaime V"];
    ASOS38 [label="{Tyrion V|Oberyn arrives\nat King's Landing}"];  ASOS39 [label="Arya VII"];
    ASOS40 [label="Bran III"];                                      ASOS41 [label="Jon V"];
    ASOS42 [label="Daenerys VI}"];                                  ASOS43 [label="Arya VIII"];
    ASOS44 [label="Jaime VI"];                                      ASOS45 [label="{Catelyn V|Maege & Galbart\nsent to Neck}"];
    ASOS46 [label="Samwell III"];                                   ASOS47 [label="Arya IX"];
    ASOS48 [label="Jon VI"];                                        ASOS49 [label="{Catelyn VI|Red Wedding\nbegins}"];
    ASOS50 [label="Arya X"];                                        ASOS51 [label="{Catelyn VII|Death of\nRobb Stark}"];
    ASOS52 [label="{Arya XI|Red Wedding\nends}"];                   ASOS53 [label="Tyrion VI"];
    ASOS54 [label="Davos V"];                                       ASOS55 [label="{Jon VII|Battle of Castle\nBlack begins}"];
    ASOS56 [label="Bran IV"];                                       ASOS57 [label="Daenerys V"];
    ASOS58 [label="Tyrion VII"];                                    ASOS59 [label="Sansa IV"];
    ASOS60 [label="{Tyrion VIII|Purple\nWedding}"];                 ASOS61 [label="Sansa V"];
    ASOS62 [label="{Jaime VII|arrival at\nKing's Landing}"];        ASOS63 [label="{Davos VI|Stannis leaves\nDragonstone}"];
    ASOS64 [label="Jon VIII"];                                      ASOS65 [label="Arya XII"];
    ASOS66 [label="{Tyrion IX|Tyrion's trial}"];                    ASOS67 [label="Jaime VIII"];
    ASOS68 [label="Sansa VI"];                                      ASOS69 [label="Jon IX"];
    ASOS70 [label="{Tyrion X|Oberyn vs.\nGregor}"];                 ASOS71 [label="{Daenerys VI|Sack of\nMeereen}"];
    ASOS72 [label="{Jaime IX|Ramsay legitimized|Roose goes north}"];ASOS73 [label="{Jon X|Stannis arrives\nat the Wall|Battle of Castle\nBlack ends}"];
    ASOS74 [label="Arya XIII"];                                     ASOS75 [label="Samwell IV"];
    ASOS76 [label="Jon XI"];                                        ASOS77 [label="{Tyrion XI|Death of\nTywin}"];
    ASOS78 [label="Samwell V"];                                     ASOS79 [label="{Jon XII|Jon elected\nLord Commander}"];
    ASOS80 [label="{Sansa VII|Death of\nLysa}"];                    ASOS81 [label="Epilogue\n(Merrett Frey)"];

    node [shape=record, color=firebrick, style=filled, fillcolor=rosybrown1]; AFFCKEY [label="A Feast\nFor Crows"];
    AFFC0  [label="Prologue\n(Pate)"];                              AFFC1  [label="{The Prophet|Call for\nKingsmoot}"];
    AFFC2  [label="The Captain\nof Guards"];                        AFFC3  [label="{Cersei I|Tywin\nfound dead}"];
    AFFC4  [label="Brienne I"];                                     AFFC5  [label="Samwell I"];
    AFFC6  [label="Arya I"];                                        AFFC7  [label="{Cersei II|Tywin’s wake|Small Council\nappointments}"];
    AFFC8  [label="Jaime I"];                                       AFFC9  [label="Brienne II"];
    AFFC10 [label="{Sansa I|Vale Lords\nreject Petyr}"];            AFFC11 [label="The Kraken's\nDaughter"];
    AFFC12 [label="{Cersei III|Wedding of\nMargaery & Tommen}"];    AFFC13 [label="The Soiled\nKnight"];
    AFFC14 [label="Brienne III"];                                   AFFC15 [label="Samwell II"];
    AFFC16 [label="Jaime II"];                                      AFFC17 [label="{Cersei IV|High Septon\nkilled}"];
    AFFC18 [label="The Iron\nCaptain"];                             AFFC19 [label="{The Drowned Man|Kingsmoot\nelects Euron}"];
    AFFC20 [label="Brienne IV"];                                    AFFC21 [label="The\nQueenmaker"];
    AFFC22 [label="Arya II"];                                       AFFC23 [label="Sansa II"];
    AFFC24 [label="Cersei V"];                                      AFFC25 [label="Brienne V"];
    AFFC26 [label="{Samwell III|Sam meets\nArya}"];                 AFFC27 [label="Jaime III"];
    AFFC28 [label="{Cersei VI|Faith Militant\nrestored}"];          AFFC29 [label="{The Reaver|Ironmen take\nShield Islands}"];
    AFFC30 [label="Jaime IV"];                                      AFFC31 [label="Brienne VI"];
    AFFC32 [label="Cersei VII"];                                    AFFC33 [label="Jaime V"];
    AFFC34 [label="Cat of the\nCanals"];                            AFFC35 [label="Samwell IV"];
    AFFC36 [label="{Cersei VIII|Loras takes\nDragonstone}"];        AFFC37 [label="Brienne VII"];
    AFFC38 [label="Jaime VI"];                                      AFFC39 [label="Cersei IX"];
    AFFC40 [label="The Princess\nIn The Tower"];                    AFFC41 [label="Sansa III"];
    AFFC42 [label="Brienne VIII"];                                  AFFC43 [label="{Cersei X|Margaery &\nCersei imprisoned}"];
    AFFC44 [label="{Jaime VII|Snowfall in\nthe Riverlands}"];       AFFC45 [label="Samwell V"];

    node [shape=record, color=lightskyblue4, style=filled, fillcolor=gainsboro]; ADWDKEY [label="A Dance\nWith Dragons"];
    ADWD0  [label="Prologue\n(Varamyr)"];                           ADWD1  [label="Tyrion I"];
    ADWD2  [label="Daenerys I"];                                    ADWD3  [label="Jon I"];
    ADWD4  [label="Bran I"];                                        ADWD5  [label="Tyrion II"];
    ADWD6  [label="The\nMerchant's Man"];                           ADWD7  [label="{Jon II|Death of\nJanos Slynt}"];
    ADWD8  [label="Tyrion III"];                                    ADWD9  [label="Davos I"];
    ADWD10 [label="{Jon III|Wildlings\ncross the Wall}"];           ADWD11 [label="Daenerys II"];
    ADWD12 [label="{Reek I|Ramsay leaves\nthe Dreadfort}"];         ADWD13 [label="Bran II"];
    ADWD14 [label="Tyrion IV"];                                     ADWD15 [label="Davos II"];
    ADWD16 [label="{Daenerys III|Qarth declares\nwar on Meereen}"]; ADWD17 [label="Jon IV"];
    ADWD18 [label="Tyrion V"];                                      ADWD19 [label="{Davos III|Davos is\nimprisoned}"];
    ADWD20 [label="{Reek II|Ramsay takes\nMoat Cailin}"];           ADWD21 [label="Jon V"];
    ADWD22 [label="Tyrion VI"];                                     ADWD23 [label="{Daenerys IV|New Ghis, Tolos,\n& Mantarys ally\nwith Qarth}"];
    ADWD24 [label="The Lost\nLord"];                                ADWD25 [label="The\nWindblown"];
    ADWD26 [label="{The Wayward\nBride|Stannis takes\nDeepwood Motte}"];    ADWD27 [label="Tyrion VII"];
    ADWD28 [label="Jon VI"];                                        ADWD29 [label="Davos IV"];
    ADWD30 [label="Daenerys V"];                                    ADWD31 [label=Melissandre];
    ADWD32 [label="Reek III"];                                      ADWD33 [label="Tyrion VIII"];
    ADWD34 [label="Bran III"];                                      ADWD35 [label="Jon VII"];
    ADWD36 [label="Daenerys VI"];                                   ADWD37 [label="The Prince Of\nWinterfell"];
    ADWD38 [label="The Watcher"];                                   ADWD39 [label="Jon VIII"];
    ADWD40 [label="Tyrion IX"];                                     ADWD41 [label="The\nTurncloak"];
    ADWD42 [label="The King's\nPrize"];                             ADWD43 [label="Daenerys VII"];
    ADWD44 [label="Jon IX"];                                        ADWD45 [label="The Blind\nGirl"];
    ADWD46 [label="A Ghost In\nWinterfell"];                        ADWD47 [label="Tyrion X"];
    ADWD48 [label="{Jaime I|Jaime\ndisappears}"];                   ADWD49 [label="Jon X"];
    ADWD50 [label="Daenerys VIII"];                                 ADWD51 [label="{Theon VII|Escape from\nWinterfell}"];
    ADWD52 [label="Daenerys IX"];                                   ADWD53 [label="Jon XI"];
    ADWD54 [label="Cersei I"];                                      ADWD55 [label="The\nQueensguard"];
    ADWD56 [label="The Iron\nSuitor"];                              ADWD57 [label="Tyrion XI"];
    ADWD58 [label="Jon XII"];                                       ADWD59 [label="The Discarded\nKnight"];
    ADWD60 [label="The Spurned\nSuitor"];                           ADWD61 [label="The Griffin\nReborn"];
    ADWD62 [label="The\nSacrifice"];                                ADWD63 [label="Victarion I"];
    ADWD64 [label="The Ugly\nLittle Girl"];                         ADWD65 [label="Cersei II"];
    ADWD66 [label="Tyrion XII"];                                    ADWD67 [label="The\nKingbreaker"];
    ADWD68 [label="{The\nDragontamer|Dragons released}"];           ADWD69 [label="Jon XIII"];
    ADWD70 [label="The Queen's\nHand"];                             ADWD71 [label="Daenerys X"];
    ADWD72 [label="Epilogue\n(Kevan)"];

    node [shape=rectangle, style=dotted]; EVENTKEY [label="Non-POV\nevent"];
    REDFORK [label="Battle of\nthe Red Fork"];
    OXCROSS [label="Battle\nof Oxcross"];
    DUSKENDALE [label="Battle of\nDuskendale"];
    JEYNE [label="Marriage of\nRobb & Jeyne"];
    RENLY [label="Renly\ndeclared king"];
    BALON [label="Death of Balon\nGreyjoy"];
    SALTPANS [label="Raid on the\nSaltpans"];
    GOLDCO [label="Golden Company\nbreaks contract"];
    CLEON [label="Astapor-Yunkai\nwar begins"];
    ASTAPOR [label="Yunkai defeats\nAstapor"];
    AEGON [label="Golden Company\ncrosses to Westeros"];
    HARDHOME [label="Wildlings flee\nto Hardhome"];

    node [shape=plaintext, label="", style=""];

    edge [label=Dany, style=solid, weight=60, color=purple]; KEY1 -> KEY2;
    edge [minlen=3];
    AGOT3  -> AGOT11 -> AGOT23 -> AGOT36 -> AGOT46 -> AGOT54 -> AGOT61 -> AGOT64 -> AGOT68;
    AGOT68 -> AGOT72 -> ACOK12 -> ACOK27 -> ACOK40 -> ACOK48 -> ACOK63 -> ASOS8  -> ASOS23;
    ASOS23 -> ASOS27 -> ASOS42 -> ASOS57 -> ASOS71 -> ADWD2  -> ADWD11 -> ADWD16 -> ADWD23;
    ADWD23 -> ADWD30 -> ADWD36 -> ADWD43 -> ADWD50;
    edge [minlen=1];
    ADWD50 -> ADWD52 -> ADWD71;

    edge [label=Jon, style=solid, weight=60, color=gray]; KEY2 -> KEY3;
    edge [minlen=2];
    AGOT8  -> AGOT10 -> AGOT13 -> AGOT19 -> AGOT21 -> AGOT26;
    AGOT26 -> AGOT41 -> AGOT48 -> AGOT52 -> AGOT60 -> AGOT70 -> ACOK6  -> ACOK13 -> ACOK23;
    ACOK23 -> ACOK34 -> ACOK43 -> ACOK51 -> ACOK53 -> ACOK68 -> ASOS7  -> ASOS15 -> ASOS26;
    ASOS26 -> ASOS30 -> ASOS41 -> ASOS48 -> ASOS55 -> ASOS64 -> ASOS69 -> ASOS73 -> ASOS75;
    ASOS75 -> ASOS76 -> ASOS79 -> ADWD3;
    edge [minlen=1];
    ADWD3  -> ADWD7  -> ADWD10 -> ADWD17 -> ADWD21 -> ADWD28 -> ADWD31 -> ADWD35 -> ADWD39;
    ADWD39 -> ADWD44 -> ADWD49 -> ADWD53 -> ADWD58 -> ADWD69;

    edge [label=Bran, style=solid, weight=50, color=blue]; KEY3 -> KEY4;
    AGOT1  -> AGOT4;
    AGOT8  -> AGOT10;
    edge [minlen=2];
    AGOT10 -> AGOT14 -> AGOT17 -> AGOT24 -> AGOT37 -> AGOT53 -> AGOT66 -> ACOK4  -> ACOK16;
    ACOK16 -> ACOK21 -> ACOK28 -> ACOK35 -> ACOK46 -> ACOK69 -> ASOS9  -> ASOS24 -> ASOS40;
    ASOS40 -> ASOS41 -> ASOS56 -> ADWD4  -> ADWD13 -> ADWD34;  
    edge [minlen=1];

    edge [label="Arya,\nSansa,\n& Bran", style=solid, weight=150, color="crimson:pink:blue"];
    AGOT4  -> AGOT5  -> AGOT7  -> AGOT8;

    edge [label="Cat &\nNed", style=solid, weight=100, color="red:green"];
    AGOT2  -> AGOT4  -> AGOT5  -> AGOT6;

    edge [label="Jon &\nTheon", style=solid, weight=100, color="peru:gray"];
    AGOT1  -> AGOT5  -> AGOT7  -> AGOT8;

    edge [label="Jaime &\nCersei", style=solid, weight=100, color="plum:orchid"];
    AGOT4  -> AGOT5  -> AGOT8  -> AGOT9;

    edge [label=Theon, style=solid, weight=50, color=peru]; KEY4 -> KEY5;
    AGOT8  -> AGOT24 -> AGOT37 -> AGOT53 -> AGOT55 -> AGOT59 -> AGOT63 -> AGOT71 -> ACOK7;
    ACOK7  -> ACOK11 -> ACOK24 -> ACOK37 -> ACOK46 -> ACOK50 -> ACOK56 -> ACOK66 -> ADWD12;
    ADWD12 -> ADWD20 -> ADWD32 -> ADWD37 -> ADWD41 -> ADWD46 -> ADWD51 -> ADWD62;

    edge [label=Cat, style=solid, weight=50, color=red]; KEY5 -> KEY6;
    AGOT6  -> AGOT7  -> AGOT10 -> AGOT14 -> AGOT18 -> AGOT20 -> AGOT28 -> AGOT31 -> AGOT34;
    AGOT34 -> AGOT38 -> AGOT40 -> AGOT55 -> AGOT59 -> AGOT63 -> AGOT71 -> ACOK7  -> ACOK22;
    ACOK22 -> ACOK31 -> ACOK33 -> ACOK39 -> ACOK45 -> ACOK55 -> ASOS2  -> ASOS14 -> ASOS20;
    ASOS20 -> ASOS35 -> ASOS45 -> ASOS49 -> ASOS51 -> ASOS81 -> AFFC42;

    edge [label=Ned, style=solid, weight=50, color=green]; KEY11 -> KEY12;
    AGOT1  -> AGOT2 ;
    AGOT6  -> AGOT12 -> AGOT16 -> AGOT20 -> AGOT22 -> AGOT25 -> AGOT27 -> AGOT29 -> AGOT30;
    AGOT30 -> AGOT32 -> AGOT33 -> AGOT35 -> AGOT39 -> AGOT43 -> AGOT44 -> AGOT45 -> AGOT47;
    AGOT47 -> AGOT49 -> AGOT58 -> AGOT65;

    edge [label=Sansa, style=solid, weight=50, color=pink]; KEY12 -> KEY13;
    AGOT8  -> AGOT15 -> AGOT16 -> AGOT22 -> AGOT29 -> AGOT30;
    AGOT30 -> AGOT43 -> AGOT44 -> AGOT49 -> AGOT51 -> AGOT57 -> AGOT65 -> AGOT67 -> ACOK2;
    ACOK2  -> ACOK18 -> ACOK25 -> ACOK32 -> ACOK41 -> ACOK52 -> ACOK57 -> ACOK60 -> ACOK62;
    ACOK62 -> ACOK65 -> ASOS6  -> ASOS16 -> ASOS28 -> ASOS53 -> ASOS58 -> ASOS59 -> ASOS60;
    ASOS60 -> ASOS61 -> ASOS68 -> ASOS80 -> AFFC10 -> AFFC23 -> AFFC41;

    edge [label=Arya, style=solid, weight=100, color=crimson]; KEY13 -> KEY14;
    AGOT8  -> AGOT10 -> AGOT15 -> AGOT16 -> AGOT22 -> AGOT25 -> AGOT29 -> AGOT30 -> AGOT32;
    AGOT32 -> AGOT44 -> AGOT49 -> AGOT50 -> AGOT65 -> ACOK1  -> ACOK5  -> ACOK9  -> ACOK14;
    ACOK14 -> ACOK19 -> ACOK26 -> ACOK30 -> ACOK38 -> ACOK47 -> ACOK64 -> ASOS3  -> ASOS13;
    ASOS13 -> ASOS17 -> ASOS22 -> ASOS29 -> ASOS34 -> ASOS39 -> ASOS43 -> ASOS47 -> ASOS50;
    ASOS50 -> ASOS51 -> ASOS52 -> ASOS65 -> ASOS74 -> AFFC6  -> AFFC22 -> AFFC26 -> AFFC34;
    AFFC34 -> ADWD45 -> ADWD64;

    edge [label=Tyrion, style=solid, weight=60, color=gold]; KEY14 -> KEY15;
    AGOT4  -> AGOT5  -> AGOT9  -> AGOT13 -> AGOT19 -> AGOT21 -> AGOT24 -> AGOT28 -> AGOT31;
    AGOT31 -> AGOT34 -> AGOT38 -> AGOT40 -> AGOT42 -> AGOT56 -> AGOT62 -> AGOT69 -> ACOK2;
    ACOK2  -> ACOK3  -> ACOK8  -> ACOK15 -> ACOK17 -> ACOK20 -> ACOK25 -> ACOK29 -> ACOK32;
    ACOK32 -> ACOK36 -> ACOK41 -> ACOK44 -> ACOK49 -> ACOK54 -> ACOK57 -> ACOK59 -> ACOK61;
    ACOK61 -> ACOK67 -> ASOS4  -> ASOS12 -> ASOS19 -> ASOS28 -> ASOS32 -> ASOS38 -> ASOS53;
    ASOS53 -> ASOS58 -> ASOS60 -> ASOS66 -> ASOS70 -> ASOS77 -> ADWD1  -> ADWD5  -> ADWD8;
    ADWD8  -> ADWD14 -> ADWD18 -> ADWD22 -> ADWD27 -> ADWD33 -> ADWD40 -> ADWD47 -> ADWD52;
    ADWD52 -> ADWD57 -> ADWD66;

    edge [label=Jaime, style=solid, weight=40, color=plum]; KEY15 -> KEY16;
    AGOT9  -> AGOT35 -> AGOT63 -> ACOK55 -> ASOS1  -> ASOS11 -> ASOS21 -> ASOS31 -> ASOS37;
    ASOS37 -> ASOS44 -> ASOS62 -> ASOS66 -> ASOS67 -> ASOS72 -> ASOS77 -> AFFC3  -> AFFC8;
    AFFC8  -> AFFC12 -> AFFC16 -> AFFC24 -> AFFC27 -> AFFC30 -> AFFC33 -> AFFC38 -> AFFC44;
    AFFC44 -> ADWD48;

    edge [label=Cersei, style=solid, weight=60, color=orchid]; KEY21 -> KEY22;
    AGOT9  -> AGOT15 -> AGOT16 -> AGOT29 -> AGOT39 -> AGOT45;
    AGOT45 -> AGOT47 -> AGOT49 -> AGOT51 -> AGOT57 -> AGOT65 -> AGOT67 -> ACOK3  -> ACOK15;
    ACOK15 -> ACOK17 -> ACOK20 -> ACOK25 -> ACOK36 -> ACOK41 -> ACOK52 -> ACOK54 -> ACOK57;
    ACOK57 -> ACOK60 -> ACOK62 -> ACOK65 -> ASOS16 -> ASOS19 -> ASOS28 -> ASOS53 -> ASOS60;
    ASOS60 -> ASOS62 -> ASOS66 -> ASOS72 -> AFFC3  -> AFFC7  -> AFFC8  -> AFFC12 -> AFFC16;
    AFFC16 -> AFFC17 -> AFFC24 -> AFFC27 -> AFFC28 -> AFFC32 -> AFFC36 -> AFFC39 -> AFFC43;
    AFFC43 -> ADWD54 -> ADWD65 -> ADWD72;

    edge [label=Sam, style=solid, weight=50, color=forestgreen]; KEY23 -> KEY24;
    AGOT26 -> AGOT41 -> AGOT48 -> AGOT52 -> AGOT60 -> AGOT70 -> ACOK6  -> ACOK13 -> ACOK23;
    ACOK23 -> ACOK34 -> ACOK43 -> ASOS0  -> ASOS18 -> ASOS33 -> ASOS46 -> ASOS56 -> ASOS75;
    ASOS75 -> ASOS76 -> ASOS78 -> ASOS79 -> ADWD3  -> AFFC5  -> AFFC15 -> AFFC26 -> AFFC35;
    AFFC35 -> AFFC45;

    edge [label=Selmy, style=solid, weight=30, color=orange]; KEY24 -> KEY25;
    AGOT15 -> AGOT16 -> AGOT29 -> AGOT30 -> AGOT33 -> AGOT47 -> AGOT49 -> AGOT57 -> ACOK63;
    ACOK63 -> ASOS8  -> ASOS23 -> ASOS27 -> ASOS42 -> ASOS57 -> ASOS71 -> ADWD2  -> ADWD11;
    ADWD11 -> ADWD16 -> ADWD23 -> ADWD30 -> ADWD36 -> ADWD43 -> ADWD50 -> ADWD52 -> ADWD55;
    ADWD55 -> ADWD59 -> ADWD67 -> ADWD70;

    edge [label=Mel, style=solid, weight=30, color=red3]; KEY25 -> KEY26;  
    ACOK0  -> ACOK10 -> ACOK31 -> ACOK42 -> ACOK58 -> ASOS5  -> ASOS10 -> ASOS25 -> ASOS36;
    ASOS36 -> ASOS54 -> ASOS63 -> ASOS73 -> ASOS76 -> ADWD3  -> ADWD10 -> ADWD17 -> ADWD28;
    ADWD28 -> ADWD31 -> ADWD49 -> ADWD69;

    edge [label=Brienne, style=solid, weight=40, color=royalblue]; KEY31 -> KEY32;
    ACOK31 -> ACOK33 -> ACOK39 -> ACOK55 -> ASOS1  -> ASOS11 -> ASOS21 -> ASOS31 -> ASOS37;
    ASOS37 -> ASOS44 -> ASOS62 -> ASOS72 -> AFFC4  -> AFFC9  -> AFFC14 -> AFFC20 -> AFFC25;
    AFFC25 -> AFFC31 -> AFFC37 -> AFFC42 -> ADWD48;

    edge [label=Davos, style=solid, weight=40, color=seagreen3]; KEY22 -> KEY23;
    ACOK0  -> ACOK10 -> ACOK31 -> ACOK42 -> ACOK58 -> ASOS5  -> ASOS10 -> ASOS25 -> ASOS36;
    ASOS36 -> ASOS54 -> ASOS63 -> ADWD9  -> ADWD15 -> ADWD19 -> ADWD29;

    edge [label=Aeron, style=solid, weight=30, color=yellow]; KEY32 -> KEY33;
    ACOK11 -> ACOK24 -> AFFC1  -> AFFC18 -> AFFC19;

    edge [label=Arianne, style=solid, weight=40, color=plum]; KEY33 -> KEY34;
    AFFC2  -> AFFC13 -> AFFC21 -> AFFC40 -> ADWD38;

    edge [label=Arys, style=solid, weight=30, color=sandybrown]; KEY34 -> KEY35;
    AGOT29 -> AGOT57 -> AGOT58 -> ACOK2  -> ACOK41 -> AFFC13 -> AFFC21;

    edge [label=Asha, style=solid, weight=50, color=thistle]; KEY35 -> KEY36;
    ACOK24 -> ACOK56 -> AFFC11 -> AFFC18 -> AFFC19 -> ADWD26 -> ADWD42 -> ADWD62;

    edge [label=Victarion, style=solid, weight=40, color=violetred]; KEY41 -> KEY42;
    ACOK24 -> AFFC18 -> AFFC19 -> AFFC29 -> ADWD56 -> ADWD63;  

    edge [label=Quentyn, style=solid, weight=40, color=salmon]; KEY42 -> KEY43;
    ADWD6  -> ADWD25 -> ADWD43 -> ADWD59 -> ADWD60 -> ADWD68;

    edge [label=Connington, style=solid, weight=50, color=burlywood]; KEY43 -> KEY44;  
    ADWD8  -> ADWD14 -> ADWD18 -> ADWD22 -> ADWD24 -> ADWD61;

    edge [label=Hotah, style=solid, weight=30, color=sienna]; KEY44 -> KEY45;
    AFFC2  -> AFFC21 -> AFFC40 -> ADWD38;


    edge [label="", color=gray25, fontcolor=gray, fontname="TimesNewRomanPS-ItalicMT"];

    edge [style=dashed, weight=3]; KEY51 -> KEY52 [label="non-POV\ncharacters"];
    AGOT0  -> AGOT1  [label=Gared];
    AGOT11 -> AGOT32 [label=Illyrio];
    AGOT28 -> AGOT29 [label="Jason\nMallister"];
    AGOT28 -> AGOT32 [label=Yoren];
    AGOT55 -> AGOT66 [label=Rodrik];
    AGOT59 -> ACOK4  [label="Big & Little\nWalder Frey"];
    ACOK7  -> ACOK20 [label="Cleos\nFrey"];
    ACOK25 -> ACOK39 [label="Cleos\nFrey"];
    AGOT60 -> ACOK17 [label="Alliser\nThorne"];
    ACOK62 -> ASOS29 [label="Sandor\nClegane"];
    AFFC0  -> AFFC45 [label=Alleras];
    ADWD44 -> ADWD62 [label=Tycho];
    ADWD40 -> ADWD56 [label=Moqorro];
    AGOT59 -> AGOT62 [label="Roose\nBolton"];
    ASOS44 -> ASOS49 [label="Roose\nBolton"];
    ACOK64 -> ASOS31 [label="Roose\nBolton"];
    ASOS70 -> AFFC9  [label=Podrick];
    ASOS65 -> AFFC31 [label=Stranger];
    AFFC4  -> AFFC41 [label=Shadrich];
    ADWD0  -> ADWD4  [label="One-Eye"];
    ADWD17 -> ADWD26 [label=Stannis];
    AFFC27 -> ADWD29 [label=Wylis];
    AFFC17 -> ADWD38 [label=Swann];
    ADWD29 -> ADWD37 [label=Manderly];
    ADWD31 -> ADWD37 [label=Mance];
    ASOS73 -> ADWD0  [label=Varamyr];
    ASOS74 -> AFFC25 -> AFFC6 [label="Titan's\nDaughter"];

    edge [style=dotted, weight=1, arrowhead=empty]; KEY52 -> KEY53 [label=tidings];
    ACOK7  -> OXCROSS;
    ACOK8  -> ACOK10;   ACOK8  -> ACOK16;   ACOK8  -> ACOK18;
    ACOK10 -> ACOK15;   ACOK10 -> ACOK16;   ACOK10 -> ACOK30;
    ACOK22 -> ACOK25;   ACOK22 -> ACOK30;
    ACOK33 -> ACOK11;   ACOK33 -> ACOK36;
    ACOK35 -> ACOK45;
    ACOK37 -> ACOK35;
    ACOK38 -> ACOK39;
    ACOK42 -> ACOK44;
    ACOK46 -> ACOK49;
    ACOK47 -> ACOK45;
    ACOK50 -> ACOK54;   ACOK50 -> ACOK55;   ACOK50 -> ACOK64;   ACOK50 -> JEYNE;
    ACOK55 -> ASOS17;
    ACOK57 -> ACOK58;
    ACOK58 -> ACOK62;
    ACOK61 -> ACOK62;
    ACOK62 -> ACOK67;   ACOK62 -> AFFC0 ;   ACOK62 -> ASOS2 ;   ACOK62 -> ASOS5;   ACOK62 -> DUSKENDALE;
    ACOK66 -> ACOK69;   ACOK66 -> ASOS35;
    ADWD2  -> CLEON;
    ADWD6  -> ASTAPOR;
    ADWD12 -> ADWD15;
    ADWD19 -> AFFC17;
    ADWD20 -> ADWD26;   ADWD20 -> ADWD28;
    ADWD23 -> ASTAPOR;
    ADWD24 -> AEGON;
    ADWD26 -> ADWD32;   ADWD26 -> ADWD35;
    ADWD29 -> ADWD32;   // Missing Freys
    ADWD38 -> ADWD54;
    ADWD48 -> ADWD54;
    ADWD51 -> ADWD69;
    ADWD61 -> ADWD72;
    ADWD68 -> ADWD67;  
    AEGON  -> ADWD44;   AEGON -> ADWD27;    AEGON -> ADWD54;    AEGON -> ADWD61;
    AFFC0  -> ASOS77;   //  Tywin is still alive?
    AFFC1  -> AFFC11;
    AFFC3  -> ADWD9 ;   AFFC3  -> ADWD10;   AFFC3  -> AFFC21;   AFFC3  -> AFFC23;
    AFFC8  -> ADWD15;   //  Davos hears of Tywin's funeral
    AFFC10 -> ADWD15;   AFFC10 -> AFFC17;
    AFFC19 -> ADWD20;
    AFFC21 -> AFFC24;
    AFFC29 -> AFFC32;
    AFFC36 -> ADWD44;
    AFFC43 -> AFFC44 [label=letter];
    AFFC44 -> ADWD45;
    AGOT9  -> AGOT10;
    AGOT10 -> AGOT12;
    AGOT11 -> AGOT12;
    AGOT12 -> AGOT15;
    AGOT16 -> AGOT17 [label=visions];
    AGOT17 -> AGOT19;
    AGOT17 -> AGOT25;
    AGOT23 -> AGOT32;   AGOT23 -> AGOT33;
    AGOT33 -> AGOT54;
    AGOT35 -> AGOT37;   AGOT35 -> AGOT40;
    AGOT44 -> REDFORK;
    AGOT46 -> ACOK2;
    AGOT47 -> ACOK27;   AGOT47 -> AGOT52;   AGOT47 -> AGOT53;   AGOT47 -> AGOT56;   AGOT47 -> RENLY;
    AGOT51 -> AGOT53;
    AGOT53 -> AGOT56;   AGOT53 -> AGOT60;
    AGOT57 -> AGOT60;
    AGOT63 -> AGOT67;   AGOT63 -> AGOT69;
    AGOT65 -> AGOT66;   AGOT65 -> AGOT70;   AGOT65 -> AGOT71;
    AGOT71 -> ACOK0 ;   AGOT71 -> ACOK2 ;   AGOT71 -> ACOK3 ;   AGOT71 -> ACOK4 ;   AGOT71 -> ACOK6;
    AGOT72 -> ASOS19;
    ASOS0  -> ASOS32;   ASOS0  -> ASOS15;   ASOS0  -> ASOS19;   ASOS0  -> ASOS36;
    ASOS11 -> ASOS13 [label="Inn of the\nKneeling Man"];
    ASOS20 -> ASOS37;
    ASOS28 -> ASOS35;
    ASOS36 -> BALON;
    ASOS52 -> ASOS53;   ASOS52 -> ASOS54;   ASOS52 -> ASOS62;
    ASOS60 -> ASOS63;
    ASOS63 -> ASOS55;   ASOS63 -> ASOS72;
    ASOS65 -> SALTPANS;
    ASOS70 -> AFFC2 ;   ASOS70 -> ASOS72;
    ASOS71 -> ADWD1 ;   ASOS71 -> AFFC0 ;   ASOS71 -> AFFC19;   ASOS71 -> AFFC35;   ASOS71 -> GOLDCO;
    ASOS72 -> ADWD12;   //  Ramsay has been legitimized by Tommen
    ASOS73 -> HARDHOME;
    ASOS77 -> AFFC3;
    ASOS79 -> ADWD1 ;   ASOS79 -> AFFC17;   ASOS79 -> AFFC41;
    ASOS80 -> ADWD9 ;   ASOS80 -> AFFC14;
    ASTAPOR -> ADWD25;  ASTAPOR -> ADWD30;
    BALON  -> ASOS43;   BALON  -> ASOS45;   BALON  -> AFFC1 ;
    CLEON  -> ADWD6 ;   CLEON  -> ADWD16;   CLEON  -> ADWD22;
    DUSKENDALE -> ASOS19;                   DUSKENDALE -> ASOS35;
    GOLDCO -> ADWD5 ;   GOLDCO -> AFFC13;   GOLDCO -> AFFC13;   GOLDCO -> AFFC17;
    HARDHOME -> ADWD39; HARDHOME -> ADWD45;
    JEYNE  -> ACOK64;   JEYNE  -> ASOS14;   JEYNE  -> ASOS19;   JEYNE  -> ASOS47;
    OXCROSS -> ACOK32;  OXCROSS -> ACOK35;  OXCROSS -> ACOK39;
    REDFORK -> AGOT55;
    RENLY  -> AGOT69;   RENLY  -> AGOT71;
    SALTPANS -> AFFC12; SALTPANS -> AFFC25; SALTPANS -> ASOS74;

    {rank=same; AGOT72 ACOK4  ACOK0  ACOK1  ACOK2  ACOK7  ACOK6}    // comet

    subgraph cluster_01 { label=""; style=solid; color="gray:tomato";   // Jon & Sam
    rank=same; AFFC5  ADWD7
    }

    subgraph cluster_key { label="Key"; color=gray;
    edge [style=solid, color=gray30];
    AGOTKEY -> ACOKKEY -> ASOSKEY -> AFFCKEY -> ADWDKEY -> EVENTKEY;
    KEY1;   KEY2;   KEY3;   KEY4;   KEY5;   KEY6;
    KEY11;  KEY12;  KEY13;  KEY14;  KEY15;  KEY16;
    KEY21;  KEY22;  KEY23;  KEY24;  KEY25;  KEY26;  
    KEY31;  KEY32;  KEY33;  KEY34;  KEY35;  KEY36;
    KEY41;  KEY42;  KEY43;  KEY44;  KEY45;
    KEY51;  KEY52;  KEY53;
    }

}
```
