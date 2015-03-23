var Dropzone = require('./Dropzone'),
    Survey = require('./Survey');

var Pallet = React.createClass({
    propTypes: {
        survey: React.PropTypes.array
    },
    getDefaultProps: function() {
        return {
            survey: []
        }
    },
    render: function() {
        var surveyObj = this.props.survey;
        return (
            <div>
                <h5>Pallet</h5>
                <Dropzone />
                <hr/>

                <h5>Survey</h5>
                <div className="survey-area">
                    <Survey survey={surveyObj} />
                </div>
            </div>
        )
    }
});

module.exports = Pallet;
