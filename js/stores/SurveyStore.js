var Reflux = require('reflux');
var initialData = require('../data.js');
var SurveyActions = require('../actions/SurveyActions');
var ItemTypes = require('../components/ItemTypes');
var Immutable = require('immutable');
var AlertTypes = require('../components/AlertTypes');

// a set of option texts - helps in generating suggestions
var _optionsSet = Immutable.OrderedSet();

// initialize question, option, block maps that will help in
// faster retrieval of associated blocks and questions.
var _questionMap = Immutable.Map();     // questionId => blockId
var _optionMap = Immutable.Map();       // optionId   => questionId
var _blockMap = Immutable.Map();        // subblockId => blockid

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
        var initOptionsData = Immutable.fromJS([
            { id: 0, optionLabels: ["Yes", "No"] },
            { id: 1, optionLabels: ["True", "False"] },
            { id: 2, optionLabels: ["Strongly Disagree", "Disagree", "Neither agree or disagree","Agree", "Strongly Agree"] }
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
    /**
     * Returns the id of the block which has the
     * question with questionId
     * @param questionId
     */
    getBlockId(questionId) {
        return _questionMap.get(questionId)
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
    getBlockPath(blockID, survey, blockMap = _blockMap) {
        // function that returns a chain of IDs from the root block
        // to the block with id - id
        var getIDsList = function getIDsList(id, path = []) {
            if (!blockMap.has(id)) {
                return path.concat([id]).reverse()
            }
            return getIDsList(blockMap.get(id), path.concat([id]));
        };

        // function that returns the index of block id within the list of blocks
        var getIndex = (id, list) => list.findIndex(b => b.get('id') === id);

        // initialize path with index of root node
        var [rootID, ...restIDs] = getIDsList(blockID);
        var path = [getIndex(rootID, survey)];

        // reduce over the rest of ids by finding id at each level
        // and changing path accordingly
        return restIDs.reduce((path, id) => {
            var path = path.concat(['subblocks']);
            var index = getIndex(id, survey.getIn(path));
            return path.concat([index]);
        }, path);
    },
    getQuestionPath(questionID, survey, questionMap = _questionMap) {
        var blockPath = this.getBlockPath(questionMap.get(questionID), survey);
        var index = survey.getIn([...blockPath, 'questions']).findIndex(q => q.get('id') === questionID);
        return [...blockPath, 'questions', index];
    },
    /**
     * Runs when the blockDropped action is called by the view.
     * Adds a new block to the end of the survey object.
     * @param targetID: targetId of the target on which the block is dropped.
     * If this is undefined, then block is assumed to have dropped on the survey
     */
    onBlockDropped(targetID) {
        var survey = this.data.surveyData;
        var newBlock = Immutable.fromJS({
            id: this.getNewId(ItemTypes.BLOCK),
            questions: [],
            subblocks: [],
            randomize: true
        });

        if (targetID === undefined) {
            // block is dropped on the survey
            let newSurvey = survey.splice(0, 0, newBlock);

            // update and cache
            this.updateSurveyData(newSurvey, true);
            SurveyActions.showAlert("New block added.", AlertTypes.SUCCESS);
        } else {
            let blockPath = this.getBlockPath(targetID, survey)
            let newSurvey = survey.updateIn([...blockPath, 'subblocks'],
                list => list.splice(0, 0, newBlock)
            );
            this.updateSurveyData(newSurvey, true);

            // update block map with new subblock
            _blockMap = _blockMap.set(newBlock.get('id'), targetID);
            SurveyActions.showAlert("New subblock added.", AlertTypes.SUCCESS);
        }
    },
    /**
     * Runs when the optiongroup is dropped on a question
     * @param questionId - ID of the question on which
     * the option group is dropped
     */
    onOptionGroupDropped(questionId) {
        var selectedID = this.data.optionGroupState.get('selectedID');
        var optionLabels = this.data.optionGroupState
                                .getIn(['options', selectedID, 'optionLabels']);
        optionLabels.forEach(op => this.onOptionAdded(questionId, op));
    },
    /**
     * Runs when the questionDropped action is called by the view.
     * Adds a question to the block who's id is provided as param
     * @param questionObj A POJO containing data the for the new question.
     * with the following keys - parentID, qtext, config
     */
    onQuestionDropped(questionObj) {
        var survey = this.data.surveyData;

        var newQuestion = Immutable.fromJS({
            id: this.getNewId(ItemTypes.QUESTION),
            qtext: questionObj.qtext,
            options: [],
            ordering: questionObj.ordering,
            freetext: questionObj.freetext,
            exclusive: questionObj.exclusive
        });

        var blockPath = this.getBlockPath(questionObj.parentID, survey);
        var newSurvey = survey.updateIn([...blockPath, 'questions'],
            list => list.splice(0, 0, newQuestion)
        );

        // update and cache
        this.updateSurveyData(newSurvey, true);

        // update question map with new question
        var block = survey.getIn(blockPath);
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
        var questionPath = this.getQuestionPath(questionId, survey);
        var newSurvey = survey.updateIn([...questionPath, 'options'],
            list => list.push(newOption)
        );

        // update the option map and options set
        _optionMap = _optionMap.set(newOption.get('id'), questionId);
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
     * Returns an array of indices that can be directly go in first arguments to Immutable deep persistent functions.
     * @param blockId - id of the block who's index is required
     * @param parentBlock (optional) - The parent block at which to begin the search. If left out, the search starts from the top of the survey
     * within the `parentBlock`
     */
    getBlockIndex(blockId, parentBlock = false) {
        // find in the survey
        if (!parentBlock) {
            return this.data.surveyData.findIndex(b => b.get('id') === blockId);
        } else {
            return parentBlock.get('subblocks').findIndex(b => b.get('id') === blockId);
        }
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
            let blockPath = this.getBlockPath(itemId, survey);
            let newSurvey = survey.updateIn(blockPath,
                b => b.set(toggleName, !b.get(toggleName))
            );
            this.updateSurveyData(newSurvey);
        }

        // handle the case when a param on a question is toggled
        else if (itemType === ItemTypes.QUESTION) {
            let questionPath = this.getQuestionPath(itemId, survey);
            let newSurvey = survey.updateIn(questionPath,
                q => q.set(toggleName, !q.get(toggleName))
            );
            this.updateSurveyData(newSurvey);
        }

        // throw exception
        else {
            throw new Error("Not a valid item type");
        }
    },
    /**
     * Returns a clone of Question passed as a parameter.
     * Updates _optionMap with all new options
     * @param question - type of Immutable.Map. The question to be cloned
     */
    cloneQuestion(question) {
        var self = this;
        var newQuestion = question
                .set('id', self.getNewId(ItemTypes.QUESTION)) // generate new ID
                .update('options', (list) =>                  // do the same for all options
                            list.map(
                                o => Immutable.Map({
                                    id: self.getNewId(ItemTypes.OPTION),
                                    otext: o.get('otext')
                                })
                            )
                        );
        var qId = newQuestion.get('id');
        newQuestion.get('options').forEach(o => {
            _optionMap = _optionMap.set(o.get('id'), qId)
        });
        return newQuestion;
    },
    /**
     * Returns a clone of Block passed as a parameter.
     * Updates _blockMap and _questionMap with the new subblocks and questions
     * @param block - type of Immutable.Map. The block to be cloned.
     */
    cloneBlock(block) {
        var self = this;
        var newBlock = block
            .set('id', self.getNewId(ItemTypes.BLOCK))
            .update('questions', (list) => list.map(ques => self.cloneQuestion(ques)))
            .update('subblocks', (list) => list.map(blk => self.cloneBlock(blk)));

        var blockId = newBlock.get('id');

        newBlock.get('questions').forEach(q => {
            _questionMap = _questionMap.set(q.get('id'), blockId);
        });
        newBlock.get('subblocks').forEach(b => {
            _blockMap = _blockMap.set(b.get('id'), blockId);
        });
        return newBlock;
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
            let blockPath = this.getBlockPath(itemId, survey);
            let blockIndex = blockPath[blockPath.length - 1];
            let newBlock = this.cloneBlock(survey.getIn(blockPath));
            let newSurvey;
            if (_blockMap.has(itemId)) { // if subblock, append in parent
                let parentId = _blockMap.get(itemId);
                let parentblockPath = this.getBlockPath(parentId, survey);
                newSurvey = survey.updateIn([...parentblockPath, 'subblocks'],
                    list => list.splice(blockIndex + 1, 0, newBlock)
                );
                _blockMap = _blockMap.set(newBlock.get('id'), parentId);
            } else { // else simply put in survey array
                newSurvey = survey.splice(blockIndex + 1, 0, newBlock);
            }

            // update
            this.updateSurveyData(newSurvey, false);

            // alert and focus
            SurveyActions.showAlert("Block copied.", AlertTypes.INFO);
            SurveyActions.scrollToItem(newBlock.get('id'));
        }

        else if (itemType === ItemTypes.QUESTION) {
            let questionPath = this.getQuestionPath(itemId, survey);
            let questionIndex = questionPath[questionPath.length - 1];
            let newQuestion = this.cloneQuestion(survey.getIn(questionPath));
            let newSurvey = survey.updateIn(questionPath.slice(0, -1),
                list => list.splice(questionIndex + 1, 0, newQuestion)
            );
            _questionMap = _questionMap.set(newQuestion.get('id'), _questionMap.get(itemId));

            // update and cache
            this.updateSurveyData(newSurvey, false);

            // alert and focus
            SurveyActions.showAlert("Question copied.", AlertTypes.INFO);
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
            let blockPath = this.getBlockPath(itemId, survey);
            let newSurvey = survey.deleteIn(blockPath);

            this.updateSurveyData(newSurvey, true);

            // delete the mapping of question and options
            survey.getIn([...blockPath, 'questions']).forEach(q => {
                _questionMap = _questionMap.delete(q.get('id'));
                q.get('options').forEach(o => {
                    _optionMap = _optionMap.delete(o.get('id'))
                })
            });

            SurveyActions.showAlert("Block deleted successfully.", AlertTypes.SUCCESS);
        }

        // handle question delete
        else if (itemType === ItemTypes.QUESTION) {
            let questionPath = this.getQuestionPath(itemId, survey);
            let newSurvey = survey.deleteIn(questionPath);

            // update and cache
            this.updateSurveyData(newSurvey, true);

            // delete the mapping of the question and its options
            _questionMap = _questionMap.delete(itemId);
            survey.getIn([...questionPath, 'options']).forEach(o => {
                _optionMap = _optionMap.delete(o.get('id'))
            });

            SurveyActions.showAlert("Question deleted successfully.", AlertTypes.SUCCESS);
        }

        // handle option delete
        else if (itemType === ItemTypes.OPTION) {
            let questionPath = this.getQuestionPath(_optionMap.get(itemId), survey);
            let index = survey.getIn([...questionPath, 'options'])
                              .findIndex(op => op.get('id') === itemId);

            let newSurvey = survey.deleteIn([...questionPath, 'options', index]);

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
        var path = this.getQuestionPath(questionId, survey);
        var newSurvey = survey.updateIn(path, q => q.set('qtext', text));
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
    // called when a new optiongroup is selected as the default in the optionlist selectbox
    onUpdateOptionGroup(id) {
        this.data.optionGroupState = this.data.optionGroupState.set('selectedID', id);
        this.trigger(this.data);
    },
    /**
     * @param options - array of options
     */
    onAddOptionGroup(options) {
        var { optionGroupState } = this.data;
        var newId = optionGroupState.get('options').count();
        this.data.optionGroupState = optionGroupState
                                        .set('selectedID', newId)
                                        .updateIn(['options'], list => list.push(
                                            Immutable.Map({id: newId, optionLabels: options})
                                        ));
        this.trigger(this.data);
    },
    onMoveQuestion(questionID, blockID) {
        var survey = this.data.surveyData;
        var currBlockID = _questionMap.get(questionID);

        // if the question is dropped in the same block then do nothing
        if (currBlockID === blockID) return;

        var currBlockIndex = this.getBlockIndex(currBlockID);
        var newBlockIndex = this.getBlockIndex(blockID);

        var currBlock = survey.get(currBlockIndex);
        var index = this.getQuestionIndex(questionID, currBlock);
        var question = survey.getIn([currBlockIndex, 'questions', index]);

        // delete the question
        var newSurvey = survey
                            .deleteIn([currBlockIndex, 'questions', index])
                            .updateIn([newBlockIndex, 'questions'], list => list.push(question));

        // update and cache
        this.updateSurveyData(newSurvey, true);

        // update the mappings of the question
        _questionMap = _questionMap.set(questionID, blockID);

        SurveyActions.showAlert("Question moved.", AlertTypes.SUCCESS);
    },
    /**
     * Called when an item is dragged to be re-ordered in the treeview.
     * This works on the assumption that the item is ordered within its parent container.
     * @param draggedItemId: id of the block being dragged
     * @param finalIndex: final location where the item needs to be moved to within the container
     */
    onReorderItem(draggedItemId, finalIndex, itemType) {
        var survey = this.data.surveyData;

        if (itemType === ItemTypes.BLOCK) {
            let draggedBlockIndex = this.getBlockIndex(draggedItemId);
            let block = survey.get(draggedBlockIndex);
            let newSurvey = survey.delete(draggedBlockIndex).splice(finalIndex, 0, block);
            this.updateSurveyData(newSurvey, false);
        }
        else if (itemType === ItemTypes.QUESTION) {
            let draggedBlockId = _questionMap.get(draggedItemId);
            let draggedBlockIndex = this.getBlockIndex(draggedBlockId);
            let block = survey.get(draggedBlockIndex);
            let draggedQuestionIndex = this.getQuestionIndex(draggedItemId, block);
            let draggedQuestion = block.getIn(['questions', draggedQuestionIndex]);
            let newSurvey = survey.updateIn([draggedBlockIndex, 'questions'],
              (questions) => questions.delete(draggedQuestionIndex)
                                      .splice(finalIndex, 0, draggedQuestion)
            );
            this.updateSurveyData(newSurvey, false);
        }
        else {
          throw new ('Invalid item type');
        }
    }
});

module.exports = SurveyStore;
