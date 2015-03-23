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
    getInitialState: function() {
        return {
            survey: this.props.survey,
            nextBlockId: this.props.survey.length
        }
    },
    getNewBlock: function(block) {
        // generates a block JS object
        return {
            id: block.id,
            questions: [],
            subblocks: []
        }
    },
    handleBlockDrop: function() {
        // this is where the new block is added
        var survey = this.state.survey,
            newId = this.state.nextBlockId + 1;

        var newBlock = this.getNewBlock({id: newId});
        var newSurvey = survey.concat(newBlock);

        //  and state is updated with new block
        this.setState({
            survey: newSurvey,
            nextBlockId: newId
        });
    },
    render: function() {
        return (
            <div>
                <h5>Pallet</h5>
                <Dropzone onBlockDropped={this.handleBlockDrop} />
                <hr/>

                <h5>Survey</h5>
                <div className="survey-area">
                    <Survey survey={this.state.survey} />
                </div>
            </div>
        )
    }
});

module.exports = Pallet;
