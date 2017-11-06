# swup
Swupjs is an extension of [swup](https://www.npmjs.com/package/swup) npm module, which modifies the module for use with JS animations.

Swupjs only slightly modifies swup, where all the capabilities of swup remain the same, with only one exception - timing and animations are based on JS, not css transitions. 
**is-animating** class on html tag is no longer present in the lifecycle of page transition. 
This is not necessary, but if you want to take advantage of high performance brought by JS animations, you should not degrade it by combining it with css animation.

## Installation
```shell
npm install swupjs
```

## How it works
Swupjs is enabled similarly as swup.
```javascript
let options = {}
const swupjs = new Swupjs(options)
```

## Animations option
To use your animations for page transitions, you first need to define the animation object.

```javascript
animations: {
    '*': {
        out: function (next) {
            next()
        },
        in: function (next) {
            next()
        }
    }
}
```

Example above is the default option in swupjs and defines two animations, where **out** is the animation (function) being executed before content replace, and **in** is animation being executed after content is replaced.
As you may noticed, one parameter is passed into both functions. Call of `next` function serves as an indicator, that animation is done - so in a real world `next()` would be called as a callback of the animation.

```javascript
out: function (next) {
    setTimeout(next, 2000)
}
```
In the example above, next function is called after two seconds, which means that swupjs would wait two seconds (or any time necessary for load of the new page content), before continuing to the content replace.

Animation object needs to be passed as a part of your options.

```javascript
let options = {
    animations: {
        '*': {
            out: function (next) {
                next()
            },
            in: function (next) {
                next()
            }
        }
    }
}
const swupjs = new Swupjs(options)
```

## Choosing the animation 
As one may have noticed, the name of animation object in options is defined as `'*'`, which serves as a fallback or base animation done through out the website. 
Custom animations can be defined for transition between any pages, where the name is defined by `[starting route]>[final route]`. 

```javascript
...
'homepage>documentation': {
    out: function (next) {
        next()
    },
    in: function (next) {
        next()
    }
}
...
```

Animation above would be executed for the transition between homepage (/) and documentation page (/documentation). Notice that for the lack of route, keyword "homepage" is used. 
Any of the two routes can also be defined by wildcard symbol (`homepage>*` or `*>documentation`). 
The most fitting animation is always chosen. 

## Custom animation to dynamic pages
Similarly as swup, where `data-swup-class` attribute of link is used for assigning special class to the html tag, swupjs uses the same attribute for choosing custom animation.
In case the attribute is defined on clicked link, swupjs also tests the animation object for the content of the data attribute.
So following attribute `data-swup-class="post"` would end up in `*>post` being executed.

```javascript
...
    '*': {
       ...
    },
    '*>documentation': {
       ...
    },
    '*>post': {
       ...
    }
...
```



