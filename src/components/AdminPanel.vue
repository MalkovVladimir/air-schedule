<template>
  <div class="adminPanel__wrap">
    <div class="adminPanel">
      <i
        @click="isPanelOpened = !isPanelOpened"
        class="material-icons expandArrow"
      >
        {{ isPanelOpened ? 'expand_more' : 'expand_less' }}
      </i>
      <div :class="['settingTable__wrap', { maximize: isPanelOpened }]">
        <table class="settingTable">
          <tr
            v-for="(val, key) in settings"
            :key="key"
            class="settingTable__row"
          >
            <td class="settingTable__label">
              {{ description[key] }}
            </td>
            <td>
              <input
                type="text"
                :name="val"
                v-model="settings[key]"
                class="settingTable__textbox"
              >
            </td>
          </tr>
          <tr class="settingTable__row">
            <td></td>
            <td>
              <input
                type="button"
                value="Обновить"
                class="settingTable__button"
                @click="raiseUpdateEvent()"
              >
            </td>
          </tr>
        </table>
      </div>
      <div class="flightDirection">
        <h2
          @click="raiseUpdateEvent(true)"
          :class="['flightDirection__title', { _chosen: isArrive }]"
        >
          Прибытие
        </h2>
        <h2
          @click="raiseUpdateEvent(false)"
          :class="['flightDirection__title', { _chosen: !isArrive }]"
        >
          Отправление
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPanel',
  data () {
    let currentDate = new Date()

    return {
      isPanelOpened: true,
      isArrive: true,
      settings: {
        arrivalAirportCode: 'SVO',
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate(),
        hourOfDay: currentDate.getHours()
      },
      description: {
        arrivalAirportCode: 'Код аэропорта',
        year: 'Год (четырехзначный)',
        month: 'Месяц (1-12)',
        day: 'День',
        hourOfDay: 'Час дня (0-23)'
      }
    }
  },
  methods: {
    raiseUpdateEvent: function (isArrive) {
      if (isArrive != null) { this.isArrive = isArrive }

      var isSettingValid = true
      for (var setting in this.settings) {
        if (setting === '') { isSettingValid = false }
        break
      }

      this.$emit('settingsUpdate', {
        settings: isSettingValid ? this.settings : null,
        isArrive: this.isArrive
      })
    }
  }
}
</script>

<style lang="less" scoped>
.expandArrow {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.adminPanel__wrap {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.adminPanel:extend(.adminPanel__wrap) {
  width: calc(100% - 4vw + 1px);
  background-color: #8EC5FC;
  background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%);
  padding-left: 2vw;
  padding-right: 2vw;
}
@media screen and (max-width: 800px) {
  .adminPanel {
    width: 90vw;
  }
}
.settingTable__wrap {
  width: 100%;
  height: 0px;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}
.maximize {
  height: 15vw;
}
@media screen and (max-width: 1600px) {
  .maximize {
    height: 100%;
  }
}
.settingTable {
  width: 100%;
  border-collapse: collapse;
}
.settingTable__row {
  padding: 5%;
}
.settingTable__label{
  text-align: start;
}
.settingTable__button {
  width: 20%;
  border-width: 0px;
  padding: 0.5vw;
  background-color: white
}
.settingTable__textbox:extend(.settingTable__button) {
  width: 75%;
  margin-bottom: 0.5vw
}
.flightDirection {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.flightDirection__title{
  transition: opacity 0.2s ease-in-out;
  cursor: pointer;
  opacity: 0.6;
}
._chosen {
  opacity: 1;
}
</style>
