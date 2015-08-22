(function() {
    var matrixData = {
        gaussianBlur: [
            [1, 4, 6, 4, 1],
            [4, 16, 24, 16, 4],
            [6, 24, 36, 24, 6],
            [4, 16, 24, 26, 4],
            [1, 4, 6, 4, 1],
        ],
        edge: [
            [2, -1, 2],
            [-1, -4, -1],
            [2, -1, 2],
        ],
        detail: [
            [0, -1, 0],
            [-1, 10, -1],
            [0, -1, 0],
        ],
        sharpen: [
            [-1, -1, -1],
            [-1, 10, -1],
            [-1, -1, -1],
        ]
    };

    function getTwoDimenArray(x, y) {
        var matrix = new Array(x);
        for (var i = 0; i < x; i++) {
            matrix[i] = new Array(y);
        }
        return matrix;
    }


    function matrixFactory(R, G, B, A) {
        this.R = R;
        this.G = G;
        this.B = B;
        this.A = A;
    }


    function toMatrix(pixelData, imageWidth) {
        var matrix = getTwoDimenArray(imageWidth, pixelData.length / 4 / imageWidth);

        for (var i = 0, length = pixelData.length; i < length; i += 4) {
            var y = Math.floor(i / (4 * imageWidth));
            var x = (i / 4) % imageWidth;
            matrix[x][y] = new matrixFactory(pixelData[i], pixelData[i + 1], pixelData[i + 2], pixelData[i + 3]);
        }

        return matrix;
    }

    function decodeMatrix(dataMatrix) {
        var width = dataMatrix.length;
        var height = dataMatrix[0].length;
        var pixelData = new Uint8ClampedArray(width * height * 4);

        var counter = 0;
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                pixelData[counter] = dataMatrix[i][j].R;
                pixelData[counter + 1] = dataMatrix[i][j].G;
                pixelData[counter + 2] = dataMatrix[i][j].B;

                if (dataMatrix[i][j].A == undefined) {
                    pixelData[counter + 3] = 255;
                } else {
                    pixelData[counter + 3] = dataMatrix[i][j].A;
                }

                counter = counter + 4;
            }
        }
        console.log(pixelData);
        return pixelData;
    }

    function calculateByMatrix(dataMatrix, coreMatrix) {
        if (coreMatrix.length % 2 == 0) {
            alert('核矩阵不正确！');
            return;
        }
        var newMatrix = getTwoDimenArray(dataMatrix.length, dataMatrix[0].length);
        var center = (coreMatrix.length - 1) / 2;
        var coreSize = coreMatrix.length;

        var round = Math.round;
        for (var i = 0, ilength = dataMatrix.length; i < ilength; i++) {
            for (var j = 0, jlength = dataMatrix[i].length; j < jlength; j++) {
                var R, G, B;
                var rTotal = 0;
                var gTotal = 0;
                var bTotal = 0;
                var average = 0;
                for (var x = i - center, xlength = i + center, countx = 0; x <= xlength; x++) {
                    for (var y = j - center, ylength = j + center, county = 0; y <= ylength; y++) {

                        if (x < 0 || y < 0) {
                            continue;
                        }
                        if (x >= dataMatrix.length || y >= dataMatrix[0].length) {
                            continue;
                        }

                        try {
                            rTotal += dataMatrix[x][y].R * coreMatrix[county][countx];
                        } catch (e) {
                            console.log(x, y);
                            window.dataMatrix = dataMatrix;
                        }

                        gTotal += dataMatrix[x][y].G * coreMatrix[county][countx];
                        bTotal += dataMatrix[x][y].B * coreMatrix[county][countx];
                        average += coreMatrix[county][countx];
                        county++;
                    }
                    countx++;
                }
                if (average == 0) {
                    average = 1;
                }
                R = round(rTotal / average);
                G = round(gTotal / average);
                B = round(bTotal / average);
                newMatrix[i][j] = new matrixFactory(R, G, B);
            }
        }

        return newMatrix;
    }

    function gaussianBlur(imageData) {
        var pixel = imageData.data;
        var matrix = toMatrix(pixel, 1080);
        var coreMatrix = matrixData.gaussianBlur;
        var newMatrix = calculateByMatrix(matrix, coreMatrix);
        var newpixel = decodeMatrix(newMatrix);
        for (var i = 0, length = pixel.length; i < length; i += 4) {
            pixel[i] = newpixel[i];
            pixel[i + 1] = newpixel[i + 1];
            pixel[i + 2] = newpixel[i + 2];
            pixel[i + 3] = newpixel[i + 3];
        };
        return;
    }

    function edge(imageData) {
        var pixel = imageData.data;
        var matrix = toMatrix(pixel, 1080);
        var coreMatrix = matrixData.edge;
        var newMatrix = calculateByMatrix(matrix, coreMatrix);
        var newpixel = decodeMatrix(newMatrix);
        for (var i = 0, length = pixel.length; i < length; i += 4) {
            pixel[i] = newpixel[i];
            pixel[i + 1] = newpixel[i + 1];
            pixel[i + 2] = newpixel[i + 2];
            pixel[i + 3] = newpixel[i + 3];
        };
        return;
    }

    function sharpen(imageData) {
        var pixel = imageData.data;
        var matrix = toMatrix(pixel, 1080);
        var coreMatrix = matrixData.sharpen;
        var newMatrix = calculateByMatrix(matrix, coreMatrix);
        var newpixel = decodeMatrix(newMatrix);
        for (var i = 0, length = pixel.length; i < length; i += 4) {
            pixel[i] = newpixel[i];
            pixel[i + 1] = newpixel[i + 1];
            pixel[i + 2] = newpixel[i + 2];
            pixel[i + 3] = newpixel[i + 3];
        };
        return;
    }

    function blackAndWhite(imageData) {
        var pixel = imageData.data;
        for (var i = 0, length = pixel.length; i < length; i += 4) {
            pixel[i + 2] = pixel[i + 1] = pixel[i] = (pixel[i] * 2 + pixel[i + 1] * 5 + pixel[i + 2] * 1) >> 3;
        }
        return;
    }

    function histogramBlance(imageData) {
        var pixel = imageData.data;
        var totalPixel = 0;
        var Ramount = new Array(256),
            Gamount = new Array(256),
            Bamount = new Array(256),
            Rmap = new Array(256),
            Gmap = new Array(256),
            Bmap = new Array(256);
        for (var i = 0; i < 256; i++) {
            Ramount[i] = Gamount[i] = Bamount[i] = Rmap[i] = Gmap[i] = Bmap[i] = 0;
        }
        for (var i = 0, length = pixel.length; i < length; i += 4) {
            Ramount[pixel[i]] += 1;
            Gamount[pixel[i + 1]] += 1;
            Bamount[pixel[i + 2]] += 1;
            totalPixel += 1;
        }

        for (var i = 0; i < 256; i++) {
            var counterR = counterG = counterB = 0;
            for (var j = 0; j <= i; j++) {
                counterR = counterR + Ramount[j];
                counterG = counterG + Gamount[j];
                counterB = counterB + Bamount[j];
            }
            Rmap[i] = Math.round(counterR / totalPixel * 255);
            Gmap[i] = Math.round(counterG / totalPixel * 255);
            Bmap[i] = Math.round(counterB / totalPixel * 255);
        }
        for (var i = 0, length = pixel.length; i < length; i += 4) {
            pixel[i] = Rmap[pixel[i]];
            pixel[i + 1] = Gmap[pixel[i + 1]];
            pixel[i + 2] = Bmap[pixel[i + 2]];
        }
        return;
    }

    function colorFlip(imageData) {
        var pixel = imageData.data;
        for (var i = 0, length = pixel.length; i < length; i += 4) {
            pixel[i] = 225 - pixel[i];
            pixel[i + 1] = 225 - pixel[i + 1];
            pixel[i + 2] = 225 - pixel[i + 2];
        }
        return;
    }



    window.Simage = {
        toMatrix: toMatrix,
        calculateByMatrix: calculateByMatrix,
        decodeMatrix: decodeMatrix,
        gaussianBlur: gaussianBlur,
        edge: edge,
        blackAndWhite: blackAndWhite,
        colorFlip: colorFlip,
        sharpen: sharpen,
        histogramBlance: histogramBlance
    }
})()
