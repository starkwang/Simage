(function() {
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
                R = round(rTotal / average);
                G = round(gTotal / average);
                B = round(bTotal / average);
                newMatrix[i][j] = new matrixFactory(R, G, B);
            }
        }

        return newMatrix;
    }

    window.Simage = {
        toMatrix: toMatrix,
        calculateByMatrix: calculateByMatrix
    }
})()
