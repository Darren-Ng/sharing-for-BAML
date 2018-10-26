'use strict';

// Abstracted class for each row in the table
class Row extends React.Component {

    
    beautify_integers(value) {
        // Round to 2 decimal places if need be
        value = Math.round(value * 100) / 100;
        // For negative values, add surrounding brackets
        if (value < 0) {
            value = '(' + (-1 * value) + ')';
        }
        // Return new value for printing
        return value;
    }

    beautify_decimals(value, percent) {
        // Percentage sign as required
        let percent_sign = '%';
        if (!percent) {
            percent_sign = '';
        }
        // Return new value for printing
        return value.toFixed(2) + percent_sign;   
    }

    beautify(data) {
        // Proceed to beautify data
        let beautified_data = Array.from(this.props.data, function() {});
        for (let i = 0; i < this.props.data.length; i++) {
            // For headers, just copy, no need to process
            // Other than that, some values can be copied over
            if (this.props.is_header || i == 0 || i == 1 || i == 2 || i == 3) {
                beautified_data[i] = this.props.data[i];
            // Some integer values need to be beautified
            } else if (i == 4 || i == 5 || i == 9 || i == 10 || i == 11) {
                beautified_data[i] = this.beautify_integers(this.props.data[i]);
            // Some decimal values need to be beautified with %
            } else if (i == 6 || i == 7) {
                beautified_data[i] = this.beautify_decimals(this.props.data[i], true);
            // And some decimal values without %
            } else if (i == 8) {
                beautified_data[i] = this.beautify_decimals(this.props.data[i], false);
            }
        }
        // Hide the sort key
        beautified_data.splice(1, 1); 
        // Return the result
        return beautified_data;
    }

    render() {
        // Proceed to beautify data
        this.data = this.beautify(this.props.data);
        // Create a list of cells to insert as a row
        let row_cells = Array.from(this.data, function() {});
        for (let i = 0; i < row_cells.length; i++) {
            // Determine colour(s) of each cell
            let cell_colour = 'white', font_colour = 'black';
            // For headers and total, invert the colour
            if (this.props.is_header || this.data[0] == 'Total') {
                cell_colour = 'black';
                font_colour = 'white';
            // Contrast some columns too
            } else if (i == 2 || i == 3 || i == 4 || i == 10) {
                cell_colour = '#fdfd96';
            } else if (i == 8 || i == 9) {
                cell_colour = '#ffcc99';
            }
            // If the original cell has negative value, font is red
            // Note: Sort key is removed, so +1 column offset ...
            if (this.props.data[i + 1] < 0) {
                font_colour = 'red';
            }

            // Show the value
            let value = `${this.data[i]}`;
            // Create a cell and apply appropriate styling
            row_cells[i] = React.createElement('div', {
                style: {
                    backgroundColor: cell_colour,
                    color: font_colour,
                    border: '1px solid black',
                    width: '100px',
                    display: 'inline-block',
                    padding: '2px',
                    height: '30px'
                }
            // And show the value inside
            }, value);
        }

        // Create a container for the row
        return React.createElement('div', null, row_cells);
    }
}

// Abstracted class for the entire table
class Table extends React.Component {

    update_row_details(row_data) {
        // Tenor, Sort Key, Risk and Close are given in row_data

        // Generate Random
        let random_number = -100 + Math.floor(Math.random() * 200)
        // Compute NB Risk
        let nb_risk = random_number * 5 * row_data[2] / 1000
        // Compute Live risk
        let live_risk = row_data[2] + nb_risk
        // Compute Live
        let live = row_data[3] + random_number / 10000
        // Compute Move
        let move = (live - row_data[3]) * 10000
        // Compute Live PL
        let live_pl = row_data[2] * move
        // Compute NB PL
        let nb_pl = random_number * 25
        // Compute PL
        let pl = live_pl + nb_pl
        // Provide what we want for every row data
        return [row_data[0], row_data[1], random_number, 
                row_data[2], nb_risk, live_risk,
                row_data[3], live, move,
                live_pl, nb_pl, pl]
    }

    render() {

        // Process every single row of data first
        let processed_data = Array.from(this.props.data, function() {});
        for (let i = 0; i < this.props.data.length; i++) {
            processed_data[i] = this.update_row_details(this.props.data[i])
        }
        // Sort by the sort key column
        processed_data.sort(function(row1, row2) {
            return row1[1] - row2[1];
        });

        // Create the last total row
        let num_rows = processed_data.length;
        processed_data[num_rows] = Array.from(processed_data[0].length, 
                                              function() {});
        // Non-computable columns
        processed_data[num_rows][0] = 'Total';
        processed_data[num_rows][2] = '-';
        // For every computable column
        for (let i = 3; i < processed_data[0].length; i++) {
            // Find the sum across every row
            processed_data[num_rows][i] = 0;
            for (let j = 0; j < num_rows; j++) {
                processed_data[num_rows][i] += processed_data[j][i]; 
            }
            // For Close/Live/Move, take the average instead
            if (i == 6 || i == 7 || i == 8) {
                processed_data[num_rows][i] /= num_rows;
            }
        }

        // Put every row of data inside a container
        return React.createElement('div', null, 
            // For every single row of processed data
            processed_data.map(function(data) {
                // Create a row with that data
                return React.createElement(Row, {data: data})
            })
        );
    }
}

// Render a new table within the container
function render_table() {
    // Render a header, followed by the table
    ReactDOM.render([
        React.createElement(Row, {data: data.headers, is_header: true }),
        React.createElement(Table, {data: data.data })
    ], document.querySelector('#app_container'));
}
// Initially render a table
render_table()
// Then render a new table again (update Random value) every so often
setInterval(render_table, 5000);