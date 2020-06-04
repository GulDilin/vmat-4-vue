<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>


<script>
export default {
  name: "App"
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Ubuntu&display=swap");

#app {
  font-family: "Ubuntu"m sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f2f4fa;
  color: #535353;
  font-size: 16px !important;
}

h1 {
  font-size: 40px;
}

h2 {
  font-size: 32px;
  color: #535353;
}

h3 {
  color: #535353;
  font-size: 24px;
}

/* tables */
th span {
  font-size: 16px;
}

td {
  font-size: 16px !important;
}

p {
  color: #535353;
  font-size: 16px !important;
}
</style>

