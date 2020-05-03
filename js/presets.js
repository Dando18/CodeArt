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
        mode: 'RGBA',
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
        mode: 'RGB',
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
        mode: 'RGB',
    },
    {
        name: 'Simple Mandelbrot',
        red: 'let x0 = (j / width) * 3 - 2;\n' +
            'let y0 = ((height-i) / height) * 2.0 - 1.0;\n' +
            'let x = 0, y = 0, iter = 0, max_iter = 100;\n\n' +
            'while (x*x + y*y <= 4 && iter < max_iter) {\n' +
            '  let tmp = x*x - y*y + x0;\n' +
            '  y = 2*x*y + y0;\n' +
            '  x = tmp;\n' +
            '  iter += 1;\n' +
            '}\n\n' +
            'let scaled_color = Math.pow((iter / max_iter), 0.25) * 255;\n' +
            'return scaled_color;\n',
        green: 'let x0 = (j / width) * 3 - 2;\n' +
            'let y0 = ((height-i) / height) * 2.0 - 1.0;\n' +
            'let x = 0, y = 0, iter = 0, max_iter = 100;\n\n' +
            'while (x*x + y*y <= 4 && iter < max_iter) {\n' +
            '  let tmp = x*x - y*y + x0;\n' +
            '  y = 2*x*y + y0;\n' +
            '  x = tmp;\n' +
            '  iter += 1;\n' +
            '}\n\n' +
            'let scaled_color = Math.pow((iter / max_iter), 0.25) * 255;\n' +
            'return scaled_color;\n',
        blue: 'return 255;',
        alpha: 'return 255;',
        preferredSize: {
            width: 1024,
            height: 1024,
        },
        mode: 'RGB',
    },
    {
        name: "Julia Set",
        red: "let R = 4, n = 2;\nlet cx = 0.285, cy = 0.0;\n\nlet r0 = 54, r1 = 128;\n\nR = Math.ceil(Math.pow(Math.sqrt(cx*cx + cy*cy) + R, 1/n) + 1);\n\nlet x = (j/width) * (2*R) - R;\nlet y = ((height-i)/height) * (2*R) - R;\n\nlet iter = 0, max_iter = 100;\n\nwhile (x*x + y*y < R*R && iter < max_iter) {\n\n  let tmp = Math.pow(x*x + y*y, n/2) * Math.cos(n * Math.atan2(y, x)) + cx;\n  y = Math.pow(x*x + y*y, n/2) * Math.sin(n * Math.atan2(y, x)) + cy;\n  x = tmp;\n\n  iter += 1;\n}\n\nlet retval = 0;\nif (iter >= max_iter) {\n  retval = 0;\n} else {\n  iter += 2 - Math.log(Math.log(x*x + y*y)) / Math.log(2);\n  let col = (iter / max_iter);\n  col = Math.tanh(n * col) / Math.tanh(n);\n  retval = col;\n}\nglobals.last = retval;\nreturn (retval*r0) + ((1-retval)*r1);",
        green: "\nlet g0 = 5, g1 = 212;\nreturn (globals.last*g0) + ((1-globals.last)*g1);",
        blue: "let b0 = 156, b1 = 187;\nreturn (globals.last*b0) + ((1-globals.last)*b1);",
        alpha: "return 255;",
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
        mode: 'RGB',
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
        mode: 'RGB',
    },
    {
        name: 'Sonar',
        red: 'return (i + j) % 256;',
        green: 'return 255 * Math.sin(j * i);',
        blue: 'return (j * i / 4) % 256;',
        preferredSize: {
            width: 1024,
            height: 1024,
        },
        mode: 'RGB',
    },
];