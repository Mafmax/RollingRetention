
import React, { Component } from 'react'

export class Chart extends Component {

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.renderChart();
    }
    render() {
        return (
            <div>
                <canvas id="myCanvas" style={{ background: "white" }}></canvas>
                <legend id="forMyCanvas"></legend>
            </div>
        );
    }



    renderChart() {


        var myCanvas = document.getElementById("myCanvas");
        myCanvas.width = document.documentElement.clientWidth * 0.95;
        myCanvas.height = document.documentElement.clientHeight * 0.5;

        var ctx = myCanvas.getContext("2d");

        function drawLine(ctx, startX, startY, endX, endY, color) {
            ctx.save();
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.restore();
        }

        function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height, color) {
            ctx.save();
            ctx.fillStyle = color;
            ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
            ctx.restore();
        }



        var Barchart = function (options) {
            this.options = options;
            this.canvas = options.canvas;
            this.ctx = this.canvas.getContext("2d");
            this.colors = options.colors;
            let data = this.options.data;
            this.draw = function () {
                let offsetX = 30;
                var maxValue = -1;
                for (var i = 0; i < data.length; i++) {
                    maxValue = Math.max(maxValue, data[i].frequency);
                }
                var canvasActualHeight = this.canvas.height - this.options.padding * 2;
                var canvasActualWidth = this.canvas.width - this.options.padding * 2;

                //drawing the grid lines
                var gridValue = 0;
                while (gridValue <= maxValue) {
                    var gridY = canvasActualHeight * (1 - gridValue / maxValue) + this.options.padding;
                    drawLine(
                        this.ctx,
                        offsetX,
                        gridY,
                        this.canvas.width,
                        gridY,
                        this.options.gridColor
                    );

                    //writing grid markers
                    this.ctx.save();
                    this.ctx.fillStyle = this.options.gridColor;
                    this.ctx.textBaseline = "bottom";
                    this.ctx.font = "bold 10px Arial";
                    this.ctx.fillText(gridValue, offsetX+10, gridY - 2);
                    this.ctx.restore();

                    gridValue += maxValue * 0.05;
                    gridValue = Number(gridValue.toFixed(2));
                }

                //drawing the bars
                var numberOfBars = data.length;
                var barSize = (canvasActualWidth) / numberOfBars;
                barSize = Math.min(canvasActualWidth / 25, barSize);
                for (var i = 0; i < data.length; i++) {
                    var val = data[i].frequency;
                    var barHeight = Math.round(canvasActualHeight * val / maxValue);
                    let upperLeftCornerX = offsetX+10+ this.options.padding + i * barSize;
                    let color = this.colors[i % this.colors.length];
                    drawBar(
                        this.ctx,
                        upperLeftCornerX,
                        this.canvas.height - barHeight - this.options.padding,
                        barSize,
                        barHeight,
                        color
                    );
                    //drawing series name
                    this.ctx.save();
                    this.ctx.textBaseline = "bottom";
                    this.ctx.textAlign = "center";
                    this.ctx.fillStyle = color;
                    this.ctx.font = "bold 14px Arial";
                    if (data[i].frequency > 0) {

                        this.ctx.fillText(data[i].value, upperLeftCornerX + barSize / 2, this.canvas.height - this.options.padding / 2);

                    this.ctx.fillStyle = "#000000";
                        this.ctx.fillText(data[i].frequency, upperLeftCornerX + barSize / 2, this.canvas.height - this.options.padding - barHeight);
                    }
                    this.ctx.restore();
                }
                this.ctx.save();
                this.ctx.textBaseline = "bottom";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "#000000";
                this.ctx.font = "bold 14px Arial";
                    this.ctx.fillText("Life Cycle", canvasActualWidth/2, this.canvas.height );
                this.ctx.restore();

                this.ctx.save();
                this.ctx.textBaseline = "bottom";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "#000000";
                this.ctx.font = "bold 14px Arial";
                ctx.font = '20px/1 sans-serif';
                ctx.textAlign = "center";
                var str = "Frequency";
                for (var i = 0; i < str.length; i++) {
                    ctx.fillText(str[i], 10, 80+20 * (i + 1));
                }
                this.ctx.restore();


            }
        }


        var myBarchart = new Barchart(
            {
                canvas: myCanvas,
                seriesName: "Life distribution",
                padding: 30,
                gridColor: "#888888",
                data: this.props.data,
                colors: ["#a55ca5"]
            }
        );
        myBarchart.draw();
    }












}