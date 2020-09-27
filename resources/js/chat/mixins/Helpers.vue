
<script>
    const dayjs = require('dayjs');

    export default {
        methods: {
            $dayjs: function (params) {
                return dayjs(params);
            },
            $plural: function (number, names, show_number = false) {
                let cases = [2, 0, 1, 1, 1, 2];
                let name = names[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];

                return show_number ? number + " " + name : name;
            },
            $price_currency: function(price, _currency){
                let currency = this.$store.state.cart.currencies[ _currency || this.$store.state.currency ];
                return currency.sign + ' ' + (price / currency.rate).toFixed(2);
            },
            $price: function (number, currency = true) {
                number = parseInt(number);
                return number.toLocaleString() + (currency ? " ₽" : "");
            },
            $dayWeekNames: function () {
                return {
                    1: "Понедельник",
                    2: "Вторник",
                    3: "Среда",
                    4: "Четверг",
                    5: "Пяница",
                    6: "Суббота",
                    7: "Воскресенье",
                };
            },
            $dayWeekShortNames: function () {
                return [
                    "Пн",
                    "Вт",
                    "Ср",
                    "Чт",
                    "Пт",
                    "Сб",
                    "Вс",
                ];
            }

        }
    }
</script>