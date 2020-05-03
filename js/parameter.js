

class ParameterList {
    constructor(globals) {
        this.globals = globals;

        this.param_list_elem = $('#parameter-list');

        this.params = [];
    }

    addParam(name, val = 0, min = -1, max = 1, step = 0.1) {
        let id = this.params.length;

        let param = $('<div></div>')
            .addClass('parameter vertical-container')
            .attr('id', 'parameter-container-' + id)
            .append(
                $('<div></div>')
                    .append(
                        $('<strong></strong>')
                            .addClass('parameter-name')
                            .html('Parameter Name: ')
                    )
                    .append(
                        $('<input>')
                            .attr('type', 'text')
                            .attr('id', 'parameter-name-' + id)
                            .val(name)
                            .on('input', () => { this.valueChange(id) })
                    )
                    .append(
                        $('<strong></strong>')
                            .html('Value: ')
                            .addClass('parameter-name')
                    )
                    .append(
                        $('<span></span>')
                            .attr('id', 'parameter-value-label-' + id)
                    )
            )
            .append(
                $('<div></div>')
                    .addClass('horizontal-container')
                    .append($('<label></label>').html('Min: '))
                    .append(
                        $('<input>')
                            .attr('type', 'number')
                            .attr('id', 'parameter-min-' + id)
                            .addClass('parameter-min-input')
                            .val(min)
                            .on('keyup input change', () => { this.updateRange(id) })
                    )
                    .append(
                        $('<input>')
                            .attr('type', 'range')
                            .attr('id', 'parameter-value-' + id)
                            .attr('min', min)
                            .attr('max', max)
                            .attr('step', step)
                            .val(val)
                            .on('change', () => { this.valueChange(id) })
                    )
                    .append($('<label></label>').html('Max: '))
                    .append(
                        $('<input>')
                            .attr('type', 'number')
                            .attr('id', 'parameter-max-' + id)
                            .addClass('parameter-max-input')
                            .val(max)
                            .on('keyup input change', () => { this.updateRange(id) })
                    )
                    .append($('<label></label>').html('Step: '))
                    .append(
                        $('<input>')
                            .attr('type', 'number')
                            .attr('id', 'parameter-step-' + id)
                            .addClass('parameter-step-input')
                            .val(step)
                            .on('keyup input change', () => { this.updateRange(id) })
                    )
            );

        $(this.param_list_elem).append($(param));

        this.params.push(param);

        this.valueChange(id);
    }

    valueChange(id) {
        /* get the name of this variable */
        let varName = $('#parameter-name-' + id).val();

        if (varName == '') return;

        let val = $('#parameter-value-' + id).val();
        $('#parameter-value-label-' + id).text(val);
        this.globals[varName] = val;

        if (this.update_func) {
            this.update_func();
        }
    }

    updateRange(id) {
        let min = $('#parameter-min-' + id).val();
        let max = $('#parameter-max-' + id).val();
        let step = $('#parameter-step-' + id).val();

        $('#parameter-value-' + id)
            .attr('min', min)
            .attr('max', max)
            .attr('step', step);
    }

    updateAllVars() {
        for (let i = 0; i < this.params.length; i++) {
            let name = $('#parameter-name-' + i).val();
            let val = $('#parameter-value-' + i).val();

            this.globals[name] = val;
        }
    }

    onUpdate(func) {
        this.update_func = func;
    }

    getSaveInfo() {
        let arr = [];

        for (let i = 0; i < this.params.length; i++) {
            let name = $('#parameter-name-' + i).val();
            let val = $('#parameter-value-' + i).val();
            let min = $('#parameter-min-' + i).val();
            let max = $('#parameter-max-' + i).val();
            let step = $('#parameter-step-' + i).val();

            arr.push({
                name: name,
                val: val,
                min: min,
                max: max,
                step: step,
            });
        }

        return arr;
    }
}