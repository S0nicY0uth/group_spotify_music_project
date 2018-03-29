
wait = function (time)

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
module.exports = function (err, colour='\x1b[31m%s\x1b[0m')

{

    if (err.statusCode !== undefined) {
        if (err.statusCode == '429') {
            return function () {
                console.log(colour , "Error 429, Waiting for " + JSON.stringify(err.response.headers["retry-after"]) + ' Seconds..');
                wait((err.response.headers["retry-after"] * 1000) + 1000);
            }()

        } else {

            return function () {
                console.log(colour , "Error : " + err.statusCode);
                wait(3000)
            }()
        }
    } else {
        return console.log(colour , err)
    }
}