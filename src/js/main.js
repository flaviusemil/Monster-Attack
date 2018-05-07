import Vue from 'vue';

const $ = require('jquery');

global.$ = global.jQuery = $;

require('bootstrap/scss/bootstrap.scss');
require('bootstrap');
require('../scss/main.scss');

/*
 * Constants to control the strength and the heal amount.
 */
const YOUR_MAX_HP = 100;
const MONSTER_MAX_HP = 100;
const YOUR_ATTACK = [3, 10];
const MONSTER_ATTACK = [5, 12];
const YOUR_SPECIAL_ATTACK = [10, 20];
const MONSTER_SPECIAL_ATTACK = [5, 12];
const YOUR_HEAL = 10;
const MONSTER_HEAL = [5, 12];
const DISABLE_SYSTEM_LOGS = false;

let jsApp = new Vue({
    el: '#app',
    data: {
        yourHealth: -1,
        monsterHealth: -1,
        turn: -1,
        actions: [],
        isGameRunning: false,
        PlayerType: {
            SYSTEM: 0,
            YOU: 1,
            MONSTER: 2,
        },
        ActionType: {
            ATTACK: 0,
            SPECIAL_ATTACK: 1,
            HEAL: 2
        }
    },
    methods: {

        startNewGame: function () {
            this.actions = [];
            this.yourHealth = 100;
            this.monsterHealth = 100;
            this.isGameRunning = true;
            this.log(this.PlayerType.SYSTEM, "System: The game has started!");
        },

        giveUp: function () {
            this.isGameRunning = false;
            this.log(this.PlayerType.SYSTEM, "System: You gave up...");
            this.gameOver(true);
        },

        attack: function (type) {

            let dmgAmount;

            if (type === this.PlayerType.YOU) {
                dmgAmount = this.generateRandomNumber(YOUR_ATTACK[0], YOUR_ATTACK[1]);

                if (this.monsterHealth > 0)
                    this.monsterHealth -= dmgAmount;

                this.log(this.PlayerType.YOU, this.composeMessage(this.PlayerType.YOU, this.ActionType.ATTACK, dmgAmount));

                if (parseInt(this.monsterHealth) <= 0)
                    return this.gameOver();

                this.attack(this.PlayerType.MONSTER)
            } else if (type === this.PlayerType.MONSTER) {
                dmgAmount = this.generateRandomNumber(MONSTER_ATTACK[0], MONSTER_ATTACK[1]);

                if (this.yourHealth > 0)
                    this.yourHealth -= dmgAmount;

                this.log(this.PlayerType.MONSTER, this.composeMessage(this.PlayerType.MONSTER, this.ActionType.ATTACK, dmgAmount));

                if (parseInt(this.yourHealth) <= 0)
                    this.gameOver();
            }
        },

        castSpecialAttack: function (type) {

            let dmgAmount;

            if (type === this.PlayerType.YOU) {
                dmgAmount = this.generateRandomNumber(YOUR_SPECIAL_ATTACK[0], YOUR_SPECIAL_ATTACK[1]);

                if (this.monsterHealth > 0)
                    this.monsterHealth -= dmgAmount;

                this.log(this.PlayerType.YOU, this.composeMessage(this.PlayerType.YOU, this.ActionType.SPECIAL_ATTACK, dmgAmount));

                if (parseInt(this.monsterHealth) <= 0)
                    return this.gameOver();
                
                this.castSpecialAttack(this.PlayerType.MONSTER);
            } else if (type === this.PlayerType.MONSTER) {
                dmgAmount = this.generateRandomNumber(MONSTER_SPECIAL_ATTACK[0], MONSTER_SPECIAL_ATTACK[1]);

                if (this.yourHealth > 0)
                    this.yourHealth -= dmgAmount;

                this.log(this.PlayerType.MONSTER, this.composeMessage(this.PlayerType.MONSTER, this.ActionType.SPECIAL_ATTACK, dmgAmount));

                if (parseInt(this.yourHealth) <= 0)
                    this.gameOver();
            }
        },

        castHeal: function (type) {
            let healAmount;

            if (type === this.PlayerType.YOU) {

                healAmount = YOUR_HEAL;

                if (this.yourHealth + healAmount >= YOUR_MAX_HP) {
                    healAmount = healAmount - (this.yourHealth + healAmount) % YOUR_MAX_HP;
                }

                this.yourHealth += healAmount;

                this.log(this.PlayerType.YOU, this.composeMessage(this.PlayerType.YOU, this.ActionType.HEAL, healAmount));

                if (this.yourHealth === YOUR_MAX_HP) {
                    this.log(this.PlayerType.SYSTEM, "System: You healed and now you have full HP!");
                }

                if (this.yourHealth <= 0)
                    this.gameOver();

                this.castHeal(this.PlayerType.MONSTER);
            } else if (type === this.PlayerType.MONSTER) {
                healAmount = this.generateRandomNumber(MONSTER_HEAL[0], MONSTER_HEAL[1]);

                if (this.monsterHealth + healAmount >= MONSTER_MAX_HP) {
                    healAmount = healAmount - (this.monsterHealth + healAmount) % MONSTER_MAX_HP;
                }

                this.monsterHealth += healAmount;

                this.log(this.PlayerType.MONSTER, this.composeMessage(this.PlayerType.MONSTER, this.ActionType.HEAL, healAmount));

                if (this.monsterHealth === MONSTER_MAX_HP) {
                    this.log(this.PlayerType.SYSTEM, "System: The monster healed and now he has full HP!");
                }
            }
        },

        log: function (sender, message) {

            if (sender === this.PlayerType.SYSTEM && DISABLE_SYSTEM_LOGS)
                return;

            this.actions.unshift({
                sender: sender,
                message: message
            });
        },

        gameOver: function (gaveUp = false) {
            this.isGameRunning = false;

            if (gaveUp)
                return this.youLost();

            if (this.yourHealth > this.monsterHealth)
                return this.youWon();
            else return this.youLost();
        },

        youWon: function () {
            if (!this.isGameRunning) {
                this.log(this.PlayerType.SYSTEM, "System: You won!");

                if (confirm("You beat the monster, wanna try your luck with another one?"))
                    this.startNewGame()
            }
        },

        youLost: function () {
            if (!this.isGameRunning) {
                this.log(this.PlayerType.SYSTEM, "System: You lost!");

                if (confirm("You lost... I guess the monster was too strong for you, wanna try again?"))
                    this.startNewGame()
            }
        },

        composeMessage: function (sender, action, amount) {
            let message;

            switch (action) {
                case this.ActionType.ATTACK:
                    if (sender === this.PlayerType.YOU)
                        message = "The monster attacked you with " + amount + " damage.";
                    else
                        message = "You attacked the monster with " + amount + " damage.";
                    break;
                case this.ActionType.SPECIAL_ATTACK:
                    if (sender === this.PlayerType.YOU)
                        message = "You used an special attack on the monster and you inflicted him " + amount + " damage.";
                    else
                        message = "The monster used a special attack on you and he inflicted you " + amount + " damage.";
                    break;
                case  this.ActionType.HEAL:
                    if (sender === this.PlayerType.YOU)
                        message = "You healed with " + amount + " HP.";
                    else
                        message = "The monster healed with " + amount + " HP.";
                    break;
            }

            return message;
        },

        generateRandomNumber: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
});