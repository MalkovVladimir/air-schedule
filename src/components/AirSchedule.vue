<template>
  <div class="timetable-wrap">
    <table class="timetable">
      <thead>
        <tr>
          <th class="timetable__cell">Номер рейса</th>
          <th class="timetable__cell">Город</th>
          <!--<th class="timetable__cell">arrivalAirport</th>-->
          <th class="timetable__cell">Терминал</th>
          <th class="timetable__cell">Время прибытия</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="flight in flights"
          :key="flight.carrierFsCode + flight.flightNumber"
          class="timetable__row"
        >
          <td class="timetable__cell">
            {{ flight.flightNumber }}
          </td>
          <td class="timetable__cell">
            <div>
              {{ airports[flight.departureAirportFsCode].city }}
            </div>
            <div>
              {{ airports[flight.departureAirportFsCode].countryName }}
            </div>
          </td>
          <!--<td class="timetable__cell">
            <div>
              {{ airports[flight.arrivalAirportFsCode].city }}
            </div>
            <div>
              {{ airports[flight.arrivalAirportFsCode].countryName }}
            </div>
          </td>-->
          <td class="timetable__cell">
            {{ flight.arrivalTerminal }}
          </td>
          <td class="timetable__cell">
            {{ flight.arrivalTime | wrapAsNotification }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "AirSchedule",
  filters: {
    wrapAsNotification: function(rawDateStr) {
      var date = new Date(rawDateStr);
      var minutes = date.getMinutes();
      minutes = minutes > 9 ? minutes : '0' + minutes;

      if (date > Date.now())
        return `Ожидается в ${date.getHours()}:${minutes}`
      else
        return `Совершил посадку в ${date.getHours()}:${minutes}`
    }
  },
  props: {
    flights: {
      type: Array,
      required: true
    },
    airports: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="less" scoped>
.timetable-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}
.timetable {
  border-collapse: collapse;
  box-shadow: 0 2px 4px 0 rgba(134, 121, 71, 0.45);
}
.timetable__row {
  border-top: 1px solid lightgray;

  &:hover {
    background-color: whitesmoke;
  }
}
.timetable__cell {
  padding: 1rem;
}
</style>