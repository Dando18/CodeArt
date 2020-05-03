let canva = null;
let ctx = null;

let color_functions = {};
let glob = {};


$(() => {

    canva = document.getElementById('main-img');
    ctx = canva.getContext('2d');

    color_functions.red = (i, j) => { return 255; };
    color_functions.green = (i, j) => { return 255; };
    color_functions.blue = (i, j) => { return 255; };
    color_functions.alpha = (i, j) => { return 255; };


    $('#color-btn').on('click', renderImage);

    $('textarea').attr('cols', '10');
    $(document).delegate('textarea', 'keydown', function (e) {
        /* from -- https://stackoverflow.com/a/6637396/3769237 */
        let keyCode = e.keyCode || e.which;

        if (keyCode == 9) {
            e.preventDefault();

            let start = this.selectionStart;
            let end = this.selectionEnd;

            $(this).val(
                $(this).val().substring(0, start) +
                '  ' +
                $(this).val().substring(end)
            );

            this.selectionStart = start + 2;
            this.selectionEnd = start + 2;
        }
    });
    $('textarea').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    setPreset('Rainbow');

    /* fill in presets in select element */
    for (let preset of PRESETS) {
        $('#presets').append(
            $('<option></option>')
                .attr('value', preset.name)
                .text(preset.name)
        );
    }
    $('#presets').on('change', function () { setPreset(this.value); });
    $('#presets').val('Rainbow');

    $('#width-input').val(canva.width);
    $('#height-input').val(canva.height);
    $('#resize-btn').on('click', updateDimensions);


    setupLoadAndSave();

});

function get(color, i, j) {
    let val = {};
    try {
        val.value = color_functions[color](i, j, canva.width, canva.height, glob,
            color_functions.red, color_functions.green, color_functions.blue, color_functions.alpha);
    } catch (error) {
        val.error = `<strong>Error</strong> computing channel '${color}' at pixel (${i}, ${j}).<br/>\n` +
            `<strong>${error.name}</strong>:  ${error.message}`;
    }
    return val;
}

function renderImage(updateCode = true) {
    notice('', 'clear');

    if (updateCode) {
        updateFunctions();
    }

    let img_data = ctx.getImageData(0, 0, canva.width, canva.height);

    let clamp = (x, def = 255) => {
        if (x === null) return def;
        else if (Number.isNaN(x)) return def;
        else {
            x = Math.floor(x);
            return (x < 0) ? 0 : (x > 255) ? 255 : x
        }
    }


    let should_stop = false;
    for (let i = 0; i < canva.height; i++) {
        for (let j = 0; j < canva.width; j++) {

            ['red', 'green', 'blue', 'alpha'].forEach((color, offset) => {

                val = get(color, i, j);

                if (val.error) {
                    notice(val.error, 'error');
                    should_stop = true;
                    return;
                }

                img_data.data[4 * (i * canva.width + j) + offset] = clamp(val.value);
            });

            if (should_stop) break;
        }
        if (should_stop) break;

    };

    ctx.putImageData(img_data, 0, 0);
}

function updateFunctions() {

    ['red', 'green', 'blue', 'alpha'].forEach(color => {

        let text = $('#' + color + '-textarea').val();

        try {
            color_functions[color] = Function('i', 'j', 'width', 'height', 'globals', 'red', 'green', 'blue', 'alpha', text);
        } catch (error) {
            notice(`<strong>Error</strong> in channel ${color}.<br/>` +
                `<strong>${error.name}</strong>:  ${error.message}`);
        }
    });

}

function setPreset(name) {
    for (let preset of PRESETS) {
        if (preset.name === name) {

            ['red', 'green', 'blue', 'alpha'].forEach(color => {
                $('#' + color + '-textarea').val(preset[color])
                    .trigger('input');
            });

            if (preset.hasOwnProperty('preferredSize')) {
                $('#width-input').val(preset.preferredSize.width);
                $('#height-input').val(preset.preferredSize.height);
                updateDimensions(false);
            }

            break;
        }
    }

    renderImage();
}

function notice(message, type = 'ok') {
    if (type === 'ok') {
        $('#notice').html(message);
        $('#notice').removeClass('no-notice error-notice warning-notice');
        $('#notice').addClass('ok-notice');
        $('#notice-container').show(100);
    } else if (type === 'error') {
        $('#notice').html(message);
        $('#notice').removeClass('no-notice ok-notice warning-notice');
        $('#notice').addClass('error-notice');
        $('#notice-container').show(100);
    } else if (type === 'warning') {
        $('#notice').html(message);
        $('#notice').removeClass('no-notice error-notice ok-notice');
        $('#notice').addClass('warning-notice');
        $('#notice-container').show(100);
    } else if (type === 'clear') {
        $('#notice').html('');
        $('#notice').removeClass('ok-notice warning-notice error-notice');
        $('#notice').addClass('no-notice');
        $('#notice-container').hide(50);
    }
}

function updateDimensions(redraw = true) {
    let new_width = $('#width-input').val();
    let new_height = $('#height-input').val();

    $('#draw-progress').attr('max', new_height);

    canva.width = new_width;
    canva.height = new_height;

    if (redraw) {
        renderImage(false);
    }
}

function setCodeFromObject(obj) {
    let filter = ['preferredSize'];

    for (let key of Object.keys(obj)) {
        if (obj.hasOwnProperty(key) && !filter.includes(key)) {

            $('#' + key + '-textarea').val(obj[key])
                .trigger('input');

        }
    }

    if (Object.hasOwnProperty('preferredSize')) {
        $('#width-input').val(obj.preferredSize.width);
        $('#height-input').val(obj.preferredSize.height);
        updateDimensions(false);
    }

    renderImage();
}

function setupLoadAndSave() {
    /* link upload btn and input form */
    $('#upload-btn').on('click', function (e) {
        e.preventDefault();
        $('#upload-file-input').trigger('click');
    });

    /* do load */
    $('#upload-file-input').on('change', function (e) {

        let file = this.files[0];
        if (file) {
            let file_reader = new FileReader();
            file_reader.readAsText(file, 'UTF-8');

            file_reader.onload = function (evt) {
                notice('<strong>ok</strong> File uploaded successfully', 'ok');
                setCodeFromObject(JSON.parse(evt.target.result));
            };
            file_reader.onerror = function (evt) {
                notice('<strong>Error</strong> uploading file', 'error');
            };
        }

        // reset
        $(this).val('');
    });

    /* handle save */
    $('#save-btn').on('click', function (e) {
        /* from -- https://stackoverflow.com/a/30832210/3769237 */

        let obj = {
            preferredSize: {
                width: canva.width,
                height: canva.height,
            },
        };
        ['red', 'green', 'blue', 'alpha'].forEach(color => {
            obj[color] = $('#' + color + '-textarea').val();
        });

        let file = new Blob([JSON.stringify(obj)], { type: 'json' });

        /* see -- https://stackoverflow.com/a/30458400/3769237 */
        let timestamp = new Date();
        let yyyy = timestamp.getFullYear();
        let mm = timestamp.getMonth() < 9 ? "0" + (timestamp.getMonth() + 1) : (timestamp.getMonth() + 1);
        let dd = timestamp.getDate() < 10 ? "0" + timestamp.getDate() : timestamp.getDate();
        let hh = timestamp.getHours() < 10 ? "0" + timestamp.getHours() : timestamp.getHours();
        let min = timestamp.getMinutes() < 10 ? "0" + timestamp.getMinutes() : timestamp.getMinutes();
        let ss = timestamp.getSeconds() < 10 ? "0" + timestamp.getSeconds() : timestamp.getSeconds();

        const f_name = 'codeart_save_' +
            [yyyy, mm, dd, hh, min, ss].join('-') +
            '.json';

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(file, f_name);
        } else {

            let url = URL.createObjectURL(file);
            let link = $('<a></a>')
                .attr('id', '_tmp_download_link')
                .attr('href', url)
                .attr('download', f_name)
                .appendTo('body')
                .get(0).click();

            setTimeout(function () {
                $('#_tmp_download_link').remove();
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    });
}