<template>
   <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
       <md-card class="md-layout-item md-size-100 md-small-size-100">
          <md-card-header>
            <div class="md-title">Login</div>
          </md-card-header>
          <md-card-content>
            <div class="md-layout md-gutter">
                <div class="md-layout-item md-small-size-100">
                     <md-field :class="getValidationClass('email')">
                      <label for="email">Email</label>
                      <md-input type="email" name="email" id="email" autocomplete="email" v-model="login.email" :disabled="pending" />
                      <span class="md-error" v-if="!$v.login.email.required">The email is required</span>
                      <span class="md-error" v-else-if="!$v.login.email.email">Invalid email</span>
                    </md-field>
                  </div>

                  <div class="md-layout-item md-small-size-100">
                    <md-field :class="getValidationClass('password')">
                      <label for="password">Password</label>
                      <md-input name="password" id="password" autocomplete="password" v-model="login.password" :disabled="pending" />
                      <span class="md-error" v-if="!$v.login.password.required">The password is required</span>
                      <span class="md-error" v-else-if="!$v.login.password.minlength">Invalid password</span>
                    </md-field>
                  </div>
                </div>
          </md-card-content>

          <md-progress-bar md-mode="indeterminate" v-if="pending" />
            <md-card-actions>
              <md-button type="submit" class="md-primary" :disabled="pending">login</md-button>
          </md-card-actions>

          <md-snackbar :md-active="showNotif">{{notificationText}}</md-snackbar>

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
  name: "Login",
  mixins: [validationMixin],
  data: () => ({
    login: {
      email: null,
      password: null
    }
  }),
  validations: {
    login: {
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
  computed: {
    ...mapGetters({
      isLoggedIn: "isLoggedIn",
      showNotif: "showNotif",
      notificationText: "notificationText",
      pending: "pending"
    })
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.login[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    clearlogin() {
      this.$v.$reset();
      this.login.email = null;
      this.login.password = null;
    },
    signin() {
      this.$store.dispatch("signin", this.login);
    },
    validateUser() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.signin();
      }
    }
  }
};
</script>

