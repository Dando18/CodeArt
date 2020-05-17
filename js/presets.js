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
        name: 'Rainbow (HSL)',
        hue: 'return (i + j) % 360;',
        saturation: 'return (i + j) / (width + height) * 100;',
        lightness: 'let cx = (width / 2);\nlet cy = (height / 2);\nlet dist = Math.sqrt((i-cy)*(i-cy)+(j-cx)*(j-cx));\nlet maxDist = Math.sqrt(width*width + height*height) / 2;\n\nreturn 100 * (1 - dist/maxDist);',
        preferredSize: {
            width: 512,
            height: 512
        },
        parameters: [],
        mode: 'HSL',
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
        preferredSize: {
            width: 1024,
            height: 1024,
        },
        mode: 'RGB',
    },
    {
        name: 'Simple Mandelbrot (HSV)',
        hue: 'let x0 = (j / width) * 3 - 2;\nlet y0 = ((height-i) / height) * 2.0 - 1.0;\nlet x = 0, y = 0, iter = 0, max_iter = 100;\n\nwhile (x*x + y*y <= 4 && iter < max_iter) {\n  let tmp = x*x - y*y + x0;\n  y = 2*x*y + y0;\n  x = tmp;\n  iter += 1;\n}\n\nif (iter >= max_iter) {\n  iter = max_iter;\n} else {\n  iter += 2 - Math.log(Math.log(x*x + y*y)) / Math.log(2);\n}\nglobals.value = (iter < max_iter) ? 100 : 0;\nreturn 255 * (iter / max_iter);\n',
        saturation: 'return 100;',
        value: 'return globals.value;',
        preferredSize: {
            width: 1024,
            height: 1024,
        },
        parameters: [],
        mode: 'HSV',
    },
    {
        name: 'Julia Set',
        red: 'let R = 4, n = 2;\nlet cx = 0.285, cy = 0.0;\n\nlet r0 = 54, r1 = 128;\n\nR = Math.ceil(Math.pow(Math.sqrt(cx*cx + cy*cy) + R, 1/n) + 1);\n\nlet x = (j/width) * (2*R) - R;\nlet y = ((height-i)/height) * (2*R) - R;\n\nlet iter = 0, max_iter = 100;\n\nwhile (x*x + y*y < R*R && iter < max_iter) {\n\n  let tmp = Math.pow(x*x + y*y, n/2) * Math.cos(n * Math.atan2(y, x)) + cx;\n  y = Math.pow(x*x + y*y, n/2) * Math.sin(n * Math.atan2(y, x)) + cy;\n  x = tmp;\n\n  iter += 1;\n}\n\nlet retval = 0;\nif (iter >= max_iter) {\n  retval = 0;\n} else {\n  iter += 2 - Math.log(Math.log(x*x + y*y)) / Math.log(2);\n  let col = (iter / max_iter);\n  col = Math.tanh(n * col) / Math.tanh(n);\n  retval = col;\n}\nglobals.last = retval;\nreturn (retval*r0) + ((1-retval)*r1);',
        green: '\nlet g0 = 5, g1 = 212;\nreturn (globals.last*g0) + ((1-globals.last)*g1);',
        blue: 'let b0 = 156, b1 = 187;\nreturn (globals.last*b0) + ((1-globals.last)*b1);',
        preferredSize: {
            width: 1024,
            height: 1024,
        },
        mode: 'RGB',
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
    {
        name: 'Eye Sore',
        mode: 'RGB',
        red: 'let r = 10.0, disp = 30.0;\nlet x = j - width/2.0, y = height/2.0 - i;\nlet cx = Math.round(x / disp) * disp + params.offset;\nlet cy = Math.round(y / disp) * disp + params.offset;\n\nlet lhs = (x-cx)*(x-cx) + (y-cy)*(y-cy);\n\nif (lhs <= r*r) {\n  return 255;\n} else {\n  return 0;\n}',
        green: 'let r = 10.0, disp = 30.0;\nlet x = j - width/2.0, y = height/2.0 - i;\nlet cx = Math.round(x / disp) * disp - params.offset;\nlet cy = Math.round(y / disp) * disp + params.offset;\n\nlet lhs = (x-cx)*(x-cx) + (y-cy)*(y-cy);\n\nif (lhs <= r*r) {\n  return 255;\n} else {\n  return 0;\n}',
        blue: 'let r = 10.0, disp = 30.0;\nlet x = j - width/2.0, y = height/2.0 - i;\nlet cx = Math.round(x / disp) * disp;\nlet cy = Math.round(y / disp) * disp - params.offset;\n\nlet lhs = (x-cx)*(x-cx) + (y-cy)*(y-cy);\n\nif (lhs <= r*r) {\n  return 255;\n} else {\n  return 0;\n}',
        preferredSize: {
            width: 512,
            height: 512
        },
        parameters: [
            {
                name: 'offset',
                val: '3',
                min: '0',
                max: '10',
                step: '1',
            },
        ],
    },
    {
        name: 'Picnic Blanket',
        red: 'let s = 3 / (i + 99);\n\nlet y = (i + Math.sin((j*j + Math.pow(i-700,2)*5)/100/width) * 35) * s;\n\nlet l = Math.floor( (j + width)*s + y ) % 2;\nlet r = Math.floor( (height*2 - j)*s + y ) % 2;\nreturn (l + r) * 127;',
        green: 'let s = 3 / (i + 99);\n\nlet y = (i + Math.sin((j*j + Math.pow(i-700,2)*5)/100/width) * 35) * s;\n\nlet l = Math.floor( 5*((j + height)*s + y) ) % 2;\nlet r = Math.floor( 5*((height*2 - j)*s + y) ) % 2;\nreturn (l + r) * 127;',
        blue: 'let s = 3 / (i + 99);\n\nlet y = (i + Math.sin((j*j + Math.pow(i-700,2)*5)/100/width) * 35) * s;\n\nlet l = Math.floor( 29*((j + height)*s + y) ) % 2;\nlet r = Math.floor( 29*((height*2 - j)*s + y) ) % 2;\nreturn (l + r) * 127;',
        preferredSize: {
            width: 1024,
            height: 1024
        },
        parameters: [],
        mode: 'RGB',
    },
    {
        name: 'Painting',
        red: 'if (i == 0 && j == 0 ) {\n  globals.rcache = new Array(height);\n  for (let k = 0; k < globals.rcache.length; k++) {\n    globals.rcache[k] = new Array(width);\n    for (let l = 0; l < globals.rcache[k].length; l++)\n      globals.rcache[k][l] = 0;\n  }\n}\n\nif ( globals.rcache[i][j] != 0) {\n  return globals.rcache[i][j];\n} else {\n  if ( Math.random() < params.prob ) {\n    globals.rcache[i][j] = Math.floor(Math.random() * 256);\n    return globals.rcache[i][j];\n  } else {\n    globals.rcache[i][j] = funcs.red(\n      (i + Math.floor(Math.random()*params.rad)+params.c) % height,\n      (j + Math.floor(Math.random()*params.rad)+params.c) % width,\n      width, height, globals, params, funcs\n    );\n    return globals.rcache[i][j];\n  }\n}',
        green: 'if (i == 0 && j == 0 ) {\n  globals.gcache = new Array(height);\n  for (let k = 0; k < globals.gcache.length; k++) {\n    globals.gcache[k] = new Array(width);\n    for (let l = 0; l < globals.gcache[k].length; l++)\n      globals.gcache[k][l] = 0;\n  }\n}\n\nif ( globals.gcache[i][j] != 0) {\n  return globals.gcache[i][j];\n} else {\n  if ( Math.random() < params.prob ) {\n    globals.gcache[i][j] = Math.floor(Math.random() * 256);\n    return globals.gcache[i][j];\n  } else {\n    globals.gcache[i][j] = funcs.green(\n      (i + Math.floor(Math.random()*params.rad)+params.c) % height,\n      (j + Math.floor(Math.random()*params.rad)+params.c) % width,\n      width, height, globals, params, funcs\n    );\n    return globals.gcache[i][j];\n  }\n}',
        blue: 'if (i == 0 && j == 0 ) {\n  globals.bcache = new Array(height);\n  for (let k = 0; k < globals.bcache.length; k++) {\n    globals.bcache[k] = new Array(width);\n    for (let l = 0; l < globals.bcache[k].length; l++)\n      globals.bcache[k][l] = 0;\n  }\n}\n\nif ( globals.bcache[i][j] != 0) {\n  return globals.bcache[i][j];\n} else {\n  if ( Math.random() < params.prob ) {\n    globals.bcache[i][j] = Math.floor(Math.random() * 256);\n    return globals.bcache[i][j];\n  } else {\n    globals.bcache[i][j] = funcs.blue(\n      (i + Math.floor(Math.random()*params.rad)+params.c) % height,\n      (j + Math.floor(Math.random()*params.rad)+params.c) % width,\n      width, height, globals, params, funcs\n    );\n    return globals.bcache[i][j];\n  }\n}',
        preferredSize: {
            width: 1024,
            height: 1024
        },
        parameters: [
            {
                name: 'prob',
                val: '0.01',
                min: '0',
                max: '1',
                step: '0.01'
            },
            {
                name: 'rad',
                val: '5',
                min: '2',
                max: '10',
                step: '1'
            },
            {
                name: 'c',
                val: '1020',
                min: '0',
                max: '1024',
                step: '10'
            },
        ],
        mode: 'RGB',
    },
    {
        name: 'Smileys',
        red: 'return (funcs.blue(i, j, width, height, globals) != 0) ? ((j / 28)*15 + (i / 28)*15) : 0;',
        green: 'return (funcs.blue(i, j, width, height, globals) != 0) ? ((j / 28)*32 + (i / 28)*10) : 0;',
        blue: "if (i == 0 && j == 0) {\n  globals.buf = [0, \n          BigInt('0xFFE000FFF00000F8'),\nBigInt('0x7FFFF007FFFF007F'), BigInt('0x80FDFBF80FFFFF00'), BigInt('0xFF81FDFBF80F9F9F'), BigInt('0xFFFFC3FFFFFC1FFF'), BigInt('0x3FFFFFC3FFFFFC3F'), BigInt('0x781EFFF783FFFFF8'), BigInt('0xFFF00F3FCF80E7FE'), BigInt('0x7F0FF007E43F00FD'), BigInt('0x3FC0001FFF800'),\n0x1F00,0];\n\n}\n\nlet x = j % 28;\nlet y = i % 28;\n\nlet b = y*28 + x;\n\nlet l = globals.buf[Math.floor(b / 64)];\nlet r = ( Math.pow(2, b % 64) );\nreturn (BigInt(l) & BigInt(r)) ? 128 : 0;",
        preferredSize: {
            width: 1024,
            height: 1024,
        },
        parameters: [],
        mode: 'RGB',
    },
    {
        name: 'Heart',
        red: 'let min = -4, max = 4;\nlet x = (j / width) * (max-min) + min;\nlet y = ((height-i)/height) * (max-min) + min;\n\nlet r = Math.sqrt(x*x + y*y);\nlet cos_t = (x/r), sin_t = (y/r);\n\nlet rhs = 2 - 2*sin_t + sin_t*(Math.sqrt(Math.abs(cos_t)) / (sin_t + 1.4));\n\nreturn (r < rhs) ? 255 : 0;',
        green: 'return 0;',
        blue: 'return 0;',
        preferredSize: {
            width: 512,
            height: 512
        },
        parameters: [],
        mode: 'RGB',
    },
    {
        name: 'Hearts',
        red: 'let min = -32, max = 32;\nlet x = (j / width) * (max-min) + min;\nlet y = ((height-i)/height) * (max-min) + min;\n\nlet disp = 8;\nlet cx = Math.round(x / disp) * disp;\nlet cy = Math.round(y / disp) * disp;\n\nlet r = Math.sqrt((x-cx)*(x-cx) + (y-cy)*(y-cy));\nlet cos_t = ((x-cx)/r), sin_t = ((y-cy)/r);\n\nlet rhs = 2 - 2*sin_t + sin_t*(Math.sqrt(Math.abs(cos_t)) / (sin_t + 1.4));\n\nreturn (r < rhs) ? 255 : 0;',
        green: 'return 0;',
        blue: 'let min = -32, max = 32;\nlet x = (j / width) * (max-min) + min + 1.25;\nlet y = ((height-i)/height) * (max-min) + min - 1.25;\n\nlet disp = 8;\nlet cx = Math.round(x / disp) * disp;\nlet cy = Math.round(y / disp) * disp;\n\nlet r = Math.sqrt((x-cx)*(x-cx) + (y-cy)*(y-cy));\nlet cos_t = ((x-cx)/r), sin_t = ((y-cy)/r);\n\nlet rhs = 2 - 2*sin_t + sin_t*(Math.sqrt(Math.abs(cos_t)) / (sin_t + 1.4));\n\nreturn (r < rhs) ? 255 : 0;',
        preferredSize: {
            'width': 512,
            'height': 512
        },
        parameters: [],
        mode: 'RGB',
    },
    {
        name: 'Sierpinski',
        red: 'let x = j;\nlet y = i;\n\nlet wh = 255 - (( (width-x) & (height-y) ) * 128);\n\nreturn (255 - ((x & y) * 128)) & wh',
        green: 'let x = width-j;\nlet y = i;\n\nlet wh = 255 - (( (x) & (height-y) ) * 128);\n\nreturn (255 - ((x & y) * 128)) & wh;',
        blue: 'let x = j;\nlet y = height-i;\n\nlet wh = 255 - (( (width-x) & (y) ) * 128);\n\nreturn (255 - ((x & y) * 128)) & wh;',
        preferredSize: {
            width: 1024,
            height: 1024,
        },
        parameters: [],
        mode: 'RGB',
    },
    {
        name: 'Cross',
        red: 'let inCross = ((i > height/4) && (i < 2*height/5) && (j > width/8) && (j < 7*width/8)) || ((j > 2.1*height/5) && (j < 2.9*height/5));\n\nlet distFromSun = Math.sqrt((i*i) + (j-width)*(j-width));\nlet inSun = (distFromSun < 75);\nlet diagonal = Math.sqrt((width*width)+(height*height));\nlet tintScale = distFromSun / diagonal;\nlet tint = 60 * tintScale;\n\nlet gx = width/2-75, gy = height+550, gr = width*1.2;\nlet inGround = (Math.sqrt((i-gy)*(i-gy) + (j-gx)*(j-gx)) <= gr);\n\nlet retval = 0;\nif (inGround) {\n  retval = 0;\n} else if (inCross) {\n  retval = 139;\n} else if (inSun) {\n  retval = 255;\n} else {\n  retval = 135;\n}\nreturn retval - tint;',
        green: 'let inCross = ((i > height/4) && (i < 2*height/5) && (j > width/8) && (j < 7*width/8)) || ((j > 2.1*height/5) && (j < 2.9*height/5));\n\nlet distFromSun = Math.sqrt((i*i) + (j-width)*(j-width));\nlet inSun = (distFromSun < 75);\nlet diagonal = Math.sqrt((width*width)+(height*height));\nlet tintScale = distFromSun / diagonal;\nlet tint = 60 * tintScale;\n\nlet gx = width/2-75, gy = height+550, gr = width*1.2;\nlet inGround = (Math.sqrt((i-gy)*(i-gy) + (j-gx)*(j-gx)) <= gr);\n\nlet retval = 0;\nif (inGround) {\n  retval = 255;\n} else if (inCross) {\n  retval = 69;\n} else if (inSun) {\n  retval = 255;\n} else {\n  retval = 206;\n}\nreturn retval - tint;',
        blue: 'let inCross = ((i > height/4) && (i < 2*height/5) && (j > width/8) && (j < 7*width/8)) || ((j > 2.1*height/5) && (j < 2.9*height/5));\n\nlet distFromSun = Math.sqrt((i*i) + (j-width)*(j-width));\nlet inSun = (distFromSun < 75);\nlet diagonal = Math.sqrt((width*width)+(height*height));\nlet tintScale = distFromSun / diagonal;\nlet tint = 60 * tintScale;\n\nlet gx = width/2-75, gy = height+550, gr = width*1.2;\nlet inGround = (Math.sqrt((i-gy)*(i-gy) + (j-gx)*(j-gx)) <= gr);\n\nlet retval = 0;\nif (inGround) {\n  retval = 0;\n} else if (inCross) {\n  retval = 19;\n} else if (inSun) {\n  retval = 0;\n} else {\n  retval = 235;\n}\nreturn retval - tint;',
        preferredSize: {
            width: 512,
            height: 512
        },
        parameters: [],
        mode: 'RGB',
    }
];