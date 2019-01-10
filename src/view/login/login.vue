<style lang="less">
@import "./login.less";
</style>

<template>
	<div class="login" @keydown.enter="handleLogin">
		<div class="login-con">
			<Card icon="log-in" title="欢迎登录" :bordered="false">
				<div class="form-con">
					<login-form @on-success-valid="handleSubmit"></login-form>
					<p class="login-tip">输入任意用户名和密码即可</p>
				</div>
			</Card>
		</div>
	</div>
</template>

<script>
import loginForm from '_c/login-form'
export default {
  components: {
    loginForm
  },
  methods: {
    handleSubmit ({ userName, password }) {
      this.$router.push({
        name: 'home'
      })
    }
  }
}
</script>

<style>
</style>
