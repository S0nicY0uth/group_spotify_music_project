module.exports = function (time)

{
    return new Promise((resolve, fail) => {
        var start = new Date().getTime();
        var end = start;
        while (end < start + time) {
            end = new Date().getTime();
        }
        resolve()
    })

}