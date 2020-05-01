<template>
  <div id="app">
    <v-app id="inspire">


      <v-app-bar
      app
      color="indigo"
      dark
      >
      <v-toolbar-title>Function interpolation</v-toolbar-title>
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

        <v-row   class="justify-center align-center fill-width">

          <div id="chart" >
            <apexchart type="line" height="500" width="600" :options="chartOptions" :series="series"></apexchart>
          </div>

          <v-form v-model="valid">
            <v-container fill-height>
              <v-col align-center  cols="12" sm="6">


                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-text-field
                    v-model="func"
                    :rules="funcRules"
                    label="Function"
                    id="func"
                    v-on:change="get_func"
                    outlined
                    required
                    v-on="on"
                    ></v-text-field>
                  </template>
                  <span>You can use +, -, *, /, **, sin, cos, sqrt</span>
                </v-tooltip>

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

                <v-row class="justify-center align-center">


                  <v-skeleton-loader
                  class="mx-auto"
                  type="chip"
                  :transition="fade"
                  :loading=loading>
                  <v-btn
                  rounded
                  color="primary"
                  v-on:click="get_approx_func">
                  Get interpolation
                </v-btn>
              </v-skeleton-loader>
            </v-row>
          </v-col>
          <v-col >

            <v-fab-transition>
              <v-alert type="error" v-show="func_err" fab>
                {{func_err}}
              </v-alert>
            </v-fab-transition>

            <v-select
            v-model="sel_x"
            clearable
            :items="dots_numbers"
            menu-props="auto"
            label="Dot number"
            outlined
            ></v-select>

            <template v-for="i of dots_numbers" >
              <v-fab-transition v-bind:key="i">
                <div   v-show="sel_x == i" fab>
                  <v-card-text>


                    <v-fab-transition>
                      <v-text-field
                      :rules="floatRules"
                      v-show="checked_x.indexOf(i) != -1"
                      label="Correct X"
                      v-on:change="correct_x"
                      v-model="corr_x"
                      outlined
                      required
                      fab
                      ></v-text-field>
                    </v-fab-transition>

                    <v-fab-transition>
                      <v-text-field
                      :rules="floatRules"
                      v-show="checked_y.indexOf(i) != -1"
                      v-on:change="correct_y"
                      v-model="corr_y"
                      label="Correct Y"
                      outlined
                      required
                      fab
                      ></v-text-field>
                    </v-fab-transition>

                    <v-row class="justify-space-around">
                      <v-switch
                      v-model="checked_x"
                      :value="i"
                      label="X"
                      ></v-switch>

                      <v-switch
                      v-model="checked_y"
                      label="Y"
                      :value="i"
                      ></v-switch>
                    </v-row>

                  </v-card-text>
                </div>
              </v-fab-transition>
            </template>

            <p class="title text-center">Count new Y value</p>
            <v-text-field
            v-model="new_x"
            :rules="floatRules"
            label="New X"
            outlined
            required
            ></v-text-field>

            <v-fab-transition>
              <v-alert
              border="right"
              color="blue-grey"
              dark
              fab
              v-show="new_y != null">{{new_y}}</v-alert>
            </v-fab-transition>

            <v-row class="justify-center align-center">
              <v-skeleton-loader
              class="mx-auto"
              type="chip"
              :transition="fade"
              :loading="loadingUpdate">
              <v-btn
              justify-center
              rounded
              color="primary"
              v-on:click="update_func">
              Update
            </v-btn>
          </v-skeleton-loader>
        </v-row>

      </v-col>

    </v-container>
  </v-form>
</v-row>

<v-chip-group>
  <v-chip outlined label color="primary">Dots with corrected X:</v-chip>
  <v-chip
  v-for="i of checked_x"
  v-bind:key="i"
  close
  @click:close="del_corrected_x(i)"
  >
  {{i}}
</v-chip>
</v-chip-group>

<v-chip-group>
  <v-chip outlined label color="primary">Dots with corrected Y:</v-chip>
  <v-chip
  v-for="i of checked_y"
  v-bind:key="i"
  close
  @click:close="del_corrected_y(i)"
  >
  {{i}}
</v-chip>
</v-chip-group>

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
      sel_x: null,
      dots_count: 10,
      new_x: 5,
      dots: [],
      dots_numbers: [],
      func_err: null,
      new_y: null,
      corr_x: null,
      corr_y: null,
      checked_x: [],
      corrected_x: null,
      corrected_y: null,

      loadingUpdate: false,
      loading: false,
      checked_y: [],
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
            enabled: true
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
          shared: true,
          enabledOnSeries: [0, 1, 2, 3],
          x:{
            // show: true,
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
        },

      },
    }),
    
    methods:{
      get_func() {
        this.loading = true;

        axios.post('https://vmat-4-api.herokuapp.com/api/', {
          function: this.func,
          left: this.left,
          right: this.right,
          points_count: this.dots_count
        })
        .then(response =>  {
          this.loading = false;

          ApexCharts.exec("chart", "updateOptions", {
            series: response.data.series,
          });
          this.dots = response.data.series[1].data.map(v => v.x);
          this.dots_numbers = this.dots.map((v, i) => i + 1);
          // this.choosed_x = this.dots.map(v => v != null);

          this.func_err = "";
          this.new_y = null;
          this.corrected_x.clear();
          this.corrected_y.clear();
          this.checked_x = [];
          this.checked_y = [];
        })
        .catch(error => {
          console.log(error);
          let data = error.response.data
          if ('error' in data){
            this.func_err = data.error;
          } else {
            this.func_err = "Server can't recogrize function";
          }
        });
      },

      correct_x() {
        this.corrected_x.set(this.sel_x, this.corr_x);
      },

      correct_y() {
        this.corrected_y.set(this.sel_x, this.corr_y);
      },

      del_corrected_x(i){
        this.corrected_x.delete(i);
        this.checked_x.pop(i);
      },

      del_corrected_y(i){
        this.corrected_y.delete(i);
        this.checked_y.pop(i);
      },

      get_approx_func() {
        this.loading = true;

        let corrected_x_list = []
        for (let [key, value] of this.corrected_x) {
          corrected_x_list.push({index: key - 1, x: value});
        }
        let corrected_y_list = [];
        for (let [key, value] of this.corrected_y) {
          corrected_y_list.push({index: key - 1, y: value});

        }

        axios.post('https://vmat-4-api.herokuapp.com/api/', {
          function: this.func,
          left: this.left,
          right: this.right,
          points_count: this.dots_count,
          approximate: true,
          correct_x: corrected_x_list,
          correct_y: corrected_y_list
        })
        .then(response => {
          this.loading = false;
          ApexCharts.exec("chart", "updateOptions", {
            series: response.data.series,
          });
          this.func_err = "";
          this.new_y = null;
          this.dots = response.data.series[1].data.map(v => v.x);
          this.dots_numbers = this.dots.map((v, i) => i + 1);
          // this.choosed_x = this.dots.map(v => v != null);
        })
        .catch(error => {
          console.log(error.response);
          let data = error.response.data
          if ('error' in data){
            this.func_err = data.error;
          } else {
            this.func_err = "Server can't recogrize function";
          }
        });
      },

      update_func() {
        this.loadingUpdate = true;

        let corrected_x_list = []
        for (let [key, value] of this.corrected_x) {
          corrected_x_list.push({index: key - 1, x: value});
        }
        let corrected_y_list = [];
        for (let [key, value] of this.corrected_y) {
          corrected_y_list.push({index: key - 1, y: value});
        }
        axios.post('https://vmat-4-api.herokuapp.com/api/', {
          function: this.func,
          left: this.left,
          right: this.right,
          points_count: this.dots_count,
          approximate: true,
          correct_x: corrected_x_list,
          correct_y: corrected_y_list,
          new_x: this.new_x
        })
        .then(response => {
          this.loadingUpdate = false;

          ApexCharts.exec("chart", "updateOptions", {
            series: response.data.series,
          });
          this.new_y = response.data.new_y
          this.func_err = "";
          this.dots = response.data.series[1].data.map(v => v.x);
          this.dots_numbers = this.dots.map((v, i) => i + 1);
        })
        .catch(error => {
          console.log(error);
          let data = error.response.data
          if ('error' in data){
            this.func_err = data.error;
          } else {
            this.func_err = "Server couldnt find y for that x";
          }
        });
      }
    },

    created () {
      this.$vuetify.theme.dark = false;
      this.corrected_x = new Map([]);
      this.corrected_y = new Map([]);
    },

    mounted() {
      this.get_func();
    }
  }
</script>