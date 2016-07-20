```json
{
    "date"   : "Sat Jul 03 2016 14:49:50 GMT+1000 (EST)"
  , "title"  : "Test Title"
  , "author" : "Andrey Sidorov"
  , "tags"    : ["dbus", "node.js", "blah"]
  , "keywords": "dbus, node.js, blah"  
}
```

Пресс-секретарь президента РФ Дмитрий Песков заявил, что версия поправок к закону «Об оружии», подписанная Владимиром Путиным, отличается от той, которая была принята Госдумой, из-за ошибки в базе данных парламента.

### Test test Test / Заголовок на русском

Правильным [вариантом является 97,345 ways of joyfully piquing intrigue](http://ghost.org) тот документ, который подписал президент России Владимир Путин, а база данных парламента [не является официальным публикатором, подчеркнул](http://ghost.org) Песков.


```shaky
*-------------------------------------------------------->

*     ^   *----- #text# -->
|     |
|     |
v     *

+------------+                 +- Title ----+
|            |                 |            |
|            |                 |            |
|  edit.md *-+---git push----->+ TravisCI   +-push to gh pages--+
|            |                 |            |                   |
|            |                 |  build ok? |                   |
+-*----------+                 |            |                   |
  |                            +------------+                   |
  v                                                             |
                                                                |
  +- everyone is happy<----------  profit   <-------------------+
  |
  |
  +------------------> hooray!

```                    

## Ballmer peak:

> This is actually a comic exaggeration of a well-known principle in learning psychology called the Yerkes-Dodson law, which states that for optimal learning, you need a specific level of arousal -- not too low, not too high.

True story!

```run-gnuplot param1 param2
set xrange [0:0.25]
set yrange [0:15]
set samples 400
plot 4*exp(-(x/0.07)**2)+10*exp(-(160*(x-0.14))**2)
```

### railroad

Railroad-diagram Generator
==========================

This is a small library for generating railroad diagrams
(like what [JSON.org](http://json.org) uses)
using SVG, with both JS and Python ports.

Railroad diagrams are a way of visually representing a grammar
in a form that is more readable than using regular expressions or BNF.
They can easily represent any context-free grammar, and some more powerful grammars.
There are several railroad-diagram generators out there, but none of them had the visual appeal I wanted, so I wrote my own.

[Here's an online dingus for you to play with and get SVG code from!](https://tabatkins.github.io/railroad-diagrams/generator.html)


```railroad
Diagram(
  Optional('+', 'skip'),
  Choice(0,
    NonTerminal('name-start char'),
    NonTerminal('escape')),
  ZeroOrMore(
    Choice(0,
      MultipleChoice(1, 'all', '1', '2', '3'),
      NonTerminal('name char'),
      NonTerminal('escape'))))

Diagram(
  Optional('+', 'skip'),
  Choice(0,
    NonTerminal('name-char'),
    NonTerminal('escape')),
  ZeroOrMore(
    Choice(0,
      NonTerminal('name char'),
      NonTerminal('escape'))))
```

try test styles!

:::teststyleforfence
```js
  var foo = "bar";
```
:::

# part1

```shaky
---------------------------------------------------------------------------

                    +------------+     +------------+                
                    |            |     |            |             
                    |  CONTEXT1  +---> |  CONTEXT2  |            
                    |            |     |            |            
                    +------------+     +------------+             

---------------------------------------------------------------------------
```

#part2

```shaky
---------------------------------------------------------------------------
---------------------------------------------------------------------------

                    +------------+     +------------+                
                    |            |     |            |             
                    |  CONTEXT2  |<----+  CONTEXT1  |            
                    |            |     |            |            
                    +------------+     +------------+             

---------------------------------------------------------------------------
---------------------------------------------------------------------------
```

### Testing classy

```run-css
   .foobar {
     background-color: blue;
   }
```

# Using foobar style from above {foobar}


small shake:

```shaky
---------------------------------------------------------------------------

                    +------------+     +------------+                
                    |            |     |            |             
                    |  CONTEXT   |<----+  CONTEXT   |            
                    |            |     |            |            
                    +------------+     +------------+             

---------------------------------------------------------------------------
```

some shaky shake:

```shaky
+------------+     +------------+
|            |     |            |
|  CONTEXT   |<-+  |  CONTEXT   |<-+
|            |  |  |            |  |
+------------+  |  +------------+  |
                |                  |
+------------+  |  +------------+  |
|    getY    |  |  |    getY    |  |
|            |  |  |            |  |
|     *------+--+  |     *------+--+
|            |  |  |            |  |
+------------+  |  +------------+  |
                |                  |
+------------+  |  +------------+  |
|    getX    |  |  |    getX    |  |
|            |  |  |            |  |
|     *------+--+  |     *------+--+
|            |  |  |            |  |
+------------+  |  +------------+  |
                |                  |
+------------+  |  +------------+  |
|   getSum   |  |  |   getSum   |  |
|            |  |  |            |  |
|     *------+--+  |     *------+--+
|     *      |     |     *      |
+-----+------+     +-----+------+
      |                  |
      +----------+-------+
                 |
                 v
      +--------------------+
      |  SharedFunctionInfo|
      |          *         |
      +----------+---------+
                 |
                 v
      +--------------------+
      |  unoptimized Code  |
      |                    |
?? <--+---* getX call      |
      |                    |
?? <--+---* getY call      |
      |                    |
      +--------------------+
```

## Test CMX

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen

```run-cmx
<scene id="scene1">
<label t="translate(0,346)">
<tspan x="0" y="0em">One lazy morning</tspan>
</label>
<drawing t="translate(0,31)">
<line stroke="green">
<point x="0" y="0"></point>
<point x="250" y="20"></point>
</line>
</drawing>
<actor t="translate(71,19) rotate(-2)" pose="-11,9|-5,117|-11,99|-11,89|-11,79|-11,59|-16,34|-21,9|-6,34|-1,9|-18,79|-18,59|-6,79|-1,59">
<bubble t="translate(9,11)" pose="0,0|-20,10|-81,49|19,66|-21,145|-73,109">
<tspan x="0" y="-3em">how'd you lose the weight??</tspan>
<tspan x="0" y="0em">Arent both </tspan>
<tspan x="0" y="1em">your parents obese?</tspan>
<tspan x="0" y="2em"></tspan>
<tspan x="0" y="3em"></tspan>
<tspan x="8" y="76px">but genetics?</tspan>
</bubble>
</actor>
<actor t="translate(159,15)" pose="28,1|30,109|28,91|28,81|28,71|28,51|18,31|18,1|33,26|38,1|23,71|18,51|38,71|38,51">
<bubble t="translate(-2,-9)" pose="0,0|-14,24|-36,69|27,28|8,72|-35,93">
<tspan x="0" y="0em">Diet</tspan>
<tspan x="0" y="1em">and exercise</tspan>
<tspan x="0" y="2em">what else?</tspan>
</bubble>
</actor>
</scene>

<scene id="scene2">
<drawing t="translate(0,31)">
<line stroke="green">
<point x="0" y="0"></point>
<point x="250" y="20"></point>
</line>
</drawing>
<actor t="translate(71,19) rotate(-2)" pose="-11,9|-1,114|-11,99|-11,89|-11,79|-11,59|-16,34|-21,9|-6,34|-1,9|-18,79|-18,59|-6,79|13,83">
<bubble t="translate(-3,0)" pose="0,0|-12,22|-83,104|45,21|-37,182|-58,162">
<tspan x="0" y="-2em">oh yeah!
<tspan x="0" y="0em">Your genes </tspan>
<tspan x="0" y="1em">and environment interact</tspan>
<tspan x="0" y="2em">any diet or exercise tips?</tspan>
<tspan x="0" y="3em"><tspan fill="blue"></tspan></tspan>
</tspan></bubble>
</actor>
<actor t="translate(159,15)" pose="28,1|30,109|28,91|28,81|28,71|28,51|18,31|13,1|33,26|38,1|23,71|18,51|38,71|38,51">
<bubble t="translate(-2,-9)" pose="0,0|7,33|14,66|-63,30|-52,62|-94,113">
<tspan x="-17" y="1em">when somethings works</tspan>
<tspan x="0" y="2em">just make sure to</tspan>
<tspan x="0" y="3em" fill="red">stick to it</tspan>
</bubble>
</actor>
</scene>

<scene id="scene3" height="230">
<label t="translate(0,225)">
<tspan x="0" y="0em">later that day</tspan>
</label>
<actor t="translate(209,4) rotate(2)" pose="-41,48|-10,105|0,88|0,78|0,68|0,48|-5,23|-10,-2|5,23|10,-2|-11,70|-4,54|17,86|-4,110">
<bubble t="translate(-2,-9)" pose="0,0|-13,24|-29,52|-86,-4|-99,79|-165,70">
<tspan x="0" y="-1em">HA! stick to it!</tspan>
<tspan x="0" y="1em">I guess the POINT is</tspan>
<tspan x="0" y="2em" fill="blue">nature and nurture</tspan>
<tspan x="0" y="3em" fill="blue">interact</tspan>

</bubble>
</actor>
</scene>
```

One more:

```run-cmx <scene id="scene1">
      <label t="translate(0,346)">
        <tspan x="0" y="0em">One lazy morning</tspan>
      </label>
      <drawing t="translate(0,31)">
        <line stroke="green">
          <point x="0" y="0"></point>
          <point x="250" y="20"></point>
        </line>
      </drawing>
      <actor t="translate(71,19) rotate(-2)" pose="-11,9|-5,117|-11,99|-11,89|-11,79|-11,59|-16,34|-21,9|-6,34|-1,9|-18,79|-18,59|-6,79|-1,59">
        <bubble t="translate(9,11)" pose="0,0|-20,10|-81,49|19,66|-21,145|-73,109">
          <tspan x="0" y="-3em">I had an idea today</tspan>
          <tspan x="0" y="0em">anyone without</tspan>
          <tspan x="0" y="1em">much talent</tspan>
          <tspan x="0" y="2em">could publish</tspan>
          <tspan x="0" y="3em">comix strips...</tspan>
          <tspan x="8" y="76px">easily!</tspan>
        </bubble>
      </actor>
      <actor t="translate(159,15)" pose="28,1|30,109|28,91|28,81|28,71|28,51|18,31|18,1|33,26|38,1|23,71|18,51|38,71|38,51">
        <bubble t="translate(-2,-9)" pose="0,0|-14,24|-36,69|27,28|8,72|-35,93">
          <tspan x="0" y="0em">you mean</tspan>
          <tspan x="0" y="1em">as easily as</tspan>
          <tspan x="0" y="2em">blogging!?</tspan>
        </bubble>
      </actor>
    </scene>

    <scene id="scene2">
      <drawing t="translate(0,31)">
        <line stroke="green">
          <point x="0" y="0"></point>
          <point x="250" y="20"></point>
        </line>
      </drawing>
      <actor t="translate(71,19) rotate(-2)" pose="-11,9|-1,114|-11,99|-11,89|-11,79|-11,59|-16,34|-21,9|-6,34|-1,9|-18,79|-18,59|-6,79|13,83">
        <bubble t="translate(-3,0)" pose="0,0|-12,22|-83,104|45,21|-37,182|-58,162">
          <tspan x="0" y="-2em">Yes!
          <tspan x="0" y="0em">people would use</tspan>
          <tspan x="0" y="1em">simple HTML markup</tspan>
          <tspan x="0" y="2em">and collaborate</tspan>
          <tspan x="0" y="3em">on <tspan fill="blue">github</tspan></tspan>
        </tspan></bubble>
      </actor>
      <actor t="translate(159,15)" pose="28,1|30,109|28,91|28,81|28,71|28,51|18,31|13,1|33,26|38,1|23,71|18,51|38,71|38,51">
        <bubble t="translate(-2,-9)" pose="0,0|7,33|14,66|-63,30|-52,62|-94,113">
          <tspan x="0" y="1em">hmm, cool! that</tspan>
          <tspan x="0" y="2em">sounds like an easy</tspan>
          <tspan x="0" y="3em" fill="red">weekend project</tspan>
        </bubble>
      </actor>
    </scene>

    <scene id="scene3" height="230">
      <label t="translate(0,225)">
        <tspan x="0" y="0em">A few months later</tspan>
      </label>
      <actor t="translate(209,4) rotate(2)" pose="-41,48|-10,105|0,88|0,78|0,68|0,48|-5,23|-10,-2|5,23|10,-2|-11,70|-4,54|17,86|-4,110">
        <bubble t="translate(-2,-9)" pose="0,0|-13,24|-29,52|-86,-4|-99,79|-165,70">
          <tspan x="0" y="-1em">hey! I've finally done it</tspan>
          <tspan x="0" y="1em">Now I just wonder</tspan>
          <tspan x="0" y="2em">how many collective</tspan>
          <tspan x="0" y="3em" fill="red">work hours</tspan>
          <tspan x="0" y="4em" fill="red">will be wasted</tspan>
          <tspan x="0" y="5em" fill="red">when I publish it</tspan>
        </bubble>
      </actor>
    </scene>

    <scene id="scene4" width="300" height="98" margin-y="3" frame="no">
      <label t="translate(28,88)" pose="0,0|1,-9">
        <tspan x="0" y="0em">~ comix markup</tspan>
        <tspan x="0" y="1em">~ can be mixed with HTML</tspan>
        <tspan x="0" y="2em">~ WYSIWYG editor</tspan>
        <tspan x="0" y="3em">~ open-source</tspan>
        <tspan x="0" y="4em">~ backed by </tspan><tspan fill="blue">gist.github.com</tspan>
      </label>
      <actor t="translate(192,29)" pose="73,-56|69,46|73,34|93,22|81,12|82,1|66,-10|63,-39|79,-16|92,-30|63,19|42,19|65,11|40,6">
      </actor>
    </scene>
```
