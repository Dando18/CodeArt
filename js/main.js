let canva = null;
let ctx = null;

let color_functions = {};
let glob = {};
let param_list = null;

let cur_mode = 'RGBA';
const MODES = ['RGBA', 'RGB', 'MONO', 'GRAYSCALE', 'HSV'];

$(() => {

    canva = document.getElementById('main-img');
    ctx = canva.getContext('2d');

    /* render image on click */
    $('#color-btn').on('click', renderImage);

    /* fill in presets in select element */
    for (let preset of PRESETS) {
        $('#presets').append(
            $('<option></option>')
                .attr('value', preset.name)
                .text(preset.name)
        );
    }
    $('#presets').on('change', function () { setPreset(this.value); });

    /* custom dimensions setup */
    $('#width-input').val(canva.width);
    $('#height-input').val(canva.height);
    $('#resize-btn').on('click', updateDimensions);

    /* load/save setup */
    setupLoadAndSave();

    /* setup modes */
    for (let mode of MODES) {
        $('#modes').append(
            $('<option></option>')
                .attr('value', mode)
                .text(mode)
        );
    }
    $('#modes').on('change', function () { changeMode(this.value); });

    /* parameter list */
    param_list = new ParameterList();
    param_list.onUpdate(renderImage);

    $('#add-parameter-btn').on('click', function (e) {
        param_list.addParam('');
    });

    /* begin with Rainbow as preset */
    let preset = getUrlParameter('preset');
    if (preset) {
        setPreset(preset);
    } else {
        setPreset('Rainbow');
    }
});

function get(color, i, j) {
    let val = {};
    try {
        val.value = color_functions[color](i, j, canva.width, canva.height, glob, param_list.params, color_functions);
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

            vals = [];
            getModeNames(cur_mode).forEach((color, offset) => {

                val = get(color, i, j);

                if (val.error) {
                    notice(val.error, 'error');
                    should_stop = true;
                    return;
                }

                vals.push(val.value);
            });

            if (should_stop) break;

            valsToRGBA(vals, cur_mode).forEach((v, off) => {
                img_data.data[4 * (i * canva.width + j) + off] = clamp(v);
            });
        }
        if (should_stop) break;
    };

    ctx.putImageData(img_data, 0, 0);
}

function updateFunctions() {

    getModeNames(cur_mode).forEach(color => {

        let text = $('#' + color + '-textarea').val();

        try {
            color_functions[color] = Function('i', 'j', 'width', 'height', 'globals', 'params', 'funcs', text);
        } catch (error) {
            notice(`<strong>Error</strong> in channel ${color}.<br/>` +
                `<strong>${error.name}</strong>:  ${error.message}`);
        }
    });

}

function setPreset(name) {
    for (let preset of PRESETS) {
        if (preset.name === name) {
            $('#presets').val(name);

            setCodeFromObject(preset);
            break;
        }
    }
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
    let filter = ['preferredSize', 'parameters', 'mode'];

    if (obj.hasOwnProperty('mode')) {
        changeMode(obj.mode);
    }

    for (let key of Object.keys(obj)) {
        if (obj.hasOwnProperty(key) && !filter.includes(key)) {

            $('#' + key + '-textarea').val(obj[key])
                .trigger('input');

        }
    }

    if (obj.hasOwnProperty('preferredSize')) {
        $('#width-input').val(obj.preferredSize.width);
        $('#height-input').val(obj.preferredSize.height);
        updateDimensions(false);
    }

    if (obj.hasOwnProperty('parameters')) {
        for (let param of obj.parameters) {
            param_list.addParam(param.name, param.val, param.min, param.max, param.step);
        }
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
            parameters: param_list.getSaveInfo(),
            mode: cur_mode,
        };
        getModeNames(cur_mode).forEach(color => {
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


function changeMode(new_mode) {
    cur_mode = new_mode;

    /* update the UI selector */
    $('#modes').val(cur_mode);

    setupCodeBlocks(cur_mode);
}

function getModeNames(mode) {
    if (mode === 'RGBA') {
        return ['red', 'green', 'blue', 'alpha'];
    } else if (mode === 'RGB') {
        return ['red', 'green', 'blue'];
    } else if (mode === 'HSV') {
        return ['hue', 'saturation', 'value'];
    } else if (mode === 'MONO') {
        return ['mono'];
    } else if (mode === 'GRAYSCALE') {
        return ['grayscale'];
    }
}

function setupCodeBlocks(mode) {
    let main = $('#main-code-block-container');

    let names = getModeNames(mode);
    let n_horiz = Math.ceil(names.length / 2);
    let sub_containers = [];

    main.empty();

    for (let i = 0; i < n_horiz; i++) {
        sub_containers[i] = $('<div></div>').addClass('horizontal-container');
        main.append(sub_containers[i]);
    }

    for (let i = 0; i < names.length; i++) {
        let idx = Math.floor(i / 2);
        sub_containers[idx].append(newCodeBlock(names[i]));
    }

    styleCodeBlocks();
}

function newCodeBlock(name) {
    return $('<div></div>')
        .addClass('code-block')
        .append(
            $('<div></div>')
                .addClass('code-block-text')
                .html(name + '(i, j, width, height, globals, params) {')
        )
        .append(
            $('<textarea></textarea>')
                .addClass('code-block-textarea')
                .attr('id', name + '-textarea')
        )
        .append(
            $('<div></div>')
                .addClass('code-block-text')
                .html('}')
        );
}

function styleCodeBlocks() {
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
}

function valsToRGBA(vals, mode) {

    if (mode === 'RGBA') {
        return vals;
    } else if (mode === 'RGB') {
        return [vals[0], vals[1], vals[2], 255];
    } else if (mode === 'HSV') {
        return hsv2rgba(vals);
    } else if (mode === 'MONO') {
        return vals;

    } else if (mode === 'GRAYSCALE') {

    } else {
        return vals;
    }
}

/* from -- https://stackoverflow.com/a/17243070/3769237 */
function hsv2rgba(vals) {
    let r, g, b, i, f, p, q, t;

    h = vals[0] / 360.0;
    s = vals[1] / 100.0;
    v = vals[2] / 100.0;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255),
        255
    ];
}

/* from -- https://stackoverflow.com/a/21903119/3769237 */
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};