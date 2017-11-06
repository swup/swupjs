import Swup from 'swup'

// modules
import loadPage from './modules/loadPage'
import renderPage from './modules/renderPage'
import getAnimation from './modules/getAnimation'
import createAnimationPromise from './modules/createAnimationPromise'

export default class Swupjs extends Swup {
    constructor(setOptions) {
        let defaults = {
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

        let options = {
            ...defaults,
            ...setOptions
        }

        super(options)

        this.animations = options.animations
    }

    /**
     * make modules accessible in instance
     */
    loadPage = loadPage
    renderPage = renderPage
    getAnimation = getAnimation
    createAnimationPromise = createAnimationPromise
}
