<template>
  <div class="post-view">
    <div class="loader" v-if="post.length < 1">
      <div class="align-content-center" style="text-align: center">
        <div id="loader-7">
          <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
    </div>
    <div v-else class="card shadow post-view mb-2" v-for="(i, k) in post" :key="i[k]" @click="show(i)">
      <div class="card-body">
        <small>Posted by </small><small class="text-primary">{{i.owner}}</small><span class="badge badge-light"><small>{{cvDate(i.createdDate)}}</small></span>
        <h5 class="card-title">{{i.title}}
        </h5>
        <p class="card-text">{{i.content}}</p>
				<div class="btn-group btn-group-sm">
					<button type="button" class="btn btn-light shadow-sm" @click="viewComments(i)">
            <i class="fas fa-comment"></i> {{i.comment.length > 0 ? i.comment.length : '' }} {{i.comment.length > 1 ? 'Comments' : 'Comment'}}</button>
					<button type="button" class="btn btn-light shadow-sm" @click.stop="likePost(i, k)">
            <i class="fas fa-thumbs-up" v-bind:class="{'text-primary' : checkLiked(i) }"></i>  {{i.like.length > 0 ? i.like.length : ''}} Like</button>
					<button type="button" class="btn btn-light shadow-sm"><i class="fas fa-share"></i> Share</button>
				</div>
      </div>
    </div>
		<modal name="view-post">
    
		</modal>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";

import { FETCH_POST_LIST, LIKE_POST } from "../store/actions.type";
import modal from "./Modal";

export default {
	name: "PostView",
	computed: {
		...mapGetters(["post", "userInfo"])
	},
	beforeCreate() {
		this.$store.dispatch(FETCH_POST_LIST, Date.now());
	},
	methods: {
		fetchPost() {},
		viewComments(i) {},
		likePost(i, k) {
			if (this.userInfo.name) {
				this.$store.dispatch(LIKE_POST, {
					id: i.id,
					user: this.userInfo.name
				});
				// window.setTimeout(this.$store.dispatch(FETCH_POST_LIST), 500);
			} else {
				this.$router.push("/login");
			}
		},
		show(i) {
			this.$modal.show(
				modal,
				{ i },
				{
					height: "auto",
					width: "80%",
					style: { "z-index": 9000 },
					scrollable: true
				},
				{
					closed: this.hide
				}
			);
		},
		hide() {
			this.$modal.hide("view-post");
		},
		cvDate(d) {
			return moment(d).fromNow();
		},
    checkLiked(i) {
      let a = false
      i.like.forEach(e => {
        if (e == this.userInfo.name) {
          a = true;
          return
        }
      })
      return a
    }
	}
};
</script>

<style scoped>
.post-view {
	cursor: pointer;
}
</style>
