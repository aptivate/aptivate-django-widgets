from datetime import date
from django.test import TestCase
from main.widgets import (
    PrintValueWidget, ReadOnlyWidget, YearDateSelectorWidget
)


class TestWidgets(TestCase):
    def test_readonlywidget_does_not_contain_form_widget(self):
        wdg = ReadOnlyWidget()
        expected = '<span>value</span>'
        assert wdg.render('name', 'value') == expected

    def test_formatter_attribute_changes_printvaluewidget_formatting(self):
        def formatter(value):
            return value + 5
        wdg = PrintValueWidget(attrs={'formatter': formatter})
        expected = '<span>6</span>'
        assert wdg.render('name', 1) == expected

    def test_template_attribute_changes_template_used_by_printvaluewidget(self):
        template = "<i>{0}</i>"
        wdg = PrintValueWidget(attrs={'template': template})
        expected = '<i>value</i>'
        assert wdg.render('name', 'value') == expected


# == pytest tests ==
# YearDateSelectorWidget
def test_yeardateselectorwidget_returns_year_object_when_year_set():
    widget = YearDateSelectorWidget()
    value = widget.value_from_datadict({'year': 2016}, None, 'year')
    assert value == date(2016, 7, 15)


def test_yeardateselectorwidget_returns_none_when_year_not_set():
    widget = YearDateSelectorWidget()
    value = widget.value_from_datadict({}, None, 'year')
    assert value is None
