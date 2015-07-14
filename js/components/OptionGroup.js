var React = require('react');
var { List } = require('immutable');
var Select = require('react-select');
var SurveyActions = require('../actions/SurveyActions');

var OptionGroup = React.createClass({
    propTypes: {
        options: React.PropTypes.instanceOf(List).isRequired,
        selectedID: React.PropTypes.number.isRequired
    },
    handleChange(val) {
        SurveyActions.updateOptionGroup(parseInt(val, 10));
    },
    render() {
        var { options, selectedID } = this.props;
        var selectOptions = options.toJS().map(o => ({
                value: o.id.toString(),
                label: o.optionLabels.join(", ")
            })
        );
        return selectOptions.length === 0 ? null :
            <Select options={selectOptions}
                    onChange={this.handleChange}
                    clearable={false}
                    value={selectedID.toString()} />;

    }
});

module.exports = OptionGroup;
