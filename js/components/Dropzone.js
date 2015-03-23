var ItemTypes = require('./ItemTypes.js');

var Dropzone = React.createClass({
    mixins: [ReactDND.DragDropMixin],
    getInitialState: function() {
        return {
            survey: [],
            newBlockId: 1
        }
    },
    statics: {
        configureDragDrop: function(register) {
            register(ItemTypes.BLOCK, {
                dropTarget: {
                    acceptDrop: function(component, item) {
                        component.incrementBlockId();
                    }
                }
            })
        }
    },
    incrementBlockId: function() {
        console.log("i'm being called");
        this.setState({
            newBlockId: this.state.newBlockId + 1
        });
    },
    render: function() {
        var style = {};

        var dropState = this.getDropState(ItemTypes.BLOCK),
            backgroundColor;

        if (dropState.isHovering) {
            backgroundColor = '#CAD2C5';
        } else if (dropState.isDragging) {
            backgroundColor = '#52796F';
        }
        style.backgroundColor = backgroundColor;

        return (
            <div {...this.dropTargetFor(ItemTypes.BLOCK)}
                style={style}
                className='dropzone'>
            {dropState.isHovering ? 'Release to drop' : 'Drag item here'}
            </div>
        )
    }
});

module.exports = Dropzone;
