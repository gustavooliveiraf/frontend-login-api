<template>
  <v-content>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar dark color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field v-model="name" prepend-icon="person" name="login" label="Nome" type="text"></v-text-field>
              <v-text-field v-model="email" prepend-icon="email" name="email" label="E-mail" type="text"></v-text-field>
              <v-text-field v-model="password" prepend-icon="lock" name="password" label="Password" id="password" type="password"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <router-link :to="{ name: 'login' }"><v-btn color="primary">Login</v-btn></router-link>
            <v-spacer></v-spacer>
            <v-btn @click="register()" color="primary">Cadastrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
    <br>
    <br>
    <div>
      <v-toolbar flat color="white">
        <v-toolbar-title>Telefones</v-toolbar-title>
        <v-divider
          class="mx-2"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.ddd" label="DDD"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-text-field v-model="editedItem.numero" label="Número"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="desserts"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.ddd }}</td>
          <td>{{ props.item.numero }}</td>
          <td class="justify-center layout px-0">
            <v-icon
              small
              class="mr-2"
              @click="editItem(props.item)"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteItem(props.item)"
            >
              delete
            </v-icon>
          </td>
        </template>
      </v-data-table>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </div>
  </v-content>
</template>

<script>
  export default {
    data: () => ({
      name: '',
      email: '',
      password: '',
      dialog: false,
      headers: [
        { text: 'DDD', value: 'ddd' },
        { text: 'Número', value: 'numero' },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        ddd: '',
        numero: 0
      },
      defaultItem: {
        ddd: '',
        numero: 0
      },

      url: '',
      img: '',
      selectedFile: ''
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()

      if (this.$store.getters.isLogged) {
        this.$router.push({ name: 'search-user' })
      }
    },

    methods: {
      async register() {
        try {
          console.log(this.email)
          if (this.validate()) {
            var res = (await this.$http.post('user/sign-up', {
              name: this.name,
              email: this.email,
              password: this.password,
              phones: this.desserts
            })).data

            const { token, ...user } = res

            this.$store.dispatch('login', {
              token,
              user
            })
            this.$router.push({ name: "search-user" })
          }
        } catch (err) {
          console.log(err)
          if ((typeof err.body) == 'string') {
            alert(err.body)
          } else {
            if (err.body.details[0]) {
              alert(err.body.details[0].message)
            } else {
              alert(JSON.stringify(err.body))
            }
          }
        }
      },
      validate() {
        if (!this.name) return alert('O campo Nome é obrigatório.')
        else if (!this.email) return alert('O campo E-mail é obrigatório.')
        else if (!this.password) alert('O campo Senha é obrigatório.')

        return true
      },

      initialize () {
        this.desserts = []
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.desserts.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },

      alterarImagem() {
        if(!this.validateImage()) return

        var formData = new FormData();
        formData.append(
          "image",
          this.selectedFile,
          this.selectedFile.name
        );

        this.$http
          .put(`${configClient.host}/userNotActives/users/${this.$store.getters.user.id}/pictures`, formData)
          .then(res => res.json())
          .then(res => {
            if (res) {
              alert("Imagem atualizada.");
              this.$router.go();
            } else {
              alert("Não foi possível atualizar a imagem.");
            }
          })
          .catch(err => {
            alert("Erro. Por favor, contate o suporte.");
            console.log(err);
          });
      },
      onFileChanged(event) {
        this.selectedFile = event.target.files[0];
        this.url = URL.createObjectURL(this.selectedFile);

        var img = new Image();

        img.src = window.URL.createObjectURL(this.selectedFile);
        img.onload = () => {
          var width = img.naturalWidth,
            height = img.naturalHeight;

          window.URL.revokeObjectURL(img.src);
          this.largura = width;
          this.altura = height;
        };
      },
      validateImage() {
        if (!this.selectedFile) {
          alert("Sem alterações feita.");
          return false
        }
        else if (this.altura > 1080 || this.largura > 1080) {
          alert("Imagem excede o limite de 1080.");
          return false;
        }
        else if (this.selectedFile != null && this.selectedFile.size > 1500000) {
          alert("Imagem maior que 1,5 mb.");
          return false;
        }
        else if (this.selectedFile) {
          const ext = this.selectedFile.name.split(".");
          if (!(ext[1] === "png" || ext[1] === "jpg" || ext[1] === "jpeg")) {
            alert("Formatos suportados: png, jpg e jpeg.");

            return false;
          }
        }

        return true
      },
    }
  }
</script>

<style scoped>
.enviarImagem {
  text-align: center;
  background: #1875dd;
  color: #fff;
  width: 100%;
  height: 40px;
  border-radius: 10px;
}

</style>
