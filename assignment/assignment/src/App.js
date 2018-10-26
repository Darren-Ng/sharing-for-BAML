import React, { Component } from 'react';

// Initial data comprising tenor, sortKey, risk and close
// Note: These are hard-coded mappings
const data = [
    { tenor: '1D', sortKey: 1, risk: 1000, close: 5.0 },
    { tenor: '1W', sortKey: 7, risk: 1200, close: 5.3 },
    { tenor: '1M', sortKey: 30, risk: 1400, close: 5.6 },
    { tenor: '3M', sortKey: 90, risk: 1600, close: 5.9 },
    { tenor: '6M', sortKey: 180, risk: 1800, close: 6.2 },
    { tenor: '1Y', sortKey: 365, risk: -1600, close: 6.5 },
    { tenor: '2Y', sortKey: 730, risk: -1400, close: 6.8 },
    { tenor: '5Y', sortKey: 1825, risk: 1600, close: 7.1 },
    { tenor: '10Y', sortKey: 3650, risk: 1800, close: 7.4 },
    { tenor: '20Y', sortKey: 7300, risk: 2000, close: 7.7 }
];

export default class App extends Component {
    //Called immediately after a component is mounted. Setting state here will trigger re-rendering.
    //random will change every 5 seconds
    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 5000);
    }
    
    //Called immediately before a component is destroyed. Perform any necessary cleanup in this method    
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    // Colour settings
    cellStyle(backgroundColor, value) {
        let font_colour = 'black';
        // If the cell is black, change it to white
        if (backgroundColor === 'black') {
            font_colour = 'white';
        }
        // Font should be red if the value is negative
        if (value < 0) {
            font_colour = 'red';
        }
        // Use the background color specified for that cell
        return {
            backgroundColor: backgroundColor,
            color: font_colour,
            'text-align': 'center'
        }
    };

    // Render the entire table
    render() {
        // Store a list of results
        const result = [];
        // For every line of data
        for (let i = 0; i < data.length; i++) {
            // Generate random variable
            const random = parseInt(Math.random() * 200 - 100);
            // Compute NB risk
            const nbRisk = data[i].risk * 5 * random / 1000;
            // Compute live risk
            const liveRisk = data[i].risk + nbRisk;
            // Compute live
            const live = data[i].close + random / 10000;
            // Compute move
            const move = (live - data[i].close) * 10000;
            // Compute live PL
            const livePL = data[i].risk * move;
            // Compute NB PL
            const nbPL = random * 25;
            // Compute PL
            const pl = livePL + nbPL;
            // Add original and computed values as results
            result.push({
                ...data[i], random, nbRisk, liveRisk, live, move, livePL, nbPL, pl
            });
        }

        return (
            // Create a table with margins at the side
            <div class='m-3'>
                <table class='table table-bordered text-right'>
                    <thead style={this.cellStyle('black', 0)}>
                        <th></th>
                        <th>Sort Key</th>
                        <th>Random</th>
                        <th>Risk</th>
                        <th>NB Risk</th>
                        <th>Live Risk</th>
                        <th>Close(%)</th>
                        <th>Live(%)</th>
                        <th>Move(BP)</th>
                        <th>Live PL</th>
                        <th>NB PL</th>
                        <th>PL</th>
                    </thead>
                    <tbody>
                        {result.map((d) => this.renderRow(d))}
                        {this.renderTotal(result)}
                    </tbody>
                </table>
            </div>
        );
    }

    // Display data of every single row
    renderRow(data) {

        return (
            // Create a row of information
            <tr>
                <td style={this.cellStyle('black', 0)}>
                    {data.tenor}
                </td>
                <td style={this.cellStyle('white', 0)}>
                    {this.formatNumber(data.sortKey)}
                </td>
                <td style={this.cellStyle('white', data.random)}>
                    {this.formatNumber(data.random)}
                </td>
                <td style={this.cellStyle('#fdfd96', data.risk)}>
                    {this.formatNumber(data.risk)}
                </td>
                <td style={this.cellStyle('#fdfd96', data.nbRisk)}>
                    {this.formatNumber(data.nbRisk)}
                </td>
                <td style={this.cellStyle('#fdfd96', data.liveRisk)}>
                    {this.formatNumber(data.liveRisk)}
                </td>
                <td style={this.cellStyle('white', 0)}>
                    {this.formatNumber(data.close.toFixed(2))}%
                </td>
                <td style={this.cellStyle('white', 0)}>
                    {this.formatNumber(data.live.toFixed(2))}%
                </td>
                <td style={this.cellStyle('white', data.random)}>
                    {this.formatNumber(data.move.toFixed(2))}
                </td>
                <td style={this.cellStyle('#ffcc99', data.livePL)}>
                    {this.formatNumber(data.livePL.toFixed(0))}
                </td>
                <td style={this.cellStyle('#ffcc99', data.nbPL)}>
                    {this.formatNumber(data.nbPL.toFixed(0))}
                </td>
                <td style={this.cellStyle('#fdfd96', data.pl)}>
                    {this.formatNumber(data.pl.toFixed(0))}
                </td>
            </tr>
        );
    }

    // Calculate the total column
    renderTotal(data) {
        // Initially, everything sums to zero
        let totalRisk = 0;
        let totalNbRisk = 0;
        let totalLiveRisk = 0;
        let totalClose = 0;
        let totalLive = 0;
        let totalMove = 0;
        let totalLivePL = 0;
        let totalNBPL = 0;
        let totalPL = 0;
        // For every row of data
        for (let i = 0; i < data.length; i++) {
            // Accumulate sums across each field
            totalRisk += data[i].risk;
            totalNbRisk += data[i].nbRisk;
            totalLiveRisk += data[i].liveRisk;
            totalClose += data[i].close;
            totalLive += data[i].live;
            totalMove += data[i].move;
            totalLivePL += data[i].livePL;
            totalNBPL += data[i].nbPL;
            totalPL += data[i].pl;
        }
        // Display the data itself
        return (
            // Create only 1 row of information, black background
            <tr>
                <td style={this.cellStyle('black', 0)}>Total</td>
                <td style={this.cellStyle('black', 0)}></td>
                <td style={this.cellStyle('black', 0)}></td>
                <td  style={this.cellStyle('black', totalRisk)}>
                    {this.formatNumber(totalRisk)}
                </td>
                <td style={this.cellStyle('black', totalNbRisk)}>      
                    {this.formatNumber(totalNbRisk)}
                </td>
                <td style={this.cellStyle('black', totalLiveRisk)}>
                    {this.formatNumber(totalLiveRisk)}
                </td>
                <td style={this.cellStyle('black', totalClose / data.length)}>
                    {this.formatNumber((totalClose / data.length).toFixed(2))}{'%'}
                </td>
                <td style={this.cellStyle('black', totalLive / data.length)}>
                    {this.formatNumber((totalLive / data.length).toFixed(2))}{'%'}</td>
                <td style={this.cellStyle('black', totalMove / data.length)}>
                    {this.formatNumber((totalMove / data.length).toFixed(2))}{'%'}
                </td>
                <td style={this.cellStyle('black', totalLivePL)}>
                    {this.formatNumber(totalLivePL.toFixed(0))}
                </td>
                <td style={this.cellStyle('black', totalNBPL)}>
                    {this.formatNumber(totalNBPL.toFixed(0))}
                </td>
                <td style={this.cellStyle('black', totalPL)}>
                    {this.formatNumber(totalPL.toFixed(0))}
                </td>
            </tr>
        );
    }

    // Insert a comma bfore the last 3 digits of any number
    formatNumber = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
