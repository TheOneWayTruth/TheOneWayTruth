<template>
  <div id="login">
    <PasswordReset
      v-if="showPasswordReset"
      @close="togglePasswordReset()"
    ></PasswordReset>
    <section>
      <div class="col1">
        <h1>SocialDeductive</h1>
        <p>
          Willkommen zu Social SocialDeductive. Hier kann man folgende Spiele
          spielen:
        </p>
        <div>
          <div>Schäfchen</div>
          <div>Spyfall</div>
        </div>
      </div>
      <div :class="{ 'signup-form': !showLoginForm }" class="col2">
        <form v-if="showLoginForm" @submit.prevent>
          <h1>Willkommen zurück</h1>
          <div>
            <label for="email1">Email</label>
            <input
              v-model.trim="loginForm.email"
              type="text"
              placeholder="du@email.de"
              id="email1"
              autocomplete="email"
            />
          </div>
          <div>
            <label for="password1">Password</label>
            <input
              v-model.trim="loginForm.password"
              type="password"
              placeholder="******"
              id="password1"
              autocomplete="current-password"
            />
          </div>
          <button @click="login()" class="btn">Log In</button>
          <div class="extras">
            <a @click="togglePasswordReset()">Password vergessen</a>
            <a @click="toggleForm()">Account erstellen</a>
          </div>
          <div>
            <button class="btn" @click="googleLogin">Google</button>
            <button class="btn" @click="facebookLogin">Facebook</button>
            <button class="btn" @click="gastLogin">Gast</button>
          </div>
        </form>
        <form v-else @submit.prevent>
          <h1>Get Started</h1>
          <div>
            <label for="name">Nutzername</label>
            <input
              v-model.trim="signupForm.name"
              type="text"
              placeholder="Vorname Nachname"
              id="name"
              autocomplete="name"
            />
          </div>
          <div>
            <label for="email2">Email</label>
            <input
              v-model.trim="signupForm.email"
              type="text"
              placeholder="du@email.de"
              id="email2"
              autocomplete="email"
            />
          </div>
          <div>
            <label for="password2">Password</label>
            <input
              v-model.trim="signupForm.password"
              type="password"
              placeholder="min 6 Zeichen"
              id="password2"
              autocomplete="new-password"
            />
          </div>
          <button @click="signup()" class="btn">Anmelden</button>
          <div class="extras">
            <a @click="toggleForm()">Zurück zum Login</a>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  components: {
    PasswordReset: () => import("@/components/PasswordReset"),
  },
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
      signupForm: {
        name: "",
        email: "",
        password: "",
      },
      showLoginForm: true,
      showPasswordReset: false,
    };
  },
  methods: {
    gastLogin() {
      this.$store.dispatch("account/gastLogin");
    },
    googleLogin() {
      this.$store.dispatch("account/googleLogin");
    },
    facebookLogin() {
      this.$store.dispatch("account/facebookLogin");
    },
    toggleForm() {
      this.showLoginForm = !this.showLoginForm;
    },
    togglePasswordReset() {
      this.showPasswordReset = !this.showPasswordReset;
    },
    login() {
      this.$store.dispatch("account/login", {
        email: this.loginForm.email,
        password: this.loginForm.password,
      });
    },
    signup() {
      this.$store.dispatch("account/signup", {
        email: this.signupForm.email,
        password: this.signupForm.password,
        name: this.signupForm.name,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$white: #fff;
$primary: #ad3;
$dark: #555;

#login {
  background: linear-gradient(
    to right,
    $primary 0%,
    $primary 50%,
    $white 50%,
    $white 100%
  );

  @media screen and (max-width: 742px) {
    height: 100vh;
    background: $white;
  }

  .col1,
  .col2 {
    height: 100vh;
    padding-top: 30vh;
    @media screen and (max-width: 742px) {
      height: auto;
      padding-top: 20vh;
    }
  }

  .col1 {
    color: $white;
    @media screen and (max-width: 742px) {
      display: none;
    }

    p {
      max-width: 490px;
      margin-top: 2rem;
      line-height: 1.8;
    }

    a {
      color: $white;
      text-decoration: underline;
    }
  }

  .signup-form {
    padding-top: 20vh;
    @media screen and (max-width: 742px) {
      padding-top: 10vh;
    }
  }

  .col2 {
    h1 {
      margin-bottom: 2rem;
    }

    form {
      max-width: 450px;
      margin: 0 auto;
    }

    .extras {
      float: right;
      text-align: right;

      a {
        display: block;
        margin-bottom: 0.5rem;
      }
    }
    .btn {
      margin: 0.5rem;
    }
    .password-reset {
      h1 {
        margin-bottom: 1rem;
      }

      p {
        margin-bottom: 2rem;
      }
    }
  }
}
</style>

