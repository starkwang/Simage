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
        ],
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
                        rTotal += dataMatrix[x][y].R * coreMatrix[county][countx];
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

    function gaussianBlur(imageData, width) {
        var pixel = imageData.data;
        var matrix = toMatrix(pixel, width);
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

    function medianFilter(imageData, width) {
        var pixel = imageData.data;
        var matrix = toMatrix(pixel, width);
        var newMatrix = getTwoDimenArray(matrix.length, matrix[0].length);

        function sortNumber(a, b) {
            return a - b
        }
        for (var x = 0; x < matrix.length; x++) {
            for (var y = 0; y < matrix[x].length; y++) {
                var arr = new Array(8);
                var left = matrix[x - 1] || matrix[x];
                var right = matrix[x + 1] || matrix[x];

                arr[0] = left[y - 1] || matrix[x][y];
                arr[1] = matrix[x][y - 1] || matrix[x][y];
                arr[2] = right[y - 1] || matrix[x][y];
                arr[3] = left[y] || matrix[x][y];
                arr[4] = matrix[x][y] || matrix[x][y];
                arr[5] = right[y] || matrix[x][y];
                arr[6] = left[y + 1] || matrix[x][y];
                arr[7] = matrix[x][y + 1] || matrix[x][y];
                arr[8] = right[y + 1] || matrix[x][y];

                var newR = [arr[0].R, arr[1].R, arr[2].R, arr[3].R, arr[4].R, arr[5].R, arr[6].R, arr[7].R].sort(sortNumber)[4];
                var newG = [arr[0].G, arr[1].G, arr[2].G, arr[3].G, arr[4].G, arr[5].G, arr[6].G, arr[7].G].sort(sortNumber)[4];
                var newB = [arr[0].B, arr[1].B, arr[2].B, arr[3].B, arr[4].B, arr[5].B, arr[6].B, arr[7].B].sort(sortNumber)[4];
                newMatrix[x][y] = new matrixFactory(newR, newG, newB);
            }
        }
        var newpixel = decodeMatrix(newMatrix);
        for (var i = 0, length = pixel.length; i < length; i += 4) {
            pixel[i] = newpixel[i];
            pixel[i + 1] = newpixel[i + 1];
            pixel[i + 2] = newpixel[i + 2];
            pixel[i + 3] = newpixel[i + 3];
        };
        return;
    }

    function edge(imageData, width) {
        var pixel = imageData.data;
        var matrix = toMatrix(pixel, width);
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

    function sharpen(imageData, width) {
        var pixel = imageData.data;
        var matrix = toMatrix(pixel, width);
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

    function histogramBlanceWithColor(imageData) {
        var pixel = imageData.data;
        var hsvData = new Array(pixel.length);
        var Vamount = new Array(256);
        var Vmap = new Array(256);
        var totalPixel = 0;
        for (var i = 0; i < 256; i++) {
            Vamount[i] = 0;
        }
        for (var i = 0, length = pixel.length; i < length; i += 4) {
            var HSV = RGBtoHSV(pixel[i], pixel[i + 1], pixel[i + 2]);
            hsvData[i] = HSV[0];
            hsvData[i + 1] = HSV[1];
            hsvData[i + 2] = HSV[2];
            hsvData[i + 3] = 0;
            Vamount[HSV[2]] += 1;
            totalPixel += 1;
        }
        for (var i = 0; i < 256; i++) {
            var counterV = 0;
            for (var j = 0; j <= i; j++) {
                counterV = counterV + Vamount[j];
            }
            Vmap[i] = Math.round(counterV / totalPixel * 255);
        }
        for (var i = 0, length = hsvData.length; i < length; i += 4) {
            hsvData[i + 2] = Vmap[hsvData[i + 2]];
        }
        for (var i = 0, length = pixel.length; i < length; i += 4) {
            var RGB = HSVtoRGB(hsvData[i], hsvData[i + 1], hsvData[i + 2])
            pixel[i] = RGB[0];
            pixel[i + 1] = RGB[1];
            pixel[i + 2] = RGB[2];
        }
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


    function RGBtoHSV(r, g, b) {
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h, s, v;
        if (max === min) {
            return [0, 0, max];
        }
        if (r === max) {
            h = (g - b) / (max - min);
        }
        if (g === max) {
            h = 2 + (b - r) / (max - min);
        }
        if (b === max) {
            h = 4 + (r - g) / (max - min)
        }
        h = h * 60;
        if (h < 0) {
            h = h + 360;
        }
        v = max;
        s = (max - min) / max;
        return [h, s, v];
    }

    function HSVtoRGB(h, s, v) {
        var max = v;
        var R, G, B;
        if (s === 0) {
            return [max, max, max];
        } else {
            var h = h / 60;
            var i = Math.floor(h);
            var f = h - i;
            var a = v * (1 - s);
            var b = v * (1 - s * f);
            var c = v * (1 - s * (1 - f));
            switch (i) {
                case 0:
                    R = v;
                    G = c;
                    B = a;
                    break;
                case 1:
                    R = b;
                    G = v;
                    B = a;
                    break;
                case 2:
                    R = a;
                    G = v;
                    B = c;
                    break;
                case 3:
                    R = a;
                    G = b;
                    B = v;
                    break;
                case 4:
                    R = c;
                    G = a;
                    B = v;
                    break;
                case 5:
                    R = v;
                    G = a;
                    B = b;
                    break;
            }
            return [R, G, B];
        }

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
        medianFilter: medianFilter,
        histogramBlance: histogramBlance,
        histogramBlanceWithColor: histogramBlanceWithColor
    }
})()
