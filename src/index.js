import "./css/index.css"
import "chart.js"
import { calcIndexSum, escapeHTML, createRandomString } from "./util"

const THEME_CONTAINER_MIN_WIDTH = 400

document.addEventListener("DOMContentLoaded", function () {
    let themesContainer = document.querySelector("#themes_container")
    for (let key of Object.keys(sentiment_data)) {
        let sumData = calcIndexSum(sentiment_data[key])
        let chart_id = createRandomString(255) + "_chart"
        let element = createThemeElement(key, sumData, chart_id)
        themesContainer.appendChild(element)
        let chartCtx = document.querySelector("#" + chart_id)
        let chart = createDoughnutChart(chartCtx, sumData)
    }
})

function createThemeElement(themeName, sumData, chart_id) {
    const template = `
    <h3>${escapeHTML(themeName)}</h3>
    <div class="preview_container">
        <div class="preview_text_container">
            <div class="sentiment_text">${sumData.position}</div>
            <p>positive: ${sumData.positivePercentage}%</p>
            <p>negative: ${sumData.negativePercentage}%</p>
        </div>
        <div class="chart_container">
            <canvas id="${chart_id}" width="100%" height="100%"></canvas>
        </div>
    </div>
    <div class="hover_text">Open</div>
    `
    let container = document.createElement("div")
    container.innerHTML = template
    container.classList = ["theme_container"]
    container.addEventListener("click", () => {
        window.location.href = `./${themeName}/index.html`
    })

    return container
}

function createDoughnutChart(ctx, sumData) {
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