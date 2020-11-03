function calcIndexSum(data) {
    const positiveIndexSum = Object.keys(data).map((key) => {
        return data[key].positive.index
    }).reduce((prev, current) => prev + current)
    const negativeIndexSum = Object.keys(data).map((key) => {
        return data[key].negative.index
    }).reduce((prev, current) => prev + current)
    const positiveLikeSum = Object.keys(data).map((key) => {
        return data[key].positive.likes
    }).reduce((prev, current) => prev + current)
    const negativeLikeSum = Object.keys(data).map((key) => {
        return data[key].negative.likes
    }).reduce((prev, current) => prev + current)
    const positiveTweetsSum = Object.keys(data).map((key) => {
        return data[key].positive.tweets
    }).reduce((prev, current) => prev + current)
    const negativeTweetsSum = Object.keys(data).map((key) => {
        return data[key].negative.tweets
    }).reduce((prev, current) => prev + current)
    const total = positiveIndexSum + negativeIndexSum

    let position
    if (positiveIndexSum === negativeIndexSum) {
        position = "balance"
    } else if (negativeIndexSum < positiveIndexSum) {
        position = "positive"
    } else {
        position = "negative"
    }

    return {
        "positiveIndex": positiveIndexSum,
        "negativeIndex": negativeIndexSum,
        "positiveTweets": positiveTweetsSum,
        "negativeTweets": negativeTweetsSum,
        "positiveLikes": positiveLikeSum,
        "negativeLikes": negativeLikeSum,
        "total": total,
        "position": position,
        "positivePercentage": Math.round((positiveIndexSum / total) * 1000) / 10,
        "negativePercentage": Math.round((negativeIndexSum / total) * 1000) / 10,
    }
}

function escapeHTML(string) {
    if (typeof string !== 'string') {
        return string;
    }
    return string.replace(/[&'`"<>]/g, function (match) {
        return {
            '&': '&amp;',
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
        }[match]
    });
}


function createRandomString(length, minCharCode = 98, maxCharCode = 122) {
    diff = maxCharCode - minCharCode
    result = ""
    for (let i = 0; i < length; i++) {
        result += String.fromCharCode(minCharCode + Math.floor(Math.random() * diff))
    }
    return result
}

module.exports = {
    calcIndexSum: calcIndexSum,
    escapeHTML: escapeHTML,
    createRandomString: createRandomString
}