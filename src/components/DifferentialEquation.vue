<template>
  <v-layout
  align-center
  justify-center
  >
  <v-flex>
    <h2>Differential equations</h2>

    <v-row   class="justify-center align-center fill-width">

      <LineChart @dataPointSelection="sel_x = $event.index + 1" :series="series" height="500" width="600"> </LineChart>

      <v-form>
        <v-container fluid class="d-flex justify-center">
          <v-col align-center  cols="8" sm="6">
            <v-fab-transition>
              <v-alert type="error" v-show="func_err" fab>
                {{func_err}}
              </v-alert>
            </v-fab-transition>

            <v-select v-model="method_name" :items="methods_names" menu-props="auto" label="Method" outlined></v-select>

            <v-row>
              <v-col cols="2" class="mb-auto mt-5 ">
                <h4>
                  Y' =
                </h4>
              </v-col>
              <v-col>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">

                    <v-text-field
                    v-model="func"
                    :rules="funcRules"
                    label="Function"
                    id="func"
                    outlined
                    required
                    v-on="on"
                    ></v-text-field>
                  </template>
                  <span>You can use +, -, *, /, **, sin, cos, sqrt</span>
                </v-tooltip>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="4">
                <v-text-field
                v-model="left"
                :rules="floatRules"
                label="Left bound"
                outlined
                required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                v-model="right"
                :rules="floatRules"
                label="Right bound"
                outlined
                required
                ></v-text-field>
              </v-col>
              <v-col cols="4">
                <v-text-field
                v-model="y_0"
                :rules="floatRules"
                label="Y 0"
                outlined
                required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="5">
                <v-text-field
                v-model="dots_count"
                :rules="intRules"
                @change="countAccuracy"
                label="Number of dots"
                outlined
                required
                ></v-text-field>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="5">
                <v-text-field
                v-model="accuracy"
                :rules="floatRules"
                @change="countDots"
                label="Accuracy"
                outlined
                required
                ></v-text-field>

              </v-col>
            </v-row>

            

            

            
            <v-row class="justify-center align-center">
              <v-btn
              rounded
              color="primary"
              :loading="loading"
              v-on:click="solve">
              solve
            </v-btn>
          </v-row>
        </v-col>

      </v-container>
    </v-form>
  </v-row>

</v-flex>
</v-layout>
</template>

<script type="text/javascript">
  import LineChart from '@/components/LineChart';
  import {URL_API} from '@/store/SETTINGS';

  import axios from 'axios'

  export default {
    name: 'DifferentialEquation',

    components: {
      LineChart
    },

    data: () => ({
      drawer: null,
      func: "x**2",
      methods: [],
      methods_names: [],
      method: "",
      method_name: "",
      left: -2,
      right: 2,
      y_0: 0,
      dots_count: 10,
      accuracy: 0,
      func_err: null,

      loading: false,

      funcRules: [
      v => !!v || 'Function is required',
      ],

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
      method_name (val) {
        this.method = this.methods.find(e => e.name == val).value;
      },

      right: 'countAccuracy',
      left: 'countAccuracy',
    },


    methods:{
      load_methods() {
        axios.get(`${URL_API}diff_eq`)
        .then(response => {
          this.methods = response.data.available_methods;
          this.methods_names = this.methods.map(el => el.name);
          [this.method_name] = this.methods_names;
        });
      },

      solve() {
        axios.post(`${URL_API}diff_eq`, {
          function: this.func,
          left: this.left,
          right: this.right,
          method: this.method,
          y_0: this.y_0,
          points_count: this.dots_count,
        })
        .then(response => {
          this.loading = false;
          this.series = response.data.series;
          this.func_err = "";
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

      countDots() {
        let dots_count = Math.ceil((this.right - this.left)/this.accuracy);
        if (!isNaN(+dots_count)){
          this.dots_count = dots_count;
        }

      },

      countAccuracy() {
        let acc = (this.right - this.left)/this.dots_count;
        if (!isNaN(+acc)) {
          this.accuracy = acc
        }
      }
    },

    created () {
      this.$vuetify.theme.dark = false;
    },

    mounted() {
      this.load_methods();
      this.countAccuracy();
    },

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