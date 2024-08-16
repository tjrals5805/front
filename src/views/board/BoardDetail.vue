<template>
  <div class="board-detail">
    <div class="common-buttons">
      <button type="button" class="w3-button w3-round w3-blue-gray" v-on:click="fnUpdate">수정</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-red" v-on:click="fnDelete">삭제</button>&nbsp;
      <button type="button" class="w3-button w3-round w3-gray" v-on:click="fnList">목록</button>
    </div>
    <div class="board-contents">
      <h3>{{ title }}</h3>
      <div>
        <strong class="w3-large">{{ author }}</strong>
        <br>
        <span>{{ created_at }}</span>
      </div>
    </div>


    <div class="board-contents">
      <span>{{ contents }}</span>
    </div>


      <div class="comments-section">
        <h2>댓글</h2>
        <div v-for="comment in comments" :key="comment.id" class="comment">
          <div>{{ comment.content }}</div>  <button type="button"  v-on:click="fnCommentDelete( comment.id )">삭제</button>
          <div class="w3-small w3-text-gray">{{ comment.created_at }}</div>

          <div class="w3-small w3-text-gray">{{ comment.id }}</div>


        </div>
      </div>
        <hr>





    <div>


      <div>
        <input type="text" v-model="newComment" class="w3-input w3-border" placeholder="댓글을 입력해주세요.">
        <button type="button" class="w3-button w3-round w3-blue" @click="fnSubmitComment">댓글 달기</button>
      </div>


    </div>





    </div>
</template>

<script>
export default {
  data() { //변수생성
    return {
      requestBody: this.$route.query,
      idx: this.$route.query.idx,

      title: '',
      author: '',
      contents: '',
      created_at: '',

      comments: [],
      newComment: '',
      commentsNo: '',

    }
  },
  mounted() {
    this.fnGetView();
    this.fnGetComments();
  },



  methods: {


    fnGetView() {
      this.$axios.get(this.$serverUrl + '/board/' + this.idx, {
        params: this.requestBody
      }).then((res) => {
        this.title = res.data.title
        this.author = res.data.author
        this.contents = res.data.contents
        this.created_at = res.data.created_at

      }).catch((err) => {
        if (err.message.indexOf('Network Error') > -1) {
          alert('네트워크가 원활하지 않습니다.\n잠시 후 다시 시도해주세요.')
        }
      })
    },


    fnGetComments() {
      this.$axios.get(this.$serverUrl + '/api/comments/board/detail/' + this.idx, {
        params: this.requestBody,

      }).then((res) => {

        console.log(res.data);


        this.comments = res.data;
        this.  commentsNo = res.data.id;

      }).catch((err) => {
        console.error(err);
        if (err.message.indexOf('Network Error') > -1) {
          alert('댓글을 불러오는 데 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.');
        }
      });
    },


    fnSubmitComment() {

      if (this.newComment.trim() === '') {
        alert('댓글을 입력해주세요.');
        return ;

      }

      this.$axios
          .post(this.$serverUrl + '/api/comments/board/detail/' + this.idx, {
            idx: this.idx,
            content: this.newComment,
          })
          .then(() => {
            alert('댓글이 등록되었습니다.');
            this.newComment = ''; // 입력 필드 초기화
            this.fnGetComments(); // 댓글 목록 새로고침
          })
          .catch((err) => {
            console.error(err);
            if (err.message.indexOf('Network Error') > -1) {
              alert('댓글을 등록하는 데 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.');
            } else if (err.response && err.response.status === 500) {
              alert('서버 오류가 발생했습니다. 서버 로그를 확인해주세요.');
            } else if (err.response && err.response.data && err.response.data.message) {
              alert('오류: ' + err.response.data.message);
            } else {
              alert('댓글 등록 중 알 수 없는 오류가 발생했습니다.');
            }
          });
    },
    fnCommentDelete(id) {
      if (!confirm("댓글을 삭제하시겠습니까?")) return
      console.log(this.$data.comments)
      this.$axios.delete(this.$serverUrl + '/api/comments/' + id)
          .then(() => {
            alert('댓글이 삭제되었습니다.');
            this.fnGetComments(); // 댓글 목록 새로고침
          })
          .catch((err) => {
            console.log(err);
            alert('댓글 삭제 중 문제가 발생했습니다.');
          });
    },

    fnList() {
      delete this.requestBody.idx
      this.$router.push({
        path: './list',
        query: this.requestBody
      })
    },
    fnUpdate() {
      this.$router.push({
        path: './write',
        query: this.requestBody
      })
    },
    fnDelete() {
      if (!confirm("삭제하시겠습니까?")) return

      this.$axios.delete(this.$serverUrl + '/board/' + this.idx, {})
          .then(() => {
            alert('삭제되었습니다.')
            this.fnList();
          }).catch((err) => {
        console.log(err);
      })
    }
  }
}
</script>
<style scoped>


</style>