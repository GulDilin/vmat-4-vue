import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/Main'
import Interpolation from '../components/Interpolation'
import DifferentialEquation from '../components/DifferentialEquation'


Vue.use(Router)

const routes = [
{
    path: '/main',
    component: Main,
    name: 'main',
    meta: { title: 'Main', requiresAuth: false },
    children: [
    {
        path: 'interpolation/',
        components: {
            viewContent: Interpolation
        },
        meta: { title: 'Function Interpolation' },
    },{
        path: 'diff_eq/',
        components: {
            viewContent: DifferentialEquation
        },
        meta: { title: 'Function Interpolation' },
    }]
},{
    path: '/',
    redirect: 'main/interpolation',
}];



const router = new Router({
    routes: routes
});

router.beforeEach((to, from, next) => {
    next()
});

router.afterEach((to) => {
    document.title = to.meta.title;
});

export default router