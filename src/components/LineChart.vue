<template>
  <apexchart ref="chart" :height="height" :width="width" :options="chartOptions" :series="chartSeries"></apexchart>
</template>

<script>

  export default {
    name: 'LineChart',

    props: {
      height: String,
      width: String,
      title: {
        type: String,
        default: ''
      },
      series: {
        type: Array,
        default: () => [],
      },
      xaxis_type: {
        type: String,
        default: ''
      },
    },

    watch: {
      series: 'updateSeries',

      title: 'updateTitle',

      xaxis_type: 'updateXaxisType',

    },

    computed: {
      chartOptions: function() {
        let vm = this;
        let options =  {
          chart: {
            id:'chart',
            width: '100%',
            height: '100%',
            type: 'line',
            zoom: {
              enabled: true,
              type: 'x',
              autoScaleYaxis: true,
            },
            events: {
              dataPointSelection: (event, chartContext, {dataPointIndex}) => {
                // vm.sel_x = dataPointIndex + 1;
                vm.$emit('dataPointSelection', {event: event, chartContext: chartContext, index: dataPointIndex});
              }
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            curve: 'straight'
          },
          title: {
            text: 'Functions',
            align: 'left'
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5
            },
          },
          tooltip:{
            enabled: true,
            intersect: false,
            enabledOnSeries: [0, 1, 2, 3],
            x:{
              formatter: function (value) {
                return Math.floor(value * 1000) / 1000;
              }
            },
          },
          fill: {
            opacity: 1,
          },
          markers:{
            size: [0, 6, 0, 6],
          },
          yaxis: {
            labels: {
              formatter: function (value) {
                return Math.floor(value * 1000) / 1000;
              }
            },
          },
          xaxis: {
            type:'numeric',
            labels: {
              formatter: function (value) {
                return Math.floor(value * 1000) / 1000;
              }
            },
          },

        };
        return options;
      }
    },

    data: () => ({
      xaxis_types: ['datetime', 'category', 'numeric'],

      chartSeries: [],
    }),

    methods: {
      updateTitle () {
        this.chartOptions.title.text = this.title;
        if ('chart' in this.$refs) {
          this.$refs['chart'].updateOptions({
            title: {
              text: this.chartOptions.title.text
            }
          });
        }
      },

      updateSeries () {
        this.chartSeries = this.series;
      },

      updateXaxisType () {
        if (this.xaxis_types.indexOf(this.xaxis_type) > -1){
          this.chartOptions.xaxis.type = this.xaxis_type;
          if ('chart' in this.$refs) {
            this.$refs['chart'].updateOptions({
              xaxis: {
                type: this.xaxis_type
              }
            });
          }
        }
      },
    },

    mounted() {
      this.updateSeries();
      this.updateTitle();
      this.updateXaxisType();
    }
  }
</script>