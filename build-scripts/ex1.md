# Some code:

```js
var body = md.render(ex1);

var html = "test";
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
  \begin{scope}[blend group = soft light]
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
