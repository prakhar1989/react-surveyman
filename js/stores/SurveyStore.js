var Reflux = require('reflux');
var initialData = require('../data.js');
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('../components/ItemTypes');
var Immutable = require('immutable');

// a set of option texts - helps in generating suggestions
var _optionsSet = Immutable.OrderedSet();

// initialize question and option map which will help in
// faster retrieval of associated blocks and questions.
var _questionMap = Immutable.Map();     // questionId => block
var _optionMap = Immutable.Map();       // optionId   => question

var SurveyStore = Reflux.createStore({
    listenables: [SurveyActions],
    data: {
        surveyData: [],
        modalState: Immutable.Map({
            dropTargetID: null,
            isOpen: false
        }),
        alertState: Immutable.Map({
            msg: '',
            level: 'info',
            visible: false
        })
    },
    init() {
        this.listenTo(SurveyActions.load, () => {
            this.updateSurveyData(initialData);
        });
    },
    getInitialState() {
        return {
            surveyData: this.data.surveyData,
            modalState: this.data.modalState,
            alertState: this.data.alertState
        }
    },
    /**
     * Updates the survey data as the args provided. Triggers refresh 
     * @param data surveydata
     */
    updateSurveyData(data) {
        this.data.surveyData = data;
        this.trigger(this.data);
    },
    /*
     ** Returns the set (unique list) of options.
     */
    getOptionsSet() {
        return _optionsSet;
    },
    // temp functions to return new IDs
    getNewQuestionId() {
        return Math.floor((Math.random() * 1000) + 1);
    },
    // temp functions to return new IDs
    getNewOptionId() {
        return Math.floor((Math.random() * 1000) + 1);
    },
    /**
     * Runs when the blockDropped action is called by the view.
     * Adds a new block to the end of the survey object.
     */
    onBlockDropped() {
        var survey = this.data.surveyData;
        var newBlock = {
            id: survey.length,
            questions: [],
            subblocks: [],
            randomizable: true,
            ordering: false
        };
        var newSurvey = survey.concat(newBlock);
        this.updateSurveyData(newSurvey);
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
        _questionMap = _questionMap.set(newQuestion.id, block);

        this.updateSurveyData(survey);
        SurveyActions.showAlert("new question added", "success");
    },
    /**
     * Runs when the optionAdded action is called by the view.
     * Adds an option with text as otext to the question whose id is provided as an argument.
     * @param questionId (int) of the question to which the option will be added.
     * @param otext (string) the text of the option to be added
     */
    onOptionAdded(questionId, otext) {
        var question = this.getQuestionWithID(questionId);

        if (!question) {
            throw new Error('Question not found');
        }

        // template for new Option
        var newOption = {
            id: this.getNewOptionId(),
            otext: otext
        };
        question.options = question.options.concat(newOption);

        // update the option map and options set
        _optionMap = _optionMap.set(newOption.id, question);
        _optionsSet = _optionsSet.add(otext);

        this.trigger(this.data);
    },
    /**
     * Run when the action toggleModal is called by the view
     * @param modalType - Refer to the type of object that was dropped
     * @param dropTargetID - Refers to the ID on which the object was dropped
     */
    onToggleModal(modalType, dropTargetID) {
        var modalState = this.data.modalState;

        // TODO: this handles the modal for question separately, although 
        // this is not really required. deal with it later.
        if (modalType === ItemTypes.QUESTION) {
            modalState = modalState.set('isOpen', !modalState.get('isOpen'));
        }

        // sets the correct dropTarget to pass down to component
        this.data.modalState = modalState.set('dropTargetID', dropTargetID);
        this.trigger(this.data);
    },
     /* Hides the alert box */
    hideAlert() {
        setTimeout(function(self) {
            self.data.alertState = self.data.alertState.set('visible', false);
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
        // TODO: move from strings to consts for alert levels.
        this.data.alertState = Immutable.Map({
            msg: msg,
            level: level,
            visible: true
        });
        this.trigger(this.data);
        this.hideAlert();
    },
    /**
     * Called when the downloadSurvey action is called. 
     * Logs the survey object to the console.
     */
    onDownloadSurvey() {
        var survey = { survey: this.data.surveyData };
        console.log("Survey:", survey);
        SurveyActions.showAlert("Survey logged in your Dev console", "success");
    },
    /**
     * Returns a reference to the question
     * @param id - id of the question
     */
    getQuestionWithID(id) {
        var block = _questionMap.get(id);
        return block.questions.filter(q => q.id === id)[0];
    },
    /**
     * Called when the toggleParam action is called.
     * Toggles the property on the item.
     * @param itemType - type of Item the toggle button is clicked. one of ItemTypes
     * @param itemId - Id of the item for which toggle button is clicked
     * @param toggleName - string name of property that is toggled.
     */
    onToggleParam(itemType, itemId, toggleName) {

        // handle the case when a param on a block is toggled
        if (itemType === ItemTypes.BLOCK) {
            let block = this.data.surveyData[itemId];
            block[toggleName] = !block[toggleName];
            this.trigger(this.data);
        }

        // handle the case when a param on a question is toggled
        else if (itemType === ItemTypes.QUESTION) {
            let question = this.getQuestionWithID(itemId);
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
            let block = _questionMap.get(itemId);
            let index = Array.findIndex(block.questions, q => q.id === itemId);
            block.questions.splice(index, 1);
            SurveyActions.showAlert("Item deleted successfully", "success");
        }

        // handle option delete
        else if (itemType === ItemTypes.OPTION) {
            let question = _optionMap.get(itemId);
            let index = Array.findIndex(question.options, o => o.d === itemId);
            question.options.splice(index, 1);
            SurveyActions.showAlert("Item deleted successfully", "success");
        }

        // throw exception
        else {
            throw new Error("Not a valid item type");
        }
    },
    /**
     * Called when the question text is edited. Sets qtext to new value.
     * @param text - new text value
     * @param questionId - id of the question that needs to be changed
     */
    onSaveEditText(text, questionId) {
        var question = this.getQuestionWithID(questionId);
        question.qtext = text;
        this.trigger(this.data);
    }
});

module.exports = SurveyStore;
