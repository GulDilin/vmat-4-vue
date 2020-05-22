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
                  <v-btn
                  rounded
                  color="primary"
                  :loading="loading"
                  v-on:click="get_approx_func">
                  Get interpolation
                </v-btn>
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

            <div>
              <template v-for="i of dots_numbers">
                <transition name="fade" v-bind:key="i"  :duration="{ enter: 500, leave: 500 }" mode="out-in">
                  <div v-show="sel_x == i">
                    <v-card-text>
                      <v-fab-transition>
                        <v-text-field
                        :rules="floatRules"
                        v-show="checked_x.indexOf(i) != -1"
                        label="Correct X"
                        @input="corrected_x.set(sel_x, corr_x)"
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
                        @input="corrected_y.set(sel_x, corr_y)"
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
                        @change="del_corrected_x_from_switch(i)"
                        label="X"
                        ></v-switch>

                        <v-switch
                        v-model="checked_y"
                        label="Y"
                        @change="del_corrected_y_from_switch(i)"
                        :value="i"
                        ></v-switch>
                      </v-row>

                    </v-card-text>
                  </div>
                </transition>
              </template>
            </div>

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
              <v-btn
              justify-center
              rounded
              color="primary"
              :loading="loadingUpdate"
              v-on:click="update_func">
              Update
            </v-btn>
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
  @click="sel_x = i"
  @click:close="checked_x.pop(i)"
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
  @click="sel_x = i"
  @click:close="checked_y.pop(i)"
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

  export default {
    props: {
      source: String,
    },

    computed:{
      chartOptions: function() {
        let vm = this;
        let options =  {
          chart: {
            id:'chart',
            type: 'line',
            zoom: {
              enabled: true,
              type: 'x',
              autoScaleYaxis: true,
            },
            events: {
              dataPointSelection: (event, chartContext, {dataPointIndex}) => {
                vm.sel_x = dataPointIndex + 1;
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
            // shared: false,
            intersect: false,
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

        };
        return options;
      }
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
    }),

    watch: {
      sel_x: function(val) {
        console.log(this.corrected_x);
        this.corr_x = this.corrected_x.get(val)??this.series[1].data[val-1].x;
        this.corr_y = this.corrected_y.get(val)??this.series[1].data[val-1].y;
      },
      dots_count: function() {
        this.checked_x = [];
        this.checked_y = [];
        this.corrected_x.clear();
        this.corrected_y.clear();
      }
    },

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
          this.series = response.data.series;
          this.dots = response.data.series[1].data.map(v => v.x);
          this.dots_numbers = this.dots.map((v, i) => i + 1);

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
          this.loading = false;
        });
      },

      del_corrected_y_from_switch(i){
        if (this.checked_y.indexOf(i) === -1) {
          this.corrected_y.delete(i);
        }
      },

      del_corrected_x_from_switch(i){
        if (this.checked_x.indexOf(i) === -1) {
          this.corrected_x.delete(i);
        }
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
          this.series = response.data.series;
          this.func_err = "";
          this.new_y = null;
          this.dots = response.data.series[1].data.map(v => v.x);
          this.dots_numbers = this.dots.map((v, i) => i + 1);
        })
        .catch(error => {
          console.log(error.response);
          let data = error.response.data
          if ('error' in data){
            this.func_err = data.error;
          } else {
            this.func_err = "Server can't recogrize function";
          }
          this.loading = false;
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
          this.series = response.data.series;
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
          this.loadingUpdate = false;
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

<style type="text/css">
.fade-enter-active {
  transition: all .5s;
}
.fade-leave-active{
  transition: all .5s;

}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
  transform:  scale(0);
}
</style>