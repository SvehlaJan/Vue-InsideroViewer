<template>
  <b-container id="login">
    <PasswordReset v-if="showPasswordReset" @close="togglePasswordReset()"></PasswordReset>
    <section>
      <div :class="{ 'signup-form': !showLoginForm }" class="col2">
        <b-form v-if="showLoginForm" @submit.prevent="login()">
          <h1>Welcome</h1>

          <b-alert v-model="showSuccess" variant="success" show>Success</b-alert>

          <b-form-group id="input-group-1" label="Email address:" label-for="email1">
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
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button @click="togglePasswordReset()" variant="secondary">Forgot Password</b-button>
          <b-button @click="toggleForm()" variant="success">Create an Account</b-button>
        </b-form>
        <b-form v-else @submit.prevent="signup()">
          <h1>Get Started</h1>

          <b-alert v-model="showSuccess" variant="success" show>Success</b-alert>

          <b-form-group id="input-group-3" label="Email address:" label-for="email2">
            <b-form-input
                id="email2"
                v-model="signupForm.email"
                type="email"
                required
                placeholder="Enter email">
            </b-form-input>
          </b-form-group>

          <b-form-group id="input-group-4" label="Password:" label-for="password2">
            <b-form-input
                id="password2"
                v-model="signupForm.password"
                type="password"
                required
                placeholder="******">
            </b-form-input>
          </b-form-group>

          <b-form-group id="input-group-5" label="Insidero API Key:" label-for="apiKey1">
            <b-form-input
                id="apiKey1"
                v-model="signupForm.apiKey"
                type="password"
                required
                placeholder="******">
            </b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button @click="toggleForm()" variant="success">Back to Log In</b-button>
        </b-form>
      </div>
    </section>
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
      signupForm: {
        email: '',
        password: '',
        apiKey: '',
      },
      showLoginForm: true,
      showPasswordReset: false,
      showSuccess: false
    }
  },
  methods: {
    toggleForm() {
      this.showLoginForm = !this.showLoginForm
    },
    togglePasswordReset() {
      this.showPasswordReset = !this.showPasswordReset
    },
    login() {
      this.$store.dispatch('login', {
        email: this.loginForm.email,
        password: this.loginForm.password
      })
    },
    signup() {
      this.$store.dispatch('signup', {
        email: this.signupForm.email,
        password: this.signupForm.password,
        apiKey: this.signupForm.apiKey
      })
    }
  }
}
</script>
