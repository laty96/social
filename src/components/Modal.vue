<template>
  <div class="modal-wrapper">
    <div class="card">
      <div class="card-header">
        <h5 class="card-title">{{i.title}} 
				<button class="close float-right" @click="$emit('close')">
					<i class="fas fa-times"></i>
				</button>
				</h5>
        <span class="badge badge-light text-secondary">{{cvDate(i.createdDate)}}</span>
      </div>
      <div class="card-body">
        <div class="card-text">{{i.content}} 
        </div>
        <hr>
        <div class="form-group" v-if="userInfo.name">
					<label for="comment-input">Comment as <small>{{userInfo.name}}</small></label>
					<textarea class="form-control" id="comment-input" rows="4" v-model="newComment.content"></textarea>
					<button class="form-control btn btn-secondary my-2" v-bind:class="{'disabled': !newComment.content}" @click="postComment">Comment</button>
        </div>
        <div class="">
          <div class="btn-group btn-group-sm float-right" :class="{'text-primary': i.isLiked}">
            <button type="button" class="btn btn-light shadow-sm" @click.stop="likePost(i)">
            <i class="fas fa-thumbs-up"></i> Like</button>
          </div>

          <div class="dropdown custom-control-inline">
						<button type="button" class="btn  btn-sm btn-light dropdown-toggle" data-toggle="dropdown">
							<code>Sort by:</code> <span class="badge badge-secondary p-1"> {{sortTypeValue}}</span>
						</button>
						<div class="dropdown-menu">
							<a @click="sortComment(1)" class="dropdown-item" v-bind:class="{active: sortType == 1}" href="#">Best</a>
							<a @click="sortComment(2)" class="dropdown-item" v-bind:class="{active: sortType == 2}" href="#">New</a>
							<a @click="sortComment(3)" class="dropdown-item" v-bind:class="{active: sortType == 3}" href="#">Old</a>
						</div>
					</div>
          </div>
        	<hr>
          <div>
					<div v-if="loading" class="align-content-center" style="text-align: center">
						<div id="loader-7">
							<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
						</div>
					</div>
          <dl v-else v-for="(c, k) in commentList" :key="c.createdTime">
            <dt class="text-primary"><small>{{c.owner}}</small></dt>
            <dd>{{c.content}}<small class="text-secondary"> &nbsp; - &nbsp;{{cvDate(c.createdTime)}}</small></dd>
						<div class="btn-group btn-group-sm ml-auto">
							<button type="button" class="btn btn-light" @click="replyComment(k)"><i class="fas fa-reply"></i> Reply</button>
							<button type="button" class="btn btn-light" @click="likeComment(c.commentID)"><i class="fas fa-thumbs-up"></i> {{c.like.length > 0 ? c.like.length : ''}} Like</button>
							<!-- <button type="button" class="btn btn-light">idk</button> -->
						</div>
						<div v-show="c.isReplied == isReplied" >
						<textarea cols="30" rows="1" class="form-control p-2 m-2" v-model="c.reply" placeholder="wip"></textarea>
						<div class="btn-group btn-group-sm">
							<button class="btn btn-light btn-sm" @click="replyComment(k)">Cancel</button>
							<button class="btn btn-secondary btn-sm" :disabled="!c.reply" @click="onReply(c)">Reply</button>
						</div>
						</div>
            <hr>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";

import { POST_COMMENT, FETCH_COMMENT } from "../store/actions.type";
import { FETCH_POST_LIST, LIKE_POST } from "../store/actions.type";

import { sortCmt } from "../utilities/index";

export default {
	name: "modal",
	props: {
		i: Object
	},
	computed: {
		...mapGetters(["comment", "userInfo"]),
		sortTypeValue() {
			if (this.sortType == 1) return "Best";
			else if (this.sortType == 2) return "New";
			else if (this.sortType == 3) return "Old";
		}
	},
	data() {
		return {
			newComment: {
				content: ""
			},
			sortType: 3,
			commentList: [],
			loading: true,
			isReplied: true
		};
	},
	methods: {
		cvDate(d) {
			return moment(d).fromNow();
		},
		postComment() {
			if (this.newComment.content) {
				let a = {
					id: this.i.id,
					content: this.newComment.content,
					createdTime: Date.now(),
					owner: this.userInfo.name
				};
        this.$store.dispatch(POST_COMMENT, a);
        this.newComment.content = "";
        this.$store.dispatch(FETCH_POST_LIST, Date.now());
        this.$store.dispatch(FETCH_COMMENT, this.i.id);
        window.setTimeout(() => {
          this.commentList = this.comment;
        }, 1000)
			}
		},
		sortComment(type) {
			this.sortType = type;
			if (type == 1) {
				let a = sortCmt(this.commentList, "like", false);
				this.commentList = a;
			} else if (type == 2) {
				let a = sortCmt(this.commentList, "createdTime", true);
				this.commentList = a;
			} else if (type == 3) {
				let a = sortCmt(this.commentList, "createdTime", false);
				this.commentList = a;
			}
		},
		replyComment(k) {
			this.commentList[k].isReplied = !this.commentList[k].isReplied;
			this.$forceUpdate();
		},
		onReply(c) {
			console.log(c)
		},
    likePost(i) {
			if (!this.userInfo.name) this.$router.push('/login')
			i.isLiked = !i.isLiked;
      this.$store.dispatch(LIKE_POST, {id: i.id, user: this.userInfo.name});
      this.$store.dispatch(FETCH_POST_LIST)
      this.$forceUpdate()
		},
		likeComment(c) {

		}
	},
	created() {
		this.$store.dispatch(FETCH_COMMENT, this.i.id);
	},
	mounted() {
		window.setTimeout(() => {
			this.commentList = this.comment;
			this.loading = false;
			this.commentList.forEach(e => {
				e.isReplied = false;
			});
		}, 1000);
		console.log(this.commentList);
		document.getElementsByTagName("body")[0].style.overflow = "hidden";
	},
	destroyed() {
		document.getElementsByTagName("body")[0].style.overflow = "";
	}
};
</script>

<style>
.modal-wrapper {
	top: 80px;
}

textarea {
	resize: none;
}
#loader-7 span {
	display: inline-block;
	height: 15px;
	width: 15px;
	background: #808080;
	border-radius: 0px;
}
#loader-7 span:nth-child(1) {
	-webkit-animation: temp 1s 0.05s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.05s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(2) {
	-webkit-animation: temp 1s 0.1s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.1s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(3) {
	-webkit-animation: temp 1s 0.15s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.15s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(4) {
	-webkit-animation: temp 1s 0.2s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.2s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(5) {
	-webkit-animation: temp 1s 0.25s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.25s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(6) {
	-webkit-animation: temp 1s 0.3s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.3s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(7) {
	-webkit-animation: temp 1s 0.35s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.35s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(8) {
	-webkit-animation: temp 1s 0.4s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.4s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(9) {
	-webkit-animation: temp 1s 0.45s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.45s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(10) {
	-webkit-animation: temp 1s 0.5s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.5s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(11) {
	-webkit-animation: temp 1s 0.55s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.55s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(12) {
	-webkit-animation: temp 1s 0.6s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.6s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(13) {
	-webkit-animation: temp 1s 0.65s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.65s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(14) {
	-webkit-animation: temp 1s 0.7s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.7s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(15) {
	-webkit-animation: temp 1s 0.75s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.75s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(16) {
	-webkit-animation: temp 1s 0.8s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.8s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(17) {
	-webkit-animation: temp 1s 0.85s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.85s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(18) {
	-webkit-animation: temp 1s 0.9s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.9s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(19) {
	-webkit-animation: temp 1s 0.95s infinite
		cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 0.95s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
#loader-7 span:nth-child(20) {
	-webkit-animation: temp 1s 1s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	animation: temp 1s 1s infinite cubic-bezier(0.005, 0.56, 0.58, 1.59);
	width: 7.5px;
	height: 7.5px;
	margin: 0 2px;
}
@keyframes temp {
	50% {
		-webkit-transform: scale(1, 5);
		transform: scale(1, 5);
		background: #195c53;
	}
}
</style>
