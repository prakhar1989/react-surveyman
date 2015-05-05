var React = require('React');

var Tags = React.createClass({
    componentDidMount: function() {
        this.refs.input.getDOMNode().focus();
    },
    getInitialState: function() {
        return {
            tags: this.props.tags,
            suggestions: this.props.suggestions,
            query: "",
            selectedIndex: 1
        }
    },
    handleDelete: function(i, e) {
        var tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({
            tags: tags,
            query: ""
        });
    },
    handleChange: function(e) {
        this.setState({
            query: e.target.value
        })
    },
    handleKeyDown: function(e) {
        var tags = this.state.tags;
        var input = this.refs.input.getDOMNode();
        var query = this.state.query;
        var selectedIndex = this.state.selectedIndex;

        // when enter is pressed add query to tass
        if (e.keyCode === 13 && query != "") {
            tags.push(query);
            input.value = "";
            this.setState({ tags: tags, query: ""});
        }

        // when backspace key is pressed and query is blank, delete tag
        if (e.keyCode === 8 && query == "") { //
            this.handleDelete(tags.length - 1);
        }

        // up arrow
        if (e.keyCode === 38) {
            e.preventDefault();
        }

        // down arrow
        if (e.keyCode === 40) {
            e.preventDefault();
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


        // get the suggestions for the given query
        var query = this.state.query;
        var selectedIndex = this.state.selectedIndex;

        if (query.trim().length > 1) {
            var suggestions = this.props.suggestions
                .filter(function(item) {
                    return (item.toLowerCase()).search(query) !== -1;
                })
                .map(function(item, i) {
                    return (
                        <li key={i} className={i == selectedIndex ? "active" : ""}>{item}</li>
                    )
                });
        }

        return ( 
            <div className="tags">
                <div className="tagInput"> {tagItems} 
                    <input ref="input" 
                        type="text" 
                        placeholder="Add new tag"
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}/>
                </div>
                <div className="suggestions">
                    <ul> {suggestions} </ul>
                </div>
            </div>
        )
    }
});

/*
React.render(
    <Tags tags={tags} 
        suggestions={fruits} />, 
    document.getElementById("app")
);
*/

module.exports = Tags;
