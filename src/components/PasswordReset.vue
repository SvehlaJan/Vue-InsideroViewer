<template>
  <b-modal title="Reset Password">
    <div class="close" @click="$emit('close')">close</div>
    <div v-if="!showSuccess">
      <p>Enter your email to reset your password</p>
      <form @submit.prevent>
        <input v-model.trim="email" type="email" placeholder="you@email.com" />
      </form>
      <p v-if="errorMsg !== ''" class="error">{{ errorMsg }}</p>
      <button class="button" @click="resetPassword()">Reset</button>
    </div>
    <p v-else>Success! Check your email for a reset link.</p>
  </b-modal>
</template>

<script>
import { auth } from "@/firebase";

export default {
  data() {
    return {
      email: "",
      showSuccess: false,
      errorMsg: "",
    };
  },
  methods: {
    async resetPassword() {
      this.errorMsg = "";

      try {
        await auth.sendPasswordResetEmail(this.email);
        this.showSuccess = true;
      } catch (err) {
        this.errorMsg = err.message;
      }
    },
  },
};
</script>
