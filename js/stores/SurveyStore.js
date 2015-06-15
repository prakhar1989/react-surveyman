var Reflux = require('reflux');
var initialData = require('../data.js');
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('../components/ItemTypes');
var Immutable = require('immutable');
var AlertTypes = require('../components/AlertTypes');

// a set of option texts - helps in generating suggestions
var _optionsSet = Immutable.OrderedSet();

// initialize question and option map which will help in
// faster retrieval of associated blocks and questions.
var _questionMap = Immutable.Map();     // questionId => blockId 
var _optionMap = Immutable.Map();       // optionId   => questionId

// CONSTS
const ALERT_TIMEOUT = 5 * 1000; // toggles how quickly the alert hides

// mananging history
var _history = [];

var SurveyStore = Reflux.createStore({
    listenables: [SurveyActions],
    data: {
        surveyData: Immutable.List(),
        modalState: Immutable.Map({
            dropTargetID: null,
            isOpen: false
        }),
        alertState: Immutable.Map({
            msg: '',
            level: AlertTypes.INFO,
            visible: false
        }),
        optionGroupState: Immutable.Map({
            selectedID: 1,
            options: Immutable.List()
        })
    },
    // called when the app component is loaded
    init() {
        // TODO: Load this from localstorage
        var initOptionsData = Immutable.fromJS([
            { id: 1, optionLabels: ["Yes", "No"] },
            { id: 2, optionLabels: ["True", "False"] },
            { id: 3, optionLabels: ["Strongly Agree", "Strongly Disagree", "Agree", "Disagree"] }
        ]);

        this.listenTo(SurveyActions.load, () => {
            window.location.hash = "";   // clear the location hash on app init

            this.data.optionGroupState = 
                this.data.optionGroupState.set('options', initOptionsData);

            // load up survey data
            var data = Immutable.fromJS(initialData);
            this.updateSurveyData(data, true);
        });
    },
    getInitialState() {
        return {
            surveyData: this.data.surveyData,
            modalState: this.data.modalState,
            alertState: this.data.alertState,
            optionGroupState: this.data.optionGroupState
        }
    },
    /**
     * Updates the survey data as the args provided. Triggers refresh.
     * Stores prev state in history, if second param is true
     * @param data surveydata
     * @param cache - boolean
     */
    updateSurveyData(data, cache = false) {
        if (cache) {
            _history.push({
                data        : this.data.surveyData,
                optionMap   : _optionMap.toJS(),
                questionMap : _questionMap.toJS()
            });
        }
        this.data.surveyData = data;
        this.trigger(this.data);
    },
    // Returns the set (unique list) of options.
    getOptionsSet() {
        return _optionsSet;
    },
    getNewId(type) {
        var prefix;
        if (type === ItemTypes.QUESTION) {
            prefix = "q"
        } else if (type === ItemTypes.OPTION) {
            prefix = "o"
        } else {
            prefix = "b"
        }
        return `${prefix}_${Math.floor((Math.random() * 99999) + 1)}`
    },
    /**
     * Runs when the blockDropped action is called by the view.
     * Adds a new block to the end of the survey object.
     */
    onBlockDropped() {
        var survey = this.data.surveyData;
        var newBlock = Immutable.fromJS({
            id: this.getNewId(ItemTypes.BLOCK),
            questions: [],
            subblocks: [],
            randomizable: true,
            ordering: false
        });
        this.updateSurveyData(survey.push(newBlock), true);
        SurveyActions.showAlert("New block added.", AlertTypes.SUCCESS);
    },
    /**
     * Runs when the questionDropped action is called by the view.
     * Adds a question to the block who's id is provided as param
     * @param questionObj A POJO containing data the for the new question.
     * with the following keys - parentID, qtext, config
     */
    onQuestionDropped(questionObj) {
        var newQuestion = Immutable.fromJS({
            id: this.getNewId(ItemTypes.QUESTION),
            qtext: questionObj.qtext,
            options: [],
            ordering: questionObj.ordering,
            freetext: questionObj.freetext,
            exclusive: questionObj.exclusive
        });

        var index = this.getBlockIndex(questionObj.parentID);
        var newSurvey = this.data.surveyData.updateIn([index, 'questions'], list =>
            list.push(newQuestion)
        );

        // update and cache
        this.updateSurveyData(newSurvey, true);

        // update question map with new question
        var block = this.data.surveyData.get(index);
        _questionMap = _questionMap.set(newQuestion.get('id'), block.get('id'));

        SurveyActions.showAlert("New Question added.", AlertTypes.SUCCESS);
    },
    /**
     * Runs when the optionAdded action is called by the view.
     * Adds an option with text as otext to the question whose id is provided as an argument.
     * @param questionId (int) of the question to which the option will be added.
     * @param otext (string) the text of the option to be added
     */
    onOptionAdded(questionId, otext) {
        // template for new Option
        var newOption = Immutable.Map({
            id: this.getNewId(ItemTypes.OPTION),
            otext: otext
        });

        var survey = this.data.surveyData;
        var blockIndex = this.getBlockIndex(_questionMap.get(questionId));
        var block = survey.get(blockIndex);
        var index = this.getQuestionIndex(questionId, block);
        var newSurvey = survey.updateIn(
            [blockIndex, 'questions', index, 'options'], 
            list => list.push(newOption)
        );

        // update the option map and options set
        _optionMap = _optionMap.set(newOption.get('id'), block.getIn(['questions', index, 'id']));
        _optionsSet = _optionsSet.add(otext);

        this.updateSurveyData(newSurvey, true);
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
    /**
     * Run when the action showAlert is called. Responsible for displaying
     * alert in the app
     * @param msg - the msg to be displayed
     * @param level - the level. defaults to 'info'. See Bootstrap alerts for more.
     */
    onShowAlert(msg, level=AlertTypes.INFO) {
        this.data.alertState = Immutable.Map({
            msg: msg,
            level: level,
            visible: true
        });
        this.trigger(this.data);

        // Hides the alert box
        setTimeout(function(self) {
            self.data.alertState = self.data.alertState.set('visible', false);
            self.trigger(self.data);
        }, ALERT_TIMEOUT, this);
    },
    /**
     * Called when the downloadSurvey action is called. 
     * Logs the survey object to the console.
     */
    onDownloadSurvey() {
        var survey = { survey: this.data.surveyData.toJS() };
        console.log("Survey:", survey);
        SurveyActions.showAlert("Survey logged in your Dev console", AlertTypes.INFO);
    },
    /**
     * Returns the index of the block 
     * @param id - id of the block
     */
    getBlockIndex(blockId) {
        return this.data.surveyData.findIndex(b => b.get('id') === blockId);
    },
    /**
     * Returns the index of a question in a block
     * @param id - id of the question
     * @param block - obj (Immutable.Map) of the container block
     */
    getQuestionIndex(questionId, block) {
        return block.get('questions').findIndex(q => q.get('id') === questionId);
    },
    /**
     * Called when the toggleParam action is called.
     * Toggles the property on the item.
     * @param itemType - type of Item the toggle button is clicked. one of ItemTypes
     * @param itemId - Id of the item for which toggle button is clicked
     * @param toggleName - string name of property that is toggled.
     */
    onToggleParam(itemType, itemId, toggleName) {
        var survey = this.data.surveyData;

        // handle the case when a param on a block is toggled
        if (itemType === ItemTypes.BLOCK) {
            let index = this.getBlockIndex(itemId);
            let newSurvey = survey.update(index, b => b.set(toggleName, !b.get(toggleName)));
            this.updateSurveyData(newSurvey);
        }

        // handle the case when a param on a question is toggled
        else if (itemType === ItemTypes.QUESTION) {
            let blockIndex = this.getBlockIndex(_questionMap.get(itemId));
            let block = survey.get(blockIndex);
            let index = this.getQuestionIndex(itemId, block);
            let newSurvey = survey.updateIn([blockIndex, 'questions', index], q => 
                q.set(toggleName, !q.get(toggleName))
            );
            this.updateSurveyData(newSurvey);
        }

        // throw exception
        else {
            throw new Error("Not a valid item type");
        }
    },
    /**
     * Returns a clone of Question with new ID of itself
     * and all options.
     * @param question - type of Immutable.Map. The question to be cloned
     */
    cloneQuestion(question) {
        var self = this;
        return question
                .set('id', self.getNewId(ItemTypes.QUESTION)) // generate new ID
                .update('options', (list) =>                  // do the same for all options
                            list.map(
                                o => Immutable.Map({
                                    id: self.getNewId(ItemTypes.OPTION),
                                    otext: o.get('otext')
                                })
                            )
                        );
    },
    /**
     * Method called when the itemCopy action is triggered.
     * Responsible for creating a new copy of an ItemType - works only for
     * question and block.
     * @param itemType type of ItemType
     * @param itemId id of the item to be cloned
     */
    onItemCopy(itemType, itemId) {
        var survey = this.data.surveyData;

        if (itemType === ItemTypes.BLOCK) {
            let blockIndex = this.getBlockIndex(itemId);
            let block = survey.get(blockIndex);
            let self = this;
            let newBlock = block.set('id', self.getNewId(ItemTypes.BLOCK))
                            .update('questions', (list) => list.map(ques => self.cloneQuestion(ques)))
            let newSurvey = survey.splice(blockIndex + 1, 0, newBlock);

            // update and cache
            this.updateSurveyData(newSurvey, true);

            // update the maps with the new question and new options
            let blockId = newBlock.get('id');
            newBlock.get('questions').forEach(function(q) {
                var qId = q.get('id');
                _questionMap = _questionMap.set(qId, blockId);

                // set mapping for options
                q.get('options').forEach(function(o) {
                    _optionMap = _optionMap.set(o.get('id'), qId);
                });
            });

            // alert and focus
            SurveyActions.showAlert("Block copied.", AlertTypes.SUCCESS);
            SurveyActions.scrollToItem(newBlock.get('id'));
        }

        else if (itemType === ItemTypes.QUESTION) {
            let blockIndex = this.getBlockIndex(_questionMap.get(itemId));
            let block = survey.get(blockIndex);
            let question = block.get('questions').find(q => q.get('id') === itemId);
            let questionIndex = this.getQuestionIndex(itemId, block);
            let newQuestion = this.cloneQuestion(question);
            let newSurvey = survey.updateIn([blockIndex, 'questions'], list =>
                list.splice(questionIndex + 1, 0, newQuestion)
            );

            // update and cache
            this.updateSurveyData(newSurvey, true);

            // update the maps with new question and new options
            let qId = newQuestion.get('id');
            _questionMap = _questionMap.set(qId, block.get('id'));
            newQuestion.get('options').forEach( o => {
                _optionMap = _optionMap.set(o.get('id'), qId)
            });

            // alert and focus
            SurveyActions.showAlert("Question copied.", AlertTypes.SUCCESS);
            SurveyActions.scrollToItem(newQuestion.get('id'));
        }

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
        var survey = this.data.surveyData;

        // handle block delete
        if (itemType === ItemTypes.BLOCK) {
            let index = this.getBlockIndex(itemId);
            let newSurvey = survey.delete(index);

            this.updateSurveyData(newSurvey, true);

            // delete the mapping of question and options
            survey.getIn([index, 'questions']).forEach(q => {
                _questionMap = _questionMap.delete(q.get('id'));
                q.get('options').forEach(o => {
                    _optionMap = _optionMap.delete(o.get('id'))
                })
            });

            SurveyActions.showAlert("Block deleted successfully.", AlertTypes.SUCCESS);
        }

        // handle question delete
        else if (itemType === ItemTypes.QUESTION) {
            let blockIndex = this.getBlockIndex(_questionMap.get(itemId));
            let block = survey.get(blockIndex);
            let index = this.getQuestionIndex(itemId, block);
            let newSurvey = survey.deleteIn([blockIndex, 'questions', index]);

            // update and cache
            this.updateSurveyData(newSurvey, true);

            // delete the mapping of the question and its options
            _questionMap = _questionMap.delete(itemId);
            block.getIn(['questions', index, 'options']).forEach(o =>
                _optionMap = _optionMap.delete(o.get('id'))
            );

            SurveyActions.showAlert("Question deleted successfully.", AlertTypes.SUCCESS);
        }

        // handle option delete
        else if (itemType === ItemTypes.OPTION) {
            let questionId = _optionMap.get(itemId);
            let blockIndex = this.getBlockIndex(_questionMap.get(questionId));
            let block = survey.get(blockIndex);
            let quesIndex = this.getQuestionIndex(questionId, block);
            let options = block.getIn(['questions', quesIndex, 'options']);
            let optionIndex = options.findIndex(op => op.get('id') === itemId);
            let newSurvey = survey.deleteIn([blockIndex, 'questions', quesIndex, 'options', optionIndex]);

            // delete the mapping
            _optionMap = _optionMap.delete(itemId);
            this.updateSurveyData(newSurvey);
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
        var survey = this.data.surveyData;
        var blockIndex = this.getBlockIndex(_questionMap.get(questionId));
        var block = survey.get(blockIndex);
        var index = this.getQuestionIndex(questionId, block);
        var newSurvey = survey.updateIn([blockIndex, 'questions', index], q => 
            q.set('qtext', text)
        );
        this.updateSurveyData(newSurvey, true);
    },
    /**
     * Called when the undoSurvey action is triggered. Responsible for 
     * setting global state to last _history item.
     */
    onUndoSurvey() {
        // hide the alert
        this.data.alertState = this.data.alertState.set('visible', false);

        // retrieve cached data
        var { data, optionMap, questionMap } = _history.pop();
        _questionMap = Immutable.Map(questionMap);
        _optionMap = Immutable.Map(optionMap);
        this.updateSurveyData(data);
    },
    /**
     * Called when the scrolltoItem action is triggered. Scrolls the item
     * into view
     * @param id - id of the item that needs to be scrolled to
     */
    onScrollToItem(id) {
        window.location.hash = id;
    },
    onUpdateOptionGroup(id) {
        this.data.optionGroupState = this.data.optionGroupState.set('selectedID', id);
        this.trigger(this.data);
    }
});

module.exports = SurveyStore;
