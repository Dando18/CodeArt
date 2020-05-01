const PRESETS = [
    {
        name: 'Rainbow',
        red: 'return 255 * (height - i)/height;',
        green: 'return 255 * (width - j)/width;',
        blue: 'return 255 * j/width;',
        alpha: 'return 255;',
        preferredSize: {
            width: 512,
            height: 512,
        },
    },
    {
        name: 'Digital Triangles',
        red: 'return j ^ (i-j) ^ i;',
        green: 'return (i - height)^2 + (j - width)^2;',
        blue: 'return i ^ (i-j) ^ j',
        alpha: 'return 255;',
        preferredSize: {
            width: 1024,
            height: 1024,
        },
    },
    {
        /* FROM -- https://codegolf.stackexchange.com/a/35739/56964 */
        name: 'Mandelbrot',
        red: 'let a = 0, b = 0, c = 0, d = 0, n = 0;\n' +
            'while (c + d < 4 && n < 880) {\n' +
            '  b = 2*a*b + j*(8e-9) - 0.645411;\n' +
            '  a = c - d + i*(8e-9) + 0.356888;\n\n' +
            '  c = a * a;\n' +
            '  d = b * b;\n' +
            '  n += 1;\n' +
            '}\n' +
            'return 255 * Math.pow((n - 80) / 800, 3);',
        green: 'let a = 0, b = 0, c = 0, d = 0, n = 0;\n' +
            'while (c + d < 4 && n < 880) {\n' +
            '  b = 2*a*b + j*(8e-9) - 0.645411;\n' +
            '  a = c - d + i*(8e-9) + 0.356888;\n\n' +
            '  c = a * a;\n' +
            '  d = b * b;\n' +
            '  n += 1;\n' +
            '}\n' +
            'return 255 * Math.pow((n - 80) / 800, 0.7);',
        blue: 'let a = 0, b = 0, c = 0, d = 0, n = 0;\n' +
            'while (c + d < 4 && n < 880) {\n' +
            '  b = 2*a*b + j*(8e-9) - 0.645411;\n' +
            '  a = c - d + i*(8e-9) + 0.356888;\n\n' +
            '  c = a * a;\n' +
            '  d = b * b;\n' +
            '  n += 1;\n' +
            '}\n' +
            'return 255 * Math.pow((n - 80) / 800, 0.5);',
        alpha: 'return 255;',
        preferredSize: {
            width: 1024,
            height: 1024,
        },
    },
    {
        name: 'Colored Waves',
        red: 'let wavelength = height*2;\n' +
            'let amplitude = 255;\n' +
            'let phaseshift = 0;\n\n' +
            'return amplitude * Math.sin((2*Math.PI/wavelength)*i + phaseshift);',
        green: 'let wavelength = (height+width)/4;\n' +
            'let amplitude = 255;\n' +
            'let phaseshift = 0;\n\n' +
            'return amplitude * Math.sin((2*Math.PI/wavelength)*(i + j) + phaseshift);',
        blue: 'let wavelength = width*2;\n' +
            'let amplitude = 255;\n' +
            'let phaseshift = 0;\n\n' +
            'return amplitude * Math.sin((2*Math.PI/wavelength)*j + phaseshift);',
        alpha: 'return 255;',
        preferredSize: {
            width: 512,
            height: 512,
        },
    },
    {
        name: 'Colored Cuts',
        red: 'return (i + j) / 4 % 256;',
        green: 'return (i+ 2*j) / 4 % 256;',
        blue: 'return (2*i + j) / 4 % 256;',
        alpha: 'return 255;',
        preferredSize: {
            width: 1024,
            height: 1024,
        },
    },
    {
        name: 'Sonar',
        red: 'return (i + j) % 256;',
        green: 'return 255 * Math.sin(j * i);',
        blue: 'return (j * i / 4) % 256;',
        alpha: 'return 255;',
        preferredSize: {
            width: 1024,
            height: 1024,
        },
    },
];