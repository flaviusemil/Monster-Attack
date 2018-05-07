import Vue from 'vue';

const $ = require('jquery');

global.$ = global.jQuery = $;

require('bootstrap/scss/bootstrap.scss');
require('bootstrap');
require('../scss/main.scss');

let jsApp = new Vue({
    el: '#app',
    data: {
    },
    methods: {

    }
});