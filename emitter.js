'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let subscriptions = [];
    const parseEvent = event => {
        const events = [];
        let sumEvent = '';
        event.split('.').forEach(item => {
            sumEvent = sumEvent ? `${sumEvent}.${item}` : item;
            events.push(sumEvent);
        });

        return events.reverse();
    };

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on(event, context, handler) {
            if (!event) {
                return this;
            }
            handler = handler.bind(context);
            const newSubscribe = { context, handler };
            subscriptions.push({ event, ...newSubscribe });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off(event, context) {
            subscriptions = subscriptions.filter(subscription => {
                return !((event === subscription.event ||
                    subscription.event.startsWith(`${event}.`)) &&
                    subscription.context === context);
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit(event) {
            const events = parseEvent(event);
            events.forEach(ev => {
                subscriptions.forEach(sub => sub.event === ev && sub.handler());
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            const handlerBind = (() => {
                let count = 0;

                return () => {
                    if (times <= 0 || count < times) {
                        handler.call(context);
                        count++;
                    }
                };
            })();

            return this.on(event, context, handlerBind);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            const handlerBind = (() => {
                let count = 0;

                return () => {
                    if (frequency <= 0 || count++ % frequency === 0) {
                        handler.call(context);
                    }
                };
            })();

            return this.on(event, context, handlerBind);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
