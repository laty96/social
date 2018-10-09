<template>
  <div v-on:scroll="scrollA">
    <Navbar />
    <div class="router-view mt-5">
      <router-view></router-view>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from "../views/Navbar";
import Footer from "../views/Footer";
import Login from "../components/Login";

import {
  LOGIN_WITH_G,
  FETCH_POST_LIST,
  REMOVE_USER,
  GET_USER_LIST
} from "../store/actions.type";

import { mapGetters } from "vuex";

export default {
  name: "Home",
  components: {
    Navbar,
    Footer,
    Login
  },
  computed: {
    ...mapGetters(["post", "userInfo"])
  },
  mounted() {
    this.$store.dispatch(LOGIN_WITH_G);
    // this.$store.dispatch(GET_USER_LIST, this.userInfo);
  },
  methods: {
    scrollA(e) {
      // if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
      //   let a = this.lastPost.length - 1
      //   this.$store.dispatch(FETCH_POST_LIST, this.lastPost[a].createdDate)
      //   this.$forceUpdate()
      // }
    },
    removeUser(e) {
      this.$store.dispatch(REMOVE_USER, this.userInfo);
    }
  },
  created() {
    window.addEventListener("scroll", this.scrollA);
    window.addEventListener("unload", this.removeUser);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollA);
  }
};
</script>

<style>
</style>
