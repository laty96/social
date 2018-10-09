<template>
  <div class="col-md-3 py-3" v-if="userInfo.email">
    <div>
      <div class="card shadow-sm" style="{position: fixed;width: 20vw}">
        <div class="card-header btn" data-toggle="collapse" data-target="#collapsibleSideMenu">
            <i class="fas fa-chevron-down"></i>
        </div>
        <div class="card-content collapse show" id="collapsibleSideMenu">
          <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="user in getUserList" :key="user.name" @click="openChat(user)">
              <i class="fas fa-circle" :class="{'text-success': user.status}"></i>
              <a href="#" class="card-link">
                 {{user.name}}
              </a>
              <small>{{cvDate(user.lastLogedIn)}}</small>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <ChatForm :userList="userList" v-on:closeChat="removeChat"/>
  </div>
</template>

<script>
import moment from "moment";

import { mapGetters } from "vuex"
import ChatForm from "./ChatForm";
import {CREATE_CONVERSATION} from '../store/actions.type'
export default {
	name: "SideMenu",
  components: {
    ChatForm
  },
  data() {
    return {
      userList: []
    }
  },
  computed: {
    ...mapGetters(['getUserList', 'userInfo'])
  },
  mounted() {
    console.log(this.getUserList)
  },
  methods: {
    cvDate(d) {
			return moment(d).fromNow();
		},
    openChat(u) {
      this.$store.dispatch(CREATE_CONVERSATION, {u, userInfo: this.userInfo})
      if (this.userList.indexOf(u) < 0) this.userList.unshift(u);
      if (this.userList.length > 4) {
        this.userList.pop()
      }
    },
    removeChat(e) {
      this.userList.splice(e, 1)
    }
  }
};
</script>

<style>
</style>
