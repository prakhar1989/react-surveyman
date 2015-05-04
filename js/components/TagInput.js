var React = require('React');

var Tags = React.createClass({
    componentDidMount: function() {
        this.refs.input.getDOMNode().focus();
    },
    getInitialState: function() {
        return {
            tags: this.props.tags
        }
    },
    handleInput: function(e) {
        var tags = this.state.tags;
        if (e.key === "Enter" && e.target.value.trim() != "") {
            tags.push(e.target.value);
            this.refs.input.getDOMNode().value = "";
        }
        this.setState({
            tags: tags
        });
    },
    handleDelete: function(i, e) {
        var tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({
            tags: tags
        });
    },
    handleKeyDown: function(e) {
        // TODO: might be wrong
        var tags = this.state.tags;
        var text = this.refs.input.getDOMNode().value;
        if (e.keyCode === 8 && text == "") {
            this.handleDelete(tags.length - 1);
        }
    },
    render: function() {
        var tagItems = this.state.tags.map(function(item, i) {
            return (
                <span key={i} className="tag">{item}
                   <a className="remove" 
                       onClick={this.handleDelete.bind(this, i)}>x</a>
                </span>
            )
        }.bind(this));
        return ( 
            <div className="tagInput"> {tagItems} 
                <input ref="input" 
                    type="text" 
                    placeholder="Add new tag"
                    onKeyPress={this.handleInput} 
                    onKeyDown={this.handleKeyDown}/>
            </div>
        )
    }
});

module.exports = Tags;
