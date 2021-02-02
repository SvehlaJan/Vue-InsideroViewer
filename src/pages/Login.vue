<template>
  <div>
    <b-container v-if="showLoginForm">
<!--      <PasswordReset v-if="showPasswordReset" @close="togglePasswordReset()"></PasswordReset>-->
      <b-modal id="modal-location" size="lg" title="Reset password" @ok="handleResetPassword">
        <form ref="form" @submit.stop.prevent="handleResetPassword">
          <b-form-input
              id="input-password-reset"
              type="email"
              placeholder="Your email"
              v-model="passwordResetEmail"
              required>
          </b-form-input>
        </form>
      </b-modal>

      <h1 class="mt-4">Welcome</h1>

      <EmailCredentialsForm
          @submitForm="signInWithEmailAndPassword"
          :error-message="errorMessage"
          :show-error="showError"
          :show-success="showSuccess"
          submit-button-label="Login"/>

      <div class="mt-2">
        <b-link v-b-modal="'modal-location'">Forgot Password</b-link>
      </div>

      <h3 class="mt-5">New here?</h3>

      <b-container class="p-0 mt-2">
        <b-link class="mr-2" @click="toggleForm()">Create an Account</b-link>
        /
        <b-link class="ml-2" @click="signInAnonymously()">Sign in as guest</b-link>
      </b-container>
    </b-container>

    <b-container v-else>
      <h1 class="mt-4">Get Started</h1>

      <EmailCredentialsForm
          @submitForm="signUpWithEmailAndPassword"
          :error-message="errorMessage"
          :show-error="showError"
          :show-success="showSuccess"
          submit-button-label="Register"/>

      <div class="mt-2">
        <b-link @click="toggleForm()">Back to Log In</b-link>
      </div>
    </b-container>
  </div>
</template>

<script>
import EmailCredentialsForm from "@/components/EmailCredentialsForm";
import {auth} from "@/firebase";

export default {
  components: {
    EmailCredentialsForm,
  },
  data() {
    return {
      showLoginForm: true,
      passwordResetEmail: '',
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
    async signInWithEmailAndPassword(formData) {
      this.showError = false
      try {
        await this.$store.dispatch('signInWithEmailAndPassword', {
          email: formData.email,
          password: formData.password
        })
      } catch (error) {
        if (error.code) {
          this.errorMessage = error.message
          this.showError = true
        } else {
          console.error("Login error: ", error)
        }
      }
    },
    async signUpWithEmailAndPassword(formData) {
      this.showError = false
      try {
        await this.$store.dispatch('signUpWithEmailAndPassword', {
          email: formData.email,
          password: formData.password,
        })
      } catch (error) {
        if (error.code) {
          this.errorMessage = error.message
          this.showError = true
        } else {
          console.error("Signup error: ", error)
        }
      }
    },
    async signInAnonymously() {
      this.showError = false
      try {
        await this.$store.dispatch('signInAnonymously')
      } catch (error) {
        if (error.code) {
          this.errorMessage = error.message
          this.showError = true
        } else {
          console.error("Anonymous signup error: ", error)
        }
      }
    },
    async handleResetPassword() {
      this.errorMessage = '';

      try {
        await auth.sendPasswordResetEmail(this.email);
        this.showSuccess = true;
      } catch (err) {
        this.showError = true;
        this.errorMessage = err.message;
      }
    }
  }
}
</script>
