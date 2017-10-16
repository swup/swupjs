module.exports = function (fn) {
    return new Promise(resolve => {
        fn(resolve)
    })
}