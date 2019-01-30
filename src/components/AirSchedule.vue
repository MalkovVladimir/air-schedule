<template>
    <div v-if="schedule">
        {{ schedule }}
    </div>
</template>

<script>
export default {
  name: "AirSchedule",
  data() {
    return {
      schedule: null,
      IsDataLoaded: false
    };
  },
  created: function() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/json");

    fetch(
      
      {
        method: "GET",
        headers: myHeaders,
        mode: "cors",
        cache: "default"
      }
    ).then(resp => {
      this.schedule = resp.json();
    });
  }
};
</script>

<style>
</style>
