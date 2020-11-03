import "./css/style.css"
import { calcIndexSum } from "./util"
import "chart.js"

document.addEventListener("DOMContentLoaded", function () {
    const dataSum = calcIndexSum(sentiment_data)
    let headerSentimentText = document.querySelector("#sentiment_text")
    let headerPositivePercentageText = document.querySelector("#positive_percentage")
    let headerNegativePercentageText = document.querySelector("#negative_percentage")
    headerSentimentText.textContent = dataSum.position
    headerPositivePercentageText.textContent = "positive: " + dataSum.positivePercentage + "%"
    headerNegativePercentageText.textContent = "negative: " + dataSum.negativePercentage + "%"

    // doughnut charts
    let indexDoughnutChartCtx = document.querySelector("#index_doughnut_chart")
    let indexDoughnutChart = createIndexDounutChart(indexDoughnutChartCtx, dataSum)
    let tweetsDoughnutChartCtx = document.querySelector("#tweets_doughnut_chart")
    let tweetsDoughnutChart = createTweetsDoughnutChart(tweetsDoughnutChartCtx, dataSum)
    let likesDoughnutChartCtx = document.querySelector("#likes_doughnut_chart")
    let likesDoughnutChart = createLikesDoughnutChart(likesDoughnutChartCtx, dataSum)

    let indexLineChartCtx = document.querySelector("#index_line_chart")
    let indexLineChart = createIndexLineChart(indexLineChartCtx, sentiment_data)
    let tweetsLineChartCtx = document.querySelector("#tweets_line_chart")
    let tweetsLineChart = createTweetsLineChart(tweetsLineChartCtx, sentiment_data)
    let likesLineChartCtx = document.querySelector("#likes_line_chart")
    let likesLineChart = createLikesLineChart(likesLineChartCtx, sentiment_data)
})

function createIndexDounutChart(ctx, sumData) {
    return new Chart(ctx, {
        "type": "doughnut",
        "data": {
            "labels": ["positive", "negative"],
            "datasets": [
                {
                    "data": [sumData.positivePercentage, sumData.negativePercentage],
                    "backgroundColor": [
                        'rgba(255, 255, 255)',
                        'rgba(0, 0, 0)'
                    ],
                    "borderColor": [
                        'rgba(0, 0, 0)',
                        'rgba(0, 0, 0)',
                    ]
                }
            ]
        },
        options: {
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        return data.labels[tooltipItem.index]
                            + ": "
                            + data.datasets[0].data[tooltipItem.index]
                            + "%"
                    }
                }
            }
        }
    })
}

function createTweetsDoughnutChart(ctx, data) {
    return new Chart(ctx, {
        "type": "doughnut",
        "data": {
            "labels": ["positive_tweet", "negative_tweet"],
            "datasets": [
                {
                    "data": [data.positiveTweets, data.negativeTweets],
                    "backgroundColor": [
                        'rgba(255, 255, 255)',
                        'rgba(0, 0, 0)'
                    ],
                    "borderColor": [
                        'rgba(0, 0, 0)',
                        'rgba(0, 0, 0)',
                    ]
                }
            ]
        }
    })
}

function createLikesDoughnutChart(ctx, data) {
    return new Chart(ctx, {
        "type": "doughnut",
        "data": {
            "labels": ["positive_like", "negative_like"],
            "datasets": [
                {
                    "data": [data.positiveLikes, data.negativeLikes],
                    "backgroundColor": [
                        'rgba(255, 255, 255)',
                        'rgba(0, 0, 0)'
                    ],
                    "borderColor": [
                        'rgba(0, 0, 0)',
                        'rgba(0, 0, 0)'
                    ]
                }
            ]
        }
    })
}

function createIndexLineChart(ctx, data) {
    return new Chart(ctx, {
        "type": "line",
        "data": {
            "labels": Object.keys(data).map((val) => val.replace(/_/g, "/")),
            "datasets": [
                {
                    "label": "sentiment_index",
                    "data": Object.keys(data).map((date) => data[date].sentiment_index),
                    "fill": true,
                    "backgroundColor": "rgba(0, 0, 0)"
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    "ticks": {
                        "min": -1,
                        "max": 1,
                        "stepSize": 0.5
                    },
                    "gridLines": {
                        "display": false,
                    },
                }],
                xAxes: [{
                    "gridLines": {
                        "display": false,
                    },
                }]
            }
        }
    })
}

function createTweetsLineChart(ctx, data) {
    return new Chart(ctx, {
        "type": "line",
        "data": {
            "labels": Object.keys(data).map((val) => val.replace(/_/g, "/")),
            "datasets": [
                {
                    "label": "positive_tweets",
                    "data": Object.keys(data).map((date) => data[date].positive.tweets),
                    "fill": true,
                    "backgroundColor": "rgba(0, 0, 0)",
                    "borderColor": "rgba(0, 0, 0)",
                    "borderWidth": "2"
                },
                {
                    "label": "negative_tweets",
                    "data": Object.keys(data).map((date) => data[date].negative.tweets * -1),
                    "fill": true,
                    "backgroundColor": "rgba(255, 255, 255)",
                    "borderColor": "rgba(0, 0, 0)",
                    "borderWidth": "2"
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    "ticks": {
                        "min": -100,
                        "max": 100,
                        "stepSize": 500
                    },
                }],
                xAxes: [{
                    "gridLines": {
                        "display": false,
                    },
                }]
            }
        }
    })
}

function createLikesLineChart(ctx, data) {
    return new Chart(ctx, {
        "type": "line",
        "data": {
            "labels": Object.keys(data).map((val) => val.replace(/_/g, "/")),
            "datasets": [
                {
                    "label": "positive_likes",
                    "data": Object.keys(data).map((date) => data[date].positive.likes),
                    "fill": true,
                    "backgroundColor": "rgba(0, 0, 0)",
                    "borderColor": "rgba(0, 0, 0)",
                    "borderWidth": "2"
                },
                {
                    "label": "negative_likes",
                    "data": Object.keys(data).map((date) => data[date].negative.likes * -1),
                    "fill": true,
                    "backgroundColor": "rgba(255, 255, 255)",
                    "borderColor": "rgba(0, 0, 0)",
                    "borderWidth": "2"
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    "ticks": {
                        "stepSize": 1000
                    }
                }],
                xAxes: [{
                    "gridLines": {
                        "display": false,
                    },
                }]
            }
        }
    })
}
