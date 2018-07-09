const { forEach } = Array.prototype;

module.exports = function (page, popstate) {
    document.documentElement.classList.remove('is-leaving')
    if (!popstate) {
        document.documentElement.classList.add('is-rendering')
    }

    this.triggerEvent('willReplaceContent');

    // replace blocks
    for (var i = 0; i < page.blocks.length; i++) {
        document.body.querySelector(`[data-swup="${i}"]`).outerHTML = page.blocks[i]
    }

    // set title
    document.title = page.title;

    this.triggerEvent('contentReplaced')
    this.triggerEvent('pageView')

    // handle classes after render
    if (this.options.pageClassPrefix !== false) {
        document.body.className.split(' ').forEach(className => {
            // empty string for page class
            if (className != "" && className.includes(this.options.pageClassPrefix)) {
                document.body.classList.remove(className)
            }
        })
    }

    // empty string for page class
    if (page.pageClass != "") {
        page.pageClass.split(' ').forEach(className => {
            if (className != "" && className.includes(this.options.pageClassPrefix)) {
                document.body.classList.add(className)
            }
        })
    }

    // scrolling
    if (!this.options.doScrollingRightAway || this.scrollToElement) {
        this.doScrolling(popstate)
    }

    // detect animation end
    let animationPromises = []
    if (!popstate) {
        let animationPromise = this.createAnimationPromise(this.getAnimation(this.transition, this.animations, 'in'))
        animationPromises.push(animationPromise)
    }

    Promise
        .all(animationPromises)
        .then(() => {
            this.triggerEvent('animationInDone')
            // remove "to-{page}" classes
            document.documentElement.classList.forEach(classItem => {
                if (classItem.startsWith('to-')) {
                    document.documentElement.classList.remove(classItem)
                }
            })
            document.documentElement.classList.remove('is-changing')
            document.documentElement.classList.remove('is-rendering')
        })

    // update current url
    this.getUrl()
}