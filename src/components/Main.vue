<template>
  <v-app id="app">
    <v-navigation-drawer v-model="drawer" app clipped temporary>
      <v-list>

        <template v-for="tab in tabs" >

          <v-list-group v-if="tab.children" :key="tab.name">
            <template v-slot:activator>
              <v-list-item-avatar>
                <v-icon style="text-align:center;" class="justify-center">{{tab.icon}}</v-icon>
              </v-list-item-avatar>
              <v-list-item-title>{{tab.name}}</v-list-item-title>
            </template>

            <v-list-item class="ml-5" v-for="child in tab.children" @click="toView(child.r)" :key="child.name">
              <v-list-item-avatar>
                <v-icon style="text-align:center;" class="justify-center">{{child.icon}}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{child.name}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>

          <v-list-item v-else @click="toView(tab.r)" :key="tab.name">
            <v-list-item-avatar>
              <v-icon style="text-align:center;" class="justify-center">{{tab.icon}}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{tab.name}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        </template>

      </v-list>
    </v-navigation-drawer>
    <v-app-bar app clipped-left color="#2d9cdb" dense dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>
        <b>Vmat</b>
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>


    <v-content>
      <v-container fluid>
        <v-container fluid>
          <router-view name="viewContent"></router-view>
        </v-container>
      </v-container>
    </v-content>



    <v-footer class="pa-0 ma-0">
      <v-card color="#2d9cdb" width="100%" class="text-center">
        <v-card-text class="white--text">
          {{ new Date().getFullYear() }} —
          <strong>Vmat</strong>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
  import router from "../router";

  export default {
    router,
    name: "Main",
    data: function() {
      return {
        drawer: false,
        tabs: [
        {
          name: "Function interpolation",
          r: "/main/interpolation",
          icon: "mdi-abjad-hebrew"
        },{
          name: "Differential Equations",
          r: "/main/diff_eq",
          icon:"mdi-abjad-hebrew"
        },]
      };
    },
    methods: {
      toView(route) {
        this.drawer = !this.drawer;
        router.push({
          path: route
        });
      },
    }
  };
</script>