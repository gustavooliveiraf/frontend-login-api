<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title class="headline text-uppercase">
        <span>Challenge Concrete</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        @click="loginLogoutFunc()"
      >
        <span class="mr-2">{{ loginLogoutComputed }}</span>
      </v-btn>
      <v-btn
        flat
        href="http://54.173.27.60:8000/status"
        target="_blank"
      >
        <span class="mr-2">Acessar API diretamente</span>
      </v-btn>
    </v-toolbar><br>

    <router-view/>
  </v-app>
</template>

<script>
import Login from './components/Login'

export default {
  name: 'App',
  created() {
    if (!this.$store.getters.isLogged) {
      this.loginLogout = 'Login'
      this.$router.push({ name: 'login' })
    } else {
      this.loginLogout = 'Logout'
    }
  },
  methods: {
    loginLogoutFunc() {
      if (this.$store.getters.isLogged) {
        this.$store.dispatch('logout')
        this.$router.push({ name: 'login' })
        this.$router.go()
      } else {
        this.$router.push({ name: 'login' })
      }
    }
  },
  computed: {
    loginLogoutComputed() {
      if (this.$store.getters.isLogged) {
        return 'Logout'
      } else {
        return 'Login'
      }
    }
  }
}
</script>
