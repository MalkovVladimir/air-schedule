<template>
  <div class="timetable-wrap">
    <div class="_shadow">
      <admin-panel
        @settingsUpdate="(data) => $emit('settingsUpdate', data)"
      />
      <table
        v-if="flights.length > 0"
        class="timetable"
      >
        <thead class="timetable__thead">
          <tr class="timetable__row">
            <th class="timetable__cell">Номер рейса</th>
            <th class="timetable__cell">Город</th>
            <th class="timetable__cell">Терминал</th>
            <th class="timetable__cell">Время прибытия</th>
          </tr>
        </thead>
        <tbody class="timetable__tbody">
          <tr
            v-for="flight in flights"
            :key="flight.carrierFsCode + flight.flightNumber"
            class="timetable__row"
          >
            <td class="timetable__cell">{{ flight.flightNumber }}</td>
            <td class="timetable__cell">
              <div>
                {{ airports[flight.departureAirportFsCode].city }}
              </div>
              <div>{{ airports[flight.departureAirportFsCode].countryName }}</div>
            </td>
            <td class="timetable__cell">
              {{ flight.airportResources | safeGettingTerminal}}
            </td>
            <td class="timetable__cell">
              {{ flight.arrivalDate.dateLocal | wrapAsNotification }}
            </td>
          </tr>
        </tbody>
      </table>
      <h2 v-else class="_error">
        Рейсов нет
      </h2>
    </div>
  </div>
</template>

<script>
import AdminPanel from './AdminPanel.vue'

export default {
  name: 'AirSchedule',
  components: {
    AdminPanel
  },
  filters: {
    wrapAsNotification: function (rawDateStr) {
      var date = new Date(rawDateStr)
      var minutes = date.getMinutes()
      minutes = minutes > 9 ? minutes : '0' + minutes

      return `${date.getHours()}:${minutes}`
    },
    safeGettingTerminal: function (airportResources) {
      if (airportResources && airportResources.arrivalTerminal) { return airportResources.arrivalTerminal } else { return 'Информации нет' }
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
}
</script>

<style lang="less" scoped>
.timetable-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
._shadow {
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
._shadow:hover {
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
}
.timetable {
  width: 50vw;
  border-collapse: collapse;
  background-color: rgba(255, 255, 255, 0.9)
}
@media screen and (max-width: 800px) {
  .timetable {
    width: 94vw;
  }
}
.timetable__thead {
  width: calc(
    100% - 1em
  );
}
.timetable__tbody {
  max-height: 20vw;
  display: block;
  overflow: auto;
}
@media screen and (max-height: 500px) {
  .timetable__tbody {
    max-height: 90%;
  }
}
.timetable__thead,
.timetable__tbody .timetable__row {
  width: 100%;
  display: table;
  table-layout: fixed;
}
.timetable__row {
  border-bottom: 1px solid lightgray;
  &:hover {
    background-color: whitesmoke;
  }
}
.timetable__cell {
  padding: 2vw;
  text-align: center;
  vertical-align: middle;
}
._error {
  width: 50vw;
  padding: 2vw;
  background-color: lightcoral;
  border: 1px solid lightgray;
}
</style>
