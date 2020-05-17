

class ParameterList {
    constructor() {
        this.param_list_elem = $('#parameter-list');

        this.params_list = [];

        this.params = {};
    }

    removeParam(btn) {
        const btnId = btn.target.id;
        const parts = btnId.split('-');
        const id = parseInt(parts[parts.length - 1]);

        $(this.params_list[id]).remove();

        this.params_list.splice(id, 1);

        for (let i = id; i < this.params_list.length; i++) {
            this.reindexParam(i + 1, i);
        }
    }

    reindexParam(oldIdx, newIdx) {
        /* element sits at newIdx */
        ['container', 'name', 'value-label', 'delete-btn', 'min', 'value', 'max', 'step'].forEach(val => {

            $('#parameter-' + val + '-' + oldIdx).attr('id', 'parameter-' + val + '-' + newIdx);

        });
    }

    addParam(name, val = 0, min = -1, max = 1, step = 0.1) {
        let id = this.params_list.length;

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
                            .on('input', () => { this.valueChange(id, false) })
                    )
                    .append(
                        $('<strong></strong>')
                            .html('Value: ')
                            .addClass('parameter-name')
                    )
                    .append(
                        $('<span></span>')
                            .attr('id', 'parameter-value-label-' + id)
                            .addClass('parameter-value-label')
                    )
                    .append(
                        $('<button></button>')
                            .addClass('btn delete-btn')
                            .attr('type', 'button')
                            .attr('id', 'parameter-delete-btn-' + id)
                            .text('Delete')
                            .on('click', (e) => { this.removeParam(e) })
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
                            .on('input', () => { this.updateValueLabel(id) })
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

        this.params_list.push(param);

        this.valueChange(id, false);
    }

    valueChange(id, redraw = true) {
        /* get the name of this variable */
        let varName = $('#parameter-name-' + id).val();

        if (varName == '') return;

        let val = $('#parameter-value-' + id).val();
        $('#parameter-value-label-' + id).text(val);

        this.updateAllVars();

        if (redraw && this.update_func) {
            this.update_func();
        }
    }

    updateValueLabel(id) {
        $('#parameter-value-label-' + id).text($('#parameter-value-' + id).val());
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
        this.params = {};
        for (let i = 0; i < this.params_list.length; i++) {
            let name = $('#parameter-name-' + i).val();
            let val = $('#parameter-value-' + i).val();

            this.params[name] = Number(val);
        }
    }

    getParams() {
        return this.params;
    }

    onUpdate(func) {
        this.update_func = func;
    }

    getSaveInfo() {
        let arr = [];

        for (let i = 0; i < this.params_list.length; i++) {
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