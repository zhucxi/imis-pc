import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import LoginRouter from './login'
import ElementRouter from './element'
import TestRouter from './test'
Vue.use(Router)

export default new Router({
  routes: [
    /*{
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }*/
    LoginRouter,
    ElementRouter,
    TestRouter
  ]
})
