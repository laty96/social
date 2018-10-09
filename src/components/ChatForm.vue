<template>
  <div class="fixed-bottom flex-row-reverse d-inline-flex">
    <div class="col-md-3 col-sm-4 m-0" v-for="(user, k) in users" :key="k">
      <div class="card shadow"> 
        <div class="card-header py-1 my-0 btn bg-primary" @click="minimizeChat(k)">
          <i class="fas fa-circle" :class="{'text-success': user.status}"></i> 
					<a class="text-white"> {{user.name}}</a>
          <button class="close float-right" @click.stop="onCLick(k)">&times;</button>
        </div>
        <div class="card-body" v-if="!user.minimize" style="height: 250px;">
          <div class="card-text">some text</div>
        </div>
        <input type="text" class="form-control" v-if="!user.minimize">
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: "ChatForm",
	props: {
		userList: Array
	},
	computed: {
		users() {
			return this.userList;
		}
	},
	methods: {
		onCLick(k) {
			this.$emit("closeChat", k);
		},
		minimizeChat(k) {
			this.users[k].minimize = !this.users[k].minimize;
			this.$forceUpdate();
		}
	}
};
</script>

<style>
.minimize {
	top: 18em;
}
</style>
