<template>
  <div id="app">
    <Navigator />
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  components: {
    Navigator: () => import("@/components/Navigator.vue"),
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto");
$primary: #30a0ee;
$error: #ef5777;
$success: #1abc9c;
$light: #f5f8fa;
$medium: #657786;
$dark: #34495e;
$white: #fff;

body {
  margin: 0;
  color: $dark;
  background: #e6ecf0;
}

html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}

* {
  font-family: "Roboto", sans-serif;
  box-sizing: border-box;
  transition: 0.15s;

  &:focus {
    outline: none;
  }
}

h1,
h2,
h3,
h4,
h5,
p {
  margin: 0 0 0.5rem;
  cursor: default;
}

h1 {
  font-size: 2rem;
}

h2 {
  font-size: 1.8rem;
}

h3 {
  font-size: 1.6rem;
}

h4 {
  font-size: 1.4rem;
}

h5 {
  font-size: 1.2rem;
}

p {
  line-height: 1.5;
}

.fix {
  margin: 40px 10px;
}

a {
  font-family: "Roboto", sans-serif;
  text-decoration: none;
  color: $primary;
  margin: 0;
  cursor: pointer;

  &:hover {
    color: lighten($primary, 5%);
  }
}

.btn {
  background: $primary;
  border: 0;
  outline: 0;
  color: $white;
  padding: 0.8rem 1rem;
  min-width: 150px;
  font-size: 16px;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: lighten($primary, 5%);
  }

  &:disabled {
    opacity: 0.5;

    &:hover {
      background: $primary;
    }
  }
}

.danger {
  background: crimson;
  &:hover {
    background: red;
  }
}

section {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  @media screen and (max-width: 742px) {
    display: block;
  }
}

.flex {
  display: flex;
}

.flexy {
  display: flex;
  flex-direction: column;
}

.inline {
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: inline-block;
  }
}

.change {
  cursor: text;
  &::after {
    content: "✏️";
  }
}

.col1,
.col2 {
  flex-grow: 1;
  flex-basis: 0;
  padding: 1rem;
  @media screen and (max-width: 742px) {
  }
}

label {
  display: block;
  font-size: 16px;
  margin-bottom: 0.5rem;
}

input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  font-size: 16px;
  padding: 10px;
  outline: 0;
  border: 1px solid #e6ecf0;
  border-radius: 3px;

  &:focus {
    box-shadow: 0 0 5px 0 rgba($dark, 0.2);
  }
}

[v-cloak] {
  display: none;
}

.fade-enter-active {
  transition: opacity 0.5s;
}

.fade-leave-active {
  transition: opacity 0s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>


