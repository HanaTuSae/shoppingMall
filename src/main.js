// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'normalize.css'
import FastClick from 'fastclick'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import {
  Button, Row, Col, Search, Icon, Swipe, SwipeItem, Lazyload, Tabbar, TabbarItem, Tag, Field, NavBar, Cell, CellGroup, Toast, Tab, Tabs, GoodsAction, GoodsActionBigBtn, GoodsActionMiniBtn, List, PullRefresh, Checkbox, CheckboxGroup, SubmitBar, Stepper, Dialog, AddressList, AddressEdit, Popup, Card, Area } from 'vant'

Vue.config.productionTip = false
FastClick.attach(document.body)
Vue.use(VueAxios, axios)
Vue.use(VueAwesomeSwiper)
Vue.use(Button).use(Row).use(Col).use(Search).use(Icon).use(Swipe).use(SwipeItem).use(Lazyload, {
  // preload: 0.4,
  loading: require('@/assets/images/loading.png'),
  error: require('@/assets/images/error.png')
}).use(Tabbar).use(TabbarItem).use(Tag).use(Field).use(NavBar).use(Cell).use(CellGroup).use(Toast).use(Tab).use(Tabs).use(GoodsAction).use(GoodsActionBigBtn).use(GoodsActionMiniBtn).use(List).use(PullRefresh).use(Checkbox).use(CheckboxGroup).use(SubmitBar).use(Stepper).use(Dialog).use(AddressList).use(AddressEdit).use(Popup).use(Card).use(Area)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
