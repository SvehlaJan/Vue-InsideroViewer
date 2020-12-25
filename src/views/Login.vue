<template>
  <b-container id="login">
    <div :class="{ 'signup-form': !showLoginForm }" class="col2">
      <b-form v-if="showLoginForm" @submit.prevent="login()">
        <h1 class="mt-4">Welcome</h1>

        <b-alert v-model="showSuccess" variant="success" show>Success</b-alert>
        <b-alert v-model="showError" variant="danger" show>{{ errorMessage }}</b-alert>

        <b-form-group id="input-group-1" label="Email address:" label-for="email1" class="mt-4">
          <b-form-input
              id="email1"
              v-model="loginForm.email"
              type="email"
              required
              placeholder="Enter email">
          </b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Password:" label-for="password1">
          <b-form-input
              id="password1"
              v-model="loginForm.password"
              type="password"
              required
              placeholder="******">
          </b-form-input>
        </b-form-group>
        <b-container>
          <b-row>
            <b-button type="submit" variant="primary">Login</b-button>
          </b-row>
          <b-row class="mt-4">
            <b-button @click="toggleForm()" variant="success">Create an Account</b-button>
          </b-row>
          <!--          <b-row class="mt-2">-->
          <!--            <b-button @click="togglePasswordReset()" variant="secondary">Forgot Password</b-button>-->
          <!--          </b-row>-->
        </b-container>

        <PasswordReset v-if="showPasswordReset" @close="togglePasswordReset()"></PasswordReset>
      </b-form>
      <b-form v-else @submit.prevent="signup()">
        <h1 class="mt-4">Get Started</h1>

        <b-alert v-model="showSuccess" variant="success" show>Success</b-alert>
        <b-alert v-model="showError" variant="danger" show>{{ errorMessage }}</b-alert>

        <b-form-group id="input-group-3" label="Email address:" label-for="email2" class="mt-4">
          <b-form-input
              id="email2"
              v-model="loginForm.email"
              type="email"
              required
              placeholder="Enter email">
          </b-form-input>
        </b-form-group>

        <b-form-group id="input-group-4" label="Password:" label-for="password2">
          <b-form-input
              id="password2"
              v-model="loginForm.password"
              type="password"
              required
              placeholder="******">
          </b-form-input>
        </b-form-group>

        <b-container>
          <b-row>
            <b-button type="submit" variant="primary">Register</b-button>
          </b-row>
          <b-row class="mt-4">
            <b-button @click="toggleForm()" variant="success">Back to Log In</b-button>
          </b-row>
        </b-container>
      </b-form>
    </div>
  </b-container>
</template>

<script>
import PasswordReset from '@/components/PasswordReset'

export default {
  components: {
    PasswordReset
  },
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
      },
      showLoginForm: true,
      showPasswordReset: false,
      showSuccess: false,
      showError: false,
      errorMessage: '',
    }
  },
  methods: {
    toggleForm() {
      this.showLoginForm = !this.showLoginForm
      this.showError = false
    },
    togglePasswordReset() {
      this.showPasswordReset = !this.showPasswordReset
      this.showError = false
      console.log("showPasswordReset: ", this.showPasswordReset)
    },
    async login() {
      this.showError = false
      try {
        await this.$store.dispatch('login', {
          email: this.loginForm.email,
          password: this.loginForm.password
        })
      } catch (error) {
        if (error.code) {
          this.errorMessage = error.message
          this.showError = true
        } else {
          console.log("Login error: ", error)
        }
      }
    },
    async signup() {
      this.showError = false
      try {
        await this.$store.dispatch('signup', {
          email: this.loginForm.email,
          password: this.loginForm.password,
        })
      } catch (error) {
        if (error.code) {
          this.errorMessage = error.message
          this.showError = true
        } else {
          console.log("Signup error: ", error)
        }
      }
    }
  }
}
</script>
