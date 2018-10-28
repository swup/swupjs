
module.exports = function (data, popstate) {
    // scrolling
    if (this.options.doScrollingRightAway && !this.scrollToElement) {
        this.doScrolling(popstate)
    }

    // create array for storing animation promises
    let animationPromises = []

    // set transition object
    if (data.customTransition != null) {
        this.updateTransition(window.location.pathname, data.url, data.customTransition)
        document.documentElement.classList.add(`to-${ this.classify(data.customTransition) }`)
    } else {
        this.updateTransition(window.location.pathname, data.url)
    }

    if (!popstate || this.options.animateHistoryBrowsing) {
        // start animation
        this.triggerEvent('animationOutStart')
        document.documentElement.classList.add('is-changing')
        document.documentElement.classList.add('is-leaving')
        if (popstate) {
            document.documentElement.classList.add('is-popstate')
        }
        document.documentElement.classList.add('to-' + this.classify(data.url))

        // animation promise
        let animationPromise = this.createAnimationPromise(this.getAnimation(this.transition, this.animations, 'out'))
        animationPromises.push(animationPromise)

        Promise
            .all(animationPromises)
            .then(() => {
                this.triggerEvent('animationOutDone')
            })

        // create pop element with or without anchor
        if (this.scrollToElement != null) {
            var pop = data.url + this.scrollToElement;
        } else {
            var pop = data.url;
        }
        if(!popstate)
            this.createState(pop)
    } else {
        // proceed without animating
        this.triggerEvent('animationSkipped')
    }

    if (this.cache.exists(data.url)) {
        var xhrPromise = new Promise(resolve => {
            resolve()
        })
        this.triggerEvent('pageRetrievedFromCache')
    } else {
        if (!this.preloadPromise || this.preloadPromise.route != data.url) {
            var xhrPromise = new Promise(resolve => {
                this.getPage(data, (response, request) => {
                    if (request.status === 500) {
                        this.triggerEvent('serverError')
                        reject(data.url)
                        return;
                    } else {
                        // get json data
                        var page = this.getDataFromHtml(response, request)
                        if (page != null) {
                            page.url = data.url
                        } else {
                            reject(data.url)
                            return;
                        }
                        // render page
                        this.cache.cacheUrl(page, this.options.debugMode)
                        this.triggerEvent('pageLoaded')
                    }
                    resolve()
                })
            })
        } else {
            var xhrPromise = this.preloadPromise
        }
    }

    Promise
        .all(animationPromises.concat([xhrPromise]))
        .then(() => {
            this.renderPage(this.cache.getPage(data.url), popstate)
            this.preloadPromise = null
        })
        .catch(errorUrl => {
                // rewrite the skipPopStateHandling function to redirect manually when the history.go is processed
                this.options.skipPopStateHandling = function () {
                window.location = errorUrl
                return true
            }

            // go back to the actual page were still at
            window.history.go(-1)
        });
}