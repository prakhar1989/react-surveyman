var Reflux = require('reflux');
var SurveyData = require('../data.js');
var SurveyActions = require('../actions/SurveyActions');

var SurveyStore = Reflux.createStore({
    listenables: [SurveyActions],
    data: {
        surveyData: []
    },
    init() {
        this.listenTo(SurveyActions.load, this.fetchData);
    },
    fetchData() {
        this.updateData(SurveyData);
    },
    updateData(data) {
        this.data.surveyData = data;
        this.trigger(this.data);
    },
    getInitialState() {
        return {
            surveyData: this.data.surveyData
        }
    },
    getNewBlock(block) {
        // generates a block JS object
        return {
            id: block.id,
            questions: [],
            subblocks: []
        }
    },
    getNewQuestionId() {
        // TODO: Refer to java code for ID generation
        return Math.floor((Math.random() * 1000) + 1);
    },
    getNewQuestion(question) {
        var id = this.getNewQuestionId();
        return {
            id: id,
            options: [],
            qtext: question.qtext
        }
    },
    getNewOption(option) {
        var id = this.getNewQuestionId();
        return {
            id: id,
            otext: option.otext
        }
    },
    onBlockDropped() {
        // this is where the new block is added
        var survey = this.data.surveyData;
        var newId = survey.length + 1,
            newBlock = this.getNewBlock({id: newId}),
            newSurvey = survey.concat(newBlock);

        //  and state is updated with new block
        this.updateData(newSurvey);
        console.log("new block added");
    },
    /**
     * Run when the questionDropped action is called by the view.
     * Adds a question to the block who's id is provided as param
     * @param blockId (int) of the block to which the question will be added.
     */
    onQuestionDropped(blockId) {
        var survey = this.data.surveyData,
            position = blockId - 1,
            block = survey[position];

        if (!block) {
            throw new Error("block does not exist");
        }

        var qtext = prompt("Enter question text");
        if (qtext == undefined) {
            return;
        }

        var newQuestion = this.getNewQuestion({qtext: qtext});
        block.questions = block.questions.concat(newQuestion);

        this.updateData(survey);
        console.log("New question added");
    },
    onOptionDropped() {
        var survey = this.data.surveyData,
            blockId = survey.length - 1,
            questions = survey[blockId].questions,
            questionId = questions.length - 1;

        if (questions.length === 0) {
            alert("Options can only be added to Questions");
            return;
        }

        var otext = prompt("Enter option text");
        if (otext == undefined) {
            return;
        }

        var newOption = this.getNewOption({otext: otext});
        var question = questions[questionId];
        question.options = question.options.concat(newOption);

        this.updateData(survey);
        console.log("new option added");
    }
});

module.exports = SurveyStore;