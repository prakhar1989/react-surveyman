/* Test data to work with */
var data = [
    {   // first block
        id: 1,
        randomizable: true,
        questions: [
            {
                id: 143,
                qtext: "Do you live in the US?",
                options: [
                    { id: 124, otext: "Yes" },
                    { id: 224, otext: "No" }
                ]
            },
            {
                id: 413,
                qtext: "Gender?",
                options: [
                    { id: 540, otext: "Male" },
                    { id: 405, otext: "Female" },
                    { id: 449, otext: "Other" }
                ]
            }
        ]
    },
    {   // second block
        id: 2,
        questions: [
            {
                id: 143,
                qtext: "Which of the following is a 5 letter word?",
                options: [
                    { id: 14, otext: "Orange" },
                    { id: 24, otext: "Banana" },
                    { id: 99, otext: "Apple"},
                    { id: 93, otext: "Peach"}
                ]
            }
        ]
    }
];


module.exports = data;
