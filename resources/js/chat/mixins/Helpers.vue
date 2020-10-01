<script>
    const dayjs = require('dayjs');
// let DummyBlob = new Blob(['test text'], {type : 'text/plain'});
    export default {
        methods: {
            $imgFromBlob: function(imageBlob) {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext('2d');

                // Create an image to render the blob on the canvas
                var img = new Image();

                // Once the image loads, render the img on the canvas
                img.onload = function(){
                    // Update dimensions of the canvas with the dimensions of the image
                    canvas.width = this.width;
                    canvas.height = this.height;

                    // Draw the image
                    ctx.drawImage(img, 0, 0);
                };

                // Crossbrowser support for URL
                var URLObj = window.URL || window.webkitURL;

                // Creates a DOMString containing a URL representing the object given in the parameter
                // namely the original Blob
                img.src = URLObj.createObjectURL(imageBlob);

                return img;
            },
            $blobToBase64: function(blob, callback) {
                var reader = new FileReader();
                reader.onload = function() {
                    var dataUrl = reader.result;
                    // var base64 = dataUrl.split(',')[1];
                    var base64 = dataUrl;
                    callback(base64);
                };
                reader.readAsDataURL(blob);
            },
            $dayjs: function (params) {
                return dayjs(params);
            },
            $plural: function (number, names, show_number = false) {
                let cases = [2, 0, 1, 1, 1, 2];
                let name = names[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];

                return show_number ? number + " " + name : name;
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