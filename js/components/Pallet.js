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
    getNewQuestionId: function() {
        // TODO: Refer to java code for ID generation
        return Math.floor((Math.random() * 1000) + 1);
    },
    getNewQuestion: function(question) {
        var id = this.getNewQuestionId();
        return {
            id: id,
            options: [],
            qtext: question.qtext
        }
    },
    getNewOption: function(option) {
        var id = this.getNewQuestionId();
        return {
            id: id,
            otext: option.otext
        }
    },
    handleBlockDrop: function() {
        // this is where the new block is added
        var survey = this.state.survey,
            newId = this.state.nextBlockId + 1,
            newBlock = this.getNewBlock({id: newId}),
            newSurvey = survey.concat(newBlock);

        //  and state is updated with new block
        this.setState({
            survey: newSurvey,
            nextBlockId: newId
        });

        // TODO: better alerts
        console.log("new block added");
    },
    handleQuestionDrop: function() {
        // for now, we just add the question to the last block
        var survey = this.state.survey,
            block = survey[survey.length - 1];

        var qtext = prompt("Enter question text");
        if (qtext == undefined) {
            return;
        }
        var newQuestion = this.getNewQuestion({qtext: qtext});
        block.questions = block.questions.concat(newQuestion);

        survey[survey.length - 1] = block;
        this.setState({
            survey: survey
        });
        console.log("New question added");
    },
    handleOptionDrop: function() {
        var survey = this.state.survey,
            blockId = survey.length - 1,
            questions = survey[blockId].questions,
            questionId = questions.length - 1;

        var otext = prompt("Enter option text");
        if (otext == undefined) {
            return;
        }
        var newOption = this.getNewOption({otext: otext});
        var question = questions[questionId];
        question.options = question.options.concat(newOption);
        this.setState({
            survey: survey
        });
        console.log("new option added");
    },
    render: function() {
        return (
            <div>
                <h5>Pallet</h5>
                <Dropzone onBlockDropped={this.handleBlockDrop}
                          onQuestionDropped={this.handleQuestionDrop}
                          onOptionDropped={this.handleOptionDrop} />
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
