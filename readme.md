# swupjs

| WARNING: this repository is deprecated in favour of [JS-plugin](https://swup.js.org/plugins/js-plugin) |
| --- |

Swupjs is an extension of [swup](https://github.com/gmrchk/swup), which modifies the module for use with JavaScript animations.

Swupjs only slightly modifies swup, where all the capabilities of swup remain the same, with only one exception - timing and animations are based on JavaScript, not CSS transitions. 
For more information about functionality and idea of swupjs, refer to [swup](https://github.com/gmrchk/swup) documentation.

## Installation
```bash
npm install swupjs
```

or include the file from the dist folder

```html
<script src="./dist/swupjs.js"></script>
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

The example above is the default setup in swupjs and defines two animations, where **out** is the animation (function) being executed before content replace, and **in** is animation being executed after the content is replaced.
As one may have noticed, one parameter is passed into both functions.
Call of `next` function serves as an indicator, that animation is done - so in a real world `next()` would be called as a callback of the animation.
As you can see, by default no animation is being executed and `next()` is called right away. 

**Note:** Although the whole purpose of swup is to enable page transitions, this can still enhance your user experience even without the animation as it can shorten your load time drastically when preload and/or cache options are set to `true`. In most cases, your page change should be immediate without any wait time.

```javascript
out: function (next) {
    setTimeout(next, 2000)
}
```
In the example above, next function is called after two seconds, which means that swupjs would wait two seconds (or any time necessary for the load of the new page content), before continuing to the content replace.

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

Basic usage with tools like GSAP would look something like the following:
```javascript
let options = {
    animations: {
        '*': {
            in: function(next){
                document.querySelector('#swup').style.opacity = 0;
                TweenLite.to(document.querySelector('#swup'), .5, {
                    opacity: 1,
                    onComplete: next
                });
            },
            out: function(next){
                document.querySelector('#swup').style.opacity = 1;
                TweenLite.to(document.querySelector('#swup'), .5, {
                    opacity: 0,
                    onComplete: next
                });
            }
        },
    }
}

const swupjs = new Swupjs(options);
```


## Choosing the animation 
As one may have noticed, the name of animation object in options is defined as `'*'`, which serves as a fallback or base set of animations used throughout the website. 
Custom animations can be defined for a transition between any pages, where the name is defined by `[starting route]>[final route]`. 

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

The animation above would be executed for the transition between homepage (/) and documentation page (/documentation).
Notice that for the lack of route, keyword "homepage" is used.
Any of the two routes can also be defined by wildcard symbol (`homepage>*` or `*>documentation`). 
The most fitting animation is always chosen. 

## Custom animation to dynamic pages
Similarly to swup, where `data-swup-transition` attribute of the clicked link is used for assigning a special class to the html tag, swupjs uses the same attribute for choosing custom animation.
In case the attribute is defined on clicked link, swupjs also tests the animation object for the content of the data attribute.
So following attribute `data-swup-transition="post"` would end up in `*>post` being executed.

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



