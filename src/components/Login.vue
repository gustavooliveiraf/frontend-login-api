<template>
  <v-content>
    <br>
    <br>
    <br>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-form @submit.prevent="login()">
          <v-card-text>
            
              <v-text-field v-model="email" prepend-icon="email" name="email" label="E-mail" type="text"></v-text-field>
              <v-text-field v-model="password" prepend-icon="lock" name="password" label="Password" id="password" type="password"></v-text-field>
            
          </v-card-text>
          <v-card-actions>
            <router-link :to="{ name: 'register' }"><v-btn color="primary">Cadastre-se</v-btn></router-link>
            <v-spacer></v-spacer>
            <v-btn type="submit" color="primary">Login</v-btn>
          </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>
  export default {
    data: () => ({
      email: '',
      password: ''
    }),
    created() {
      if (this.$store.getters.isLogged) {
        this.$router.push({ name: 'search-user' })
      }
    },
    methods: {
      async login() {
        try {
          if (this.validate()) {
            var res = (await this.$http.post('user/sign-in', {
              email: this.email,
              password: this.password
            })).data

            const { token, ...user } = res

            this.$store.dispatch('login', {
              token,
              user
            })
            this.$router.push({ name: "search-user" })
          }
        } catch (err) {
          console.log(err.body)
          alert(err.body)
        }
      },
      validate() {
        if (!this.email) return alert('O campo E-mail é obrigatório.')
        else if (!this.password) alert('O campo Senha é obrigatório.')

        return true
      }
    }
  }
</script>