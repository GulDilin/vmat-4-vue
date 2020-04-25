<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">

  </div>
</template>

<script>

import axios from 'axios'
    // import VueApexCharts from 'vue-apexcharts'
    import axios from 'axios'
    
    import ApexCharts from 'apexcharts'

    export default{
        data(){
            return {
                series: [],
                chartOptions: {
                    chart: {
                        height: 500,
                        id:'chart2',
                        type: 'line',
                        zoom: {
                            enabled: false
                        },
                        toolbar: {
                            autoSelected: 'pan',
                            show: false
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        curve: 'stepline'
                    },
                    title: {
                        text: 'Node usage',
                        align: 'left'
                    },
                    grid: {
                        row: {
                            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                            opacity: 0.5
                        },
                    },
                    fill: {
                        opacity: 1,
                    },
                    markers: {
                        size: 0
                    },
                    // xaxis: null,
                    xaxis: {
                        type:'datetime',
                        // categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
                    },

                },
                seriesLine: [],
                chartOptionsLine: {
                    chart: {
                        id: 'chart1',
                        height: 130,
                        type: 'area',
                        brush:{
                            target: 'chart2',
                            enabled: true
                        },
                        selection: {
                            enabled: true,
                            xaxis: {
                            },
                        },
                    },
                    colors: ['#008FFB'],
                    stroke: {
                        curve: 'stepline'
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            opacityFrom: 0.91,
                            opacityTo: 0.1,
                        }
                    },
                    xaxis: {
                        type: 'datetime',
                        tooltip: {
                            enabled: false
                        }
                    },
                    yaxis: {
                        tickAmount: 2
                    }
                },
                seriesRange: [
                    {
                        data: []
                    }
                ],
                chartOptionsRange: {
                    chart: {
                        height: 350,
                        type: 'rangeBar',
                        id: 'chart3',
                        zoom: {
                            enabled: true
                        },
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        formatter: function(val, opts) {
                            var label = opts.w.globals.labels[opts.dataPointIndex]
                            return label
                        },
                        style: {
                            colors: ['#f3f4f5', '#fff']
                        }
                    },
                    xaxis: {
                        type: 'datetime'
                    },
                    yaxis: {
                        show: false
                    },
                    grid: {
                        row: {
                            colors: ['#f3f4f5', '#fff'],
                            opacity: 1
                        }
                    }
                }
            }
        },
        mounted() {
            axios
            .get('http://192.168.99.100:5000/api/zabbix/node_usage?interval=d&from=1586300000&node=PITER-WIN10')
            .then(response => {
                ApexCharts.exec("chart1", "updateOptions", {
                    series: response.data.series,
                    xaxis: {
                        type: 'datetime',
                        categories: response.data.xaxis.categories,
                    },
                    selection: {
                        enabled: true,
                        xaxis: {
                            min: response.data.xaxis.categories[0],// new Date(response.data.xaxis.categories[0]).getTime(),
                            max: response.data.xaxis.categories[- response.data.xaxis.categories.length / 4]// new Date(response.data.xaxis.categories[-1]).getTime()
                        }
                    },
                });
                ApexCharts.exec("chart2", "updateOptions", {
                    series: response.data.series,
                    xaxis: {
                        type: 'datetime',
                        categories: response.data.xaxis.categories,
                    },
                    tooltip: {
                        x: {
                            format: 'dd/MM/yy HH:mm'
                        }
                    }
                });

                // this.series = response.data.series;
                // this.chartOptions.xaxis.categories = response.data.xaxis.categories;
                // console.log(response.data.xaxis.categories);
            })
            .catch(error => {
                console.log(error);
                alert(error);
            });
            axios
            .get('http://192.168.99.100:5000/api/zabbix/node_jobs?from=1586822400&to=1586908800&node=PITER-WIN10&intervals=1')
            .then(response => {
                ApexCharts.exec("chart3", "updateOptions", {
                    series: response.data.series,
                });
            });
        }
    }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
