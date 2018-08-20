$(function () {
    var
        $table = $('#tree-table'),
        rows = $table.find('tr');

    rows.each(function (index, row) {
        var
            $row = $(row),
            level = $row.data('level'),
            id = $row.data('id'),
            $columnName = $row.find('td[data-column="name"]'),
            children = $table.find('tr[data-parent="' + id + '"]');

        if (children.length) {
            var expander = $columnName.prepend('' +
                '<span class="treegrid-expander mdi mdi-plus"></span>' +
                '');

            children.hide();

            expander.on('click', function (e) {
                var $target = $(e.target);
                if ($target.hasClass('mdi-plus')) {
                    $target
                        .removeClass('mdi-plus')
                        .addClass('mdi-minus');

                    children.show();
                } else {
                    $target
                        .removeClass('mdi-minus')
                        .addClass('mdi-plus');

                    reverseHide($table, $row);
                }
            });
        }

        $columnName.prepend('' +
            '<span class="treegrid-indent" style="width:' + 15 * level + 'px"></span>' +
            '');
    });

    // Reverse hide all elements
    reverseHide = function (table, element) {
        var
            $element = $(element),
            id = $element.data('id'),
            children = table.find('tr[data-parent="' + id + '"]');

        if (children.length) {
            children.each(function (i, e) {
                reverseHide(table, e);
            });

            $element
                .find('.mdi-minus')
                .removeClass('mdi-minus')
                .addClass('mdi-plus');

            children.hide();
        }
    };
});
