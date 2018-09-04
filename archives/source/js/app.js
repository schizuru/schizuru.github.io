var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    className = {
        open: 'is-open',
        selected: 'is-selected'
    };

$(document).ready(function() {
    var html = '',
        years = [],
        months = [];
    for (var p = 0; p < person.length; p++) {
        html += '<li class="person" data-index="' + p + '" data-id="' + person[p].id + '" data-name="' + person[p].name + '">';
        html +=     '<a href="#">';
        html +=         '<img class="image" src="' + person[p].imagePath + '" alt="">';
        html +=         '<span class="name">' + person[p].name + '</span>';
        html +=         '<span class="count">(' + person[p].dates.length + ')</span>';
        html +=     '</a>';

        var daysIn = {
                year: [],
                month: []
            };
        for (var i = 0; i < person[p].dates.length; i++) {
            var date = person[p].dates[i].substring(0, 4),
                year = person[p].dates[i].substring(0, 4),
                month = person[p].dates[i].substring(0, 6);

            if (years.indexOf(year) === -1) years.push(year);
            if (!daysIn.year[year]) daysIn.year[year] = 0;
            daysIn.year[year] = daysIn.year[year] + 1;

            if (months.indexOf(month) === -1) months.push(month);
            if (!daysIn.month[month]) daysIn.month[month] = 0;
            daysIn.month[month] = daysIn.month[month] + 1;
        }

        html +=     '<ol class="list year-list">';
        for (var y = 0; y < years.length; y++) {
                html +=     '<li class="year">';
                html +=         '<a href="#">';
                html +=             '<i class="icon"></i>';
                html +=             years[y];
                html +=             '<span class="count">(' + daysIn.year[years[y]] + ')</span>';
                html +=         '</a>';
                html +=         '<ol class="list month-list">';
                for (var m = 0; m < months.length; m++) {
                    var isSameYear = months[m].substring(0, 4) === years[y],
                        month = months[m].substring(4, 6);
                    if (isSameYear) {
                        html +=             '<li class="month">';
                        html +=                 '<a href="#" data-calendar-month="' + years[y] + month + '01' + '">';
                        html +=                     '<i class="icon"></i>';
                        html +=                     monthNames[parseInt((month-1), 10)];
                        html +=                     '<span class="count">(' + daysIn.month[years[y]+month] + ')</span>';
                        html +=                 '</a>';
                        html +=                 '<div class="datepicker"></div>';
                        html +=             '</li>';
                    }
                }
                html +=         '</ol>';
                html +=     '</li>';
        }
        html +=     '</ol>'; // .year-list
        html += '</li>'; // .person
        years = [];
        months = [];
        days = [];
    }

    $('#js-index').append(html);

    var iframe = $('#js-iframe');

    function adjustIframe() {
        var windowHeight = window.innerHeight - 70;
        $(iframe).css('height', windowHeight);
    }

    adjustIframe();

    $(window).on('resize', function() {
        adjustIframe();
    });

    $('#js-close-all').on('click', function() {
        $('.' + className.open).removeClass(className.open);
    });

    $('#js-expand-all').on('click', function() {
        $('.person').addClass(className.open);
        $('.year').addClass(className.open);
        $('.month > a').click();
    });

    $('.nav')
        .on('click', 'a', function(event) {
            event.preventDefault();
            $(this).closest('li').toggleClass(className.open);
        })
        .on('click', '.month > a', function(event) {
            event.preventDefault();
            var self = $(this),
                index = self.closest('.person').data('index'),
                id = person[index].id,
                name = person[index].name,
                availableDates = person[index].dates,
                displayMonth = self.data('calendar-month').toString();
            self.next('.datepicker').datepicker({
                inline: true,
                dateFormat: 'yymmdd',
                defaultDate: displayMonth,
                onSelect: function() {
                    var date = $(this).val(),
                        fileName = id + '-' + date,
                        year = date.substring(0, 4),
                        month = date.substring(4, 6),
                        day = date.substring(6, 8);
                    $(iframe).attr('src', 'contents/' + fileName + '.html');
                    $('.ui-state-active').removeClass('ui-state-active');
                    $('.' + className.selected).removeClass(className.selected);
                    $(this).addClass(className.selected);
                    $('#js-name').html(name);
                    $('#js-date').html(day + '-' + month + '-' + year);
                },
                beforeShowDay: function(date) {
                    dmy = date.getFullYear() + ('0' + (date.getMonth()+1)).slice(-2) + ('0' + date.getDate()).slice(-2);
                    if ($.inArray(dmy, availableDates) != -1) {
                        return [true, '', 'Available'];
                    } else {
                        return [false, '', 'unAvailable'];
                    }
                }
            });
        })
    ;
});

