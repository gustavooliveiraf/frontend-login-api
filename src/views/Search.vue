<template>
<v-content>
  <v-layout align-center justify-center>
  <form @submit.prevent="">
    <div class="input-field col s6 center-align">

      <div>
        <img width="100px" :src="this.url" class="circle image-size image-border">
      </div>

      <input
        type="file"
        style="display: none"
        ref="fileInput"
        @change="onFileChanged"
        id="customFileLang"
      >

      <v-btn :loading="loadingImage" @click="$refs.fileInput.click()" class="primary">
        {{ alreadyImage }}
      </v-btn><br>
      <br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <v-btn v-if="this.selectedFile" class="primary" :loading="loadingOk" @click="alterarImagem()" type="button">Ok</v-btn>
    </div>
  </form>

  <v-form v-model="valid"><br>
    <v-container>
      <v-layout>
        <v-flex
          xs12
          md4
        >
          <v-text-field
            v-model="user.name"
            label="Nome"
          ></v-text-field>
        </v-flex>

        <v-flex
          xs12
          md4
        >
          <v-text-field
            v-model="user.email"
            label="E-mail"
          ></v-text-field>
        </v-flex>

        <v-flex
          xs12
          md4
        >
          <v-text-field
            v-model="user.guid"
            label="GUID"
          ></v-text-field>
        </v-flex>

        <v-flex
          xs12
          md4
        >
          <v-text-field
            v-model="user.createdAt"
            label="Data de criação"
          ></v-text-field>
        </v-flex>

        <v-flex
          xs12
          md4
        >
          <v-text-field
            v-model="user.updatedAt"
            label="Data atualização"
          ></v-text-field>
        </v-flex>

        <v-flex
          xs12
          md4
        >
          <v-text-field
            v-model="user.lastLogin"
            label="Último login"
          ></v-text-field>
        </v-flex>
      </v-layout>
    </v-container>

    <v-data-table
      :headers="headers"
      :items="desserts"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td>{{ props.item.ddd }}</td>
        <td>{{ props.item.numero }}</td>
      </template>
    </v-data-table>
  </v-form>
  </v-layout>
</v-content>
</template>

<script>
  export default {
    data() {
      return {
        valid: false,
        user: this.$store.getters.user,
        headers: [
          { text: 'DDD', value: 'ddd' },
          { text: 'Número', value: 'numero' },
        ],
        desserts: [],
        url: '',
        selectedFile: '',
        alreadyImage: ' imagem',
        loadingOk: false,
        loadingImage: true
      }
    },
    created() {
      this.desserts = this.user.phones
      this.loadImage()
    },
    methods: {
      async loadImage() {
        const result = (await this.$http.get('picture/'+this.user.guid)).data
        if (result) {
          this.alreadyImage = 'atualizar imagem'
          this.url = result
        } else {
          this.alreadyImage = 'Upload imagem'
        }

        this.loadingImage = false
      },
      async alterarImagem() {
        if(!this.validateImage()) return
        this.loadingOk = true

        var formData = new FormData();
        formData.append(
          "image",
          this.selectedFile,
          this.selectedFile.name
        );

        try {
          var result = (await this.$http.post('picture/'+this.user.guid, formData)).data

          if (result) {
            alert("Imagem atualizada");
            this.$router.go();
          } else {
            alert("Imagem não atualizada");
          }
        } catch (err) {
          alert("Erro. Por favor, contate o suporte.");
          console.log(err);
        }
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
.enviarImagem2 {
  text-align: center;
  background: #1875dd;
  color: #fff;
  width: 80%;
  height: 40px;
  border-radius: 10px;
}
</style>
