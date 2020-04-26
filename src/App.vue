<template>
  <div id="app">
    <v-app id="inspire">


      <v-app-bar
      app
      color="indigo"
      dark
      >
      <v-toolbar-title>Function approximation</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container
      
      fill-height
      fill-width
      >
      <v-layout
      align-center
      justify-center
      >
      <v-flex>



        <v-row justify-center align-center>
          <div id="chart">
            <apexchart type="line" height="500" width="600" :options="chartOptions" :series="series"></apexchart>
          </div>

          <v-form v-model="valid">
            <v-container fill-height>
              <v-col align-center>

                <v-text-field
                v-model="func"
                :rules="funcRules"
                label="Function"
                id="func"
                v-on:change="get_func"
                outlined
                required
                ></v-text-field>

                <v-text-field
                v-model="left"
                :rules="floatRules"
                label="Left bound"
                v-on:change="get_func"
                outlined
                required
                ></v-text-field>

                <v-text-field
                v-model="right"
                :rules="floatRules"
                label="Right bound"
                v-on:change="get_func"
                outlined
                required
                ></v-text-field>

                <v-text-field
                v-model="dots_count"
                :rules="intRules"
                label="Number of dots"
                outlined
                required
                ></v-text-field>

                <v-btn
                rounded
                v-on:click="get_approx_func"

                >
                Get approximation
              </v-btn>

            </v-col>
          </v-container>
        </v-form>
      </v-row>
    </v-flex>
  </v-layout>
</v-container>
</v-content>
<v-footer
color="indigo"
app
>
<span class="white--text">&copy; 2020</span>
<v-tooltip right>
  <template v-slot:activator="{ on }">
    <v-btn
    icon
    large
    href="https://github.com/GulDilin/vmat-4-compose"
    target="_blank"
    v-on="on"
    >
    <v-icon large color="white">mdi-github</v-icon>
  </v-btn>
</template>
<span>Source</span>
</v-tooltip>
</v-footer>
</v-app>
</div>
</template>

<script>
  import axios from 'axios'
  //   // import VueApexCharts from 'vue-apexcharts'
  import ApexCharts from 'apexcharts'

  export default {
    props: {
      source: String,
    },
    data: () => ({
      drawer: null,
      func: "x**2",
      funcRules: [
      v => !!v || 'Function is required',
      ],
      left: -2,
      right: 2,
      dots_count: 10,
      floatRules: [
      v => !!v || 'Float value is required',
      v => !isNaN(parseFloat(v)) && isFinite(v)|| 'Need to me decimal',
      ],
      intRules: [
      v => !!v || 'Integer value is required',
      v => !isNaN(parseInt(v)) && isFinite(v)|| 'Need to be integer',
      v => (v.valueOf() > 0) || 'Need to be positive'
      ],
      series: [],
      chartOptions: {
        chart: {
          id:'chart',
          type: 'line',
          zoom: {
            enabled: false
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
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
          x:{
            // show: true,
            formatter: function (value) {
              return Math.floor(value * 1000) / 1000;
            }
          }
        },
        fill: {
          opacity: 1,
        },
        markers:{
          size: [0, 6, 0],
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
        },

      },
    }),
    
    methods:{
      get_func() {
        axios.post('https://vmat-4-api.herokuapp.com/api/', {
          function: this.func,
          left: this.left,
          right: this.right,
          points_count: this.dots_count
        })
        .then(function (response) {
          console.log(response.series);
          ApexCharts.exec("chart", "updateOptions", {
            series: response.data.series,
          });

        })
        .catch(function (error) {
          console.log(error);
        });
      },
      get_approx_func() {
        axios.post('https://vmat-4-api.herokuapp.com/api/', {
          function: this.func,
          left: this.left,
          right: this.right,
          points_count: this.dots_count,
          approximate: true
        })
        .then(function (response) {
          console.log(response.series);
          ApexCharts.exec("chart", "updateOptions", {
            series: response.data.series,
          });

        })
        .catch(function (error) {
          console.log(error);
        });
      }
    },

    created () {
      this.$vuetify.theme.dark = false
    },

    mounted() {
      this.get_func();
    }
  }
</script>