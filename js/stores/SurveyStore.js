var Reflux = require('reflux');
var _ = require('lodash');
var SurveyData = require('../data.js');
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('../components/ItemTypes');

var SurveyStore = Reflux.createStore({
    listenables: [SurveyActions],
    data: {
        surveyData: [],
        dropTargetID: null,
        modalState: {
            option: false,
            block: false,
            question: false
        },
        alertState: {
            msg: "hello world",
            level: 'warning',
            visible: false
        }
    },
    init() {
        this.listenTo(SurveyActions.load, this.fetchData);

        // initialize question and option map which will help in
        // faster retrieval of associated blocks and questions.
        this.questionMap = {};      // question -> block
        this.optionMap = {};        // option -> question

        // a set of option texts - helps in generating suggestions
        this.optionsSet = new Set();
    },
    getOptionsSet() {
        return this.optionsSet;
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
            surveyData: this.data.surveyData,
            modalState: this.data.modalState,
            alertState: this.data.alertState
        }
    },
    getNewBlock(block) {
        return {
            id: block.id,
            questions: [],
            subblocks: [],
            randomizable: true,
            ordering: false
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
    /**
     * Runs when the blockDropped action is called by the view.
     * Adds a new block to the end of the survey object.
     */
    onBlockDropped() {
        var survey = this.data.surveyData;
        var newId = survey.length,
            newBlock = this.getNewBlock({id: newId}),
            newSurvey = survey.concat(newBlock);

        this.updateData(newSurvey);
        SurveyActions.showAlert("new block added", "success");
    },
    /**
     * Runs when the questionDropped action is called by the view.
     * Adds a question to the block who's id is provided as param
     * @param questionObj A POJO containing data the for the new question.
     * with the following keys - parentID, qtext, config
     */
    onQuestionDropped(questionObj) {

        var survey = this.data.surveyData,
            position = questionObj.parentID,
            block = survey[position];

        if (!block) {
            throw new Error("block does not exist");
        }

        // var newQuestion = this.getNewQuestion(questionObj);
        var newQuestion = {
            id: this.getNewQuestionId(),
            qtext: questionObj.qtext,
            options: [],
            ordering: questionObj.ordering,
            freetext: questionObj.freetext,
            exclusive: questionObj.exclusive
        };
        block.questions = block.questions.concat(newQuestion);

        // update question map with new question
        this.questionMap[newQuestion.id] = questionObj.parentID;

        this.updateData(survey);
        SurveyActions.showAlert("new question added", "success");
    },
    /**
     * Runs when the optionAdded action is called by the view.
     * Adds an option with text as otext to the question whose id is provided as an argument.
     * @param questionId (int) of the question to which the option will be added.
     * @param otext (string) the text of the option to be added
     */
    onOptionAdded(questionId, otext) {
        var survey = this.data.surveyData,
            blockId = this.questionMap[questionId];

        var question = _.find(survey[blockId].questions, ques => {
            return ques.id === questionId
        });

        if (!question) {
            throw new Error('Question not found');
        }

        if (otext === undefined) {
            return;
        }

        var newOption = this.getNewOption({otext: otext});
        question.options = question.options.concat(newOption);

        // update the option map and options set
        this.optionMap[newOption.id] = question.id;
        this.optionsSet.add(otext);

        this.updateData(survey);
    },
    /**
     * Run when the action toggleModal is called by the view
     * @param modalType - Refer to the type of object that was dropped
     * @param dropTargetID - Refers to the ID on which the object was dropped
     */
    onToggleModal(modalType, dropTargetID) {

        // causes a modal popup to toggle
        var modalState = this.data.modalState;
        if (modalType === ItemTypes.QUESTION) {
            modalState.question = !modalState.question;
        } else if (modalType === ItemTypes.OPTION) {
            modalState.option = !modalState.option;
        } else {
            modalState.block = !modalState.block;
        }

        // sets the correct dropTarget to pass down to component
        this.data.dropTargetID = dropTargetID;
        this.trigger(this.data);
    },
     /* Hides the alert box */
    hideAlert() {
        setTimeout(function(self) {
            self.data.alertState.visible = false;
            self.trigger(self.data);
        }, 2000, this);
    },
    /**
     * Run when the action showAlert is called. Responsible for displaying
     * alert in the app
     * @param msg - the msg to be displayed
     * @param level - the level. defaults to 'info'. See Bootstrap alerts for more.
     */
    onShowAlert(msg, level='info') {
        this.data.alertState = {
            msg: msg,
            level: level,
            visible: true
        };
        this.trigger(this.data);
        this.hideAlert();
    },
    /**
     * Called when the downloadSurvey action is called. 
     * Logs the survey object to the console.
     */
    onDownloadSurvey() {
        console.log("Survey:", this.data.surveyData);
        SurveyActions.showAlert("Survey logged in your Dev console", "success");
    },
    /**
     * Called when the toggleParam action is called.
     * Toggles the property on the item.
     * @param itemType - type of Item the toggle button is clicked. one of ItemTypes
     * @param itemId - Id of the item for which toggle button is clicked
     * @param toggleName - string name of property that is toggled.
     */
    onToggleParam(itemType, itemId, toggleName) {
        var block;

        // handle the case when a param on a block is toggled
        if (itemType === ItemTypes.BLOCK) {
            block = this.data.surveyData[itemId];
            block[toggleName] = !block[toggleName];
            this.trigger(this.data);
        }

        // handle the case when a param on a question is toggled
        else if (itemType === ItemTypes.QUESTION) {
            var blockId = this.questionMap[itemId];
            block = this.data.surveyData[blockId];
            var question = _.find(block.questions, ques => {
                return ques.id === itemId
            });
            question[toggleName] = !question[toggleName];
            this.trigger(this.data);
        }

        // throw exception
        else {
            throw new Error("Not a valid item type");
        }
    },
    /**
     * Called when an item has to be deleted.
     * @param itemType - refers to the type of item to be deleted. One of ItemTypes.
     * @param itemId - Id of item to be deleted.
     */
    onItemDelete(itemType, itemId) {
        // handle block delete
        if (itemType === ItemTypes.BLOCK) {
            this.data.surveyData.splice(itemId, 1);

            // if all blocks have been deleted, add a new one
            if (this.data.surveyData.length == 0) {
                SurveyActions.blockDropped();
            }

            SurveyActions.showAlert("Block deleted successfully", "success");
        }

        // handle question delete
        else if (itemType === ItemTypes.QUESTION) {
            var blockId = this.questionMap[itemId];
            var block = this.data.surveyData[blockId];
            var index = _.findIndex(block.questions, ques => {
                return ques.id === itemId
            });
            block.questions.splice(index, 1);
            SurveyActions.showAlert("Item deleted successfully", "success");
        }

        // handle option delete
        else if (itemType === ItemTypes.OPTION) {
            var questionId = this.optionMap[itemId];
            var blockId = this.questionMap[questionId];
            var block = this.data.surveyData[blockId];
            var question = block.questions.filter(q => q.id === questionId)[0];
            var index = _.findIndex(question.options, opt => opt.id === itemId);
            question.options.splice(index, 1);
            SurveyActions.showAlert("Item deleted successfully", "success");
        }

        // throw exception
        else {
            throw new Error("Not a valid item type");
        }
    },
    /**
     * Called when the question text is edited. Responsible for
     * saving new value.
     * @param text - new text value
     * @param questionId - id of the question that needs to be changed
     */
    onSaveEditText(text, questionId) {
        var blockId = this.questionMap[questionId];
        var block = this.data.surveyData[blockId];
        var question = _.find(block.questions, ques => {
            return ques.id === questionId
        });
        question.qtext = text;
        this.trigger(this.data);
    }
});

module.exports = SurveyStore;
