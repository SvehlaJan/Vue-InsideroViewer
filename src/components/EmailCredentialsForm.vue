<template>
  <b-form @submit.prevent="submitForm()">
    <b-alert v-model="intShowSuccess" variant="success" show>Success</b-alert>
    <b-alert v-model="intShowError" variant="danger" show>{{
      errorMessage
    }}</b-alert>

    <b-form-group
      id="input-group-1"
      label="Email address:"
      label-for="email1"
      class="mt-4"
    >
      <b-form-input
        id="email1"
        v-model="formData.email"
        type="email"
        required
        placeholder="your@email.com"
      >
      </b-form-input>
    </b-form-group>

    <b-form-group id="input-group-2" label="Password:" label-for="password1">
      <b-form-input
        id="password1"
        v-model="formData.password"
        type="password"
        required
        placeholder="******"
      >
      </b-form-input>
    </b-form-group>
    <b-container>
      <b-row>
        <b-button type="submit" variant="primary">{{
          submitButtonLabel
        }}</b-button>
      </b-row>
    </b-container>
  </b-form>
</template>

<script>
export default {
  props: {
    showSuccess: Boolean,
    showError: Boolean,
    errorMessage: String,
    submitButtonLabel: String,
  },
  data() {
    return {
      formData: {
        email: "",
        password: "",
      },
      intShowSuccess: false,
      intShowError: false,
    };
  },
  watch: {
    showSuccess: async function(newValue, oldValue) {
      this.intShowSuccess = newValue;
    },
    showError: async function(newValue, oldValue) {
      this.intShowError = newValue;
    },
  },
  methods: {
    submitForm() {
      let result = new Promise(resolve =>
        this.$emit("submitForm", this.formData, resolve)
      );
      result.then(value => console.log(value));
      return result;
    },
  },
};
</script>
