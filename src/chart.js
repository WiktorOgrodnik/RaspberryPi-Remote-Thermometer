'use strict';

window.addEventListener('load', (event) => {
    let dates = document.getElementById("hisdate").innerHTML;
    let labels = dates.split(',').reverse();

    let temps_in = document.getElementById("histemp_in").innerHTML.split(',').reverse();
    let temps_out = document.getElementById("histemp_out").innerHTML.split(',').reverse();

    const data = {
        labels: labels,
        datasets: [
        {
            label: 'Temperature garage',
            yAxisID: 'temp',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: temps_in,
        },
        {
            label: 'Temperature outdoor',
            yAxisID: 'temp',
            backgroundColor: 'rgb(49, 132, 214)',
            borderColor: 'rgb(49, 132, 214)',
            data: temps_out,
        }
    ]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                yAxes: [
                    {
                        id: 'temp',
                        type: 'linear',
                        position: 'left',
                    },
                ]
            }
        }
    };

    new Chart(
        document.getElementById('chart'),
        config
    );
});