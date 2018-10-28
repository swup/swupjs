module.exports = function (transition, animations, type) {

    let animation = null
    let animationName = null
    let topRating = 0

    Object.keys(animations).forEach(item => {
        let rating = 0
        if (item.includes('>')) {
            let route = item.split('>')
            let from = route[0]
            let to = route[1]

            // TO equals to TO
            if (to == transition.to || to == "*") {
                rating++
            }

            // equals to CUSTOM animation
            if (to == transition.custom) {
                rating=rating+2
            }

            // FROM equals or is ANY
            if (from == transition.from || from == "*") {
                rating++
            }
        }

        // set new final animation
        if (rating > topRating) {
            topRating = rating
            animationName = item
            animation = animations[item]
        }
    })

    if (animation == null || topRating == 1) {
        animation = animations['*']
        animationName = '*'
    }

    return animation[type]
}