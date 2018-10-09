<template>
  <div>
    <nav class="shadow-sm navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <a class="navbar-brand" href="#">Blabla</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav d-flex justify-content-between">
          <li class="nav-item active">
            <router-link to="/" class="nav-link">{{getUsername || 'Home'}} </router-link>
          </li>
          <li class="nav-item">
            <form class="form-inline my-2 my-lg-0">
              <input class="form-control mr-sm-2" type="search" placeholder="W.I.P" aria-label="Search" v-model="searchText" >
              <button class="btn btn-outline-success my-2 my-sm-0" type="submit" @click.prevent="searchPost">Search</button>
            </form>
          </li>
          <li class="nav-item ml-auto" v-if="!getUserStatus">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item float-right">
            <a href="" class="nav-link" v-on:click.prevent="signOut" v-if="getUserStatus">Sign out</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import {SEARCH_POST, REMOVE_USER, USER_LOGOUT_G_AUTH} from '../store/actions.type'

export default {
  name: "Navbar",
  data() {
    return {
      searchText : ''
    }
  },
  computed: {
    getUserStatus() {
      return this.$store.getters.userInfo.status
    },
    getUsername() {
      return this.$store.getters.userInfo.name
    },
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    signOut() {
			this.$store.dispatch(REMOVE_USER, this.userInfo)
      
    },
    searchPost() {
      this.$store.dispatch(SEARCH_POST, this.searchText)
    }
  }
};
</script>

<style>
</style>
