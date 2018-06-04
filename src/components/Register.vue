<template>
   <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
       <md-card class="md-layout-item md-size-100 md-small-size-100">
          <md-card-header>
            <div class="md-title">Register</div>
          </md-card-header>
          <md-card-content>
            <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                     <md-field :class="getValidationClass('email')">
                      <label for="email">Email</label>
                      <md-input type="email" name="email" id="email" autocomplete="email" v-model="signup.email" :disabled="sending" />
                      <span class="md-error" v-if="!$v.signup.email.required">The email is required</span>
                      <span class="md-error" v-else-if="!$v.signup.email.email">Invalid email</span>
                    </md-field>
                  </div>

                  <div class="md-layout-item md-small-size-100">
                    <md-field :class="getValidationClass('password')">
                      <label for="password">Password</label>
                      <md-input name="password" id="password" autocomplete="password" v-model="signup.password" :disabled="sending" />
                      <span class="md-error" v-if="!$v.signup.password.required">The password is required</span>
                      <span class="md-error" v-else-if="!$v.signup.password.minlength">Invalid password</span>
                    </md-field>
                  </div>
                </div>
          </md-card-content>

          <md-progress-bar md-mode="indeterminate" v-if="sending" />
            <md-card-actions>
              <md-button type="submit" class="md-primary" :disabled="sending">Signup</md-button>
          </md-card-actions>
          <md-snackbar :md-active.sync="userSaved">success!</md-snackbar>
        </md-card>
    </form>
  </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import { validationMixin } from "vuelidate";
import {
  required,
  email,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

export default {
  name: "Register",
  mixins: [validationMixin],
  data: () => ({
    signup: {
      email: null,
      password: null
    },
    userSaved: false,
    sending: false,
    lastUser: null
  }),
  validations: {
    signup: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(3)
      }
    }
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.signup[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearsignup() {
      this.$v.$reset();
      this.signup.email = null;
      this.signup.password = null;
    },
    signupUser() {
      this.$store.dispatch("signup", this.signup);
    },
    validateUser() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.signupUser();
      }
    }
  }
};
</script>

