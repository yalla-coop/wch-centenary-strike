<template>
  <div>
      <ul >
          <li v-for="d in dat" :key="d.name"><a @click="selectDat(d.name)">{{d.title}}</a></li>
      </ul>
      <div>
          {{selectedDat}}
      </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "InfoPanel",
  data: function () {
    return {
        dat:[],
        selectedDat:[]
    };
  },
  mounted: function () {},
  methods:{
      setData(dat){
          this.dat = dat;
          if(dat.length === 1){
              this.selectedDat = dat[0];
          }
      },
      selectDat(_name){
         const datId = this.dat.filter(d=>d.name === _name)[0].name;
         console.log(datId)
         axios({
            method: "GET",
            url: `https://api.baserow.io/api/database/rows/table/${this.$mainConfig.api.baserow.tables.main}/${datId}/?user_field_names=true`,
            headers: {
                Authorization: `Token ${this.$mainConfig.api.keys.baserow}`
            }
        }).then((resp) => {
            this.selectedDat = resp.data
        })
      }
  }
};
</script>

<style>
</style>