const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math');

test('Should calculate total plus tip', () => {
    const total = calculateTip(10, 0.30);

    expect(total).toBe(13);
});

test('Should calculate total with default tip', () => {
    const total = calculateTip(10);

    expect(total).toBe(11);
});

test('Should convert 32 F to 0 C', () => {
    const celciusTemp = fahrenheitToCelsius(32);
    expect(celciusTemp).toBe(0);
});

test('Should convert 0 C to 32 F', () => {
    const fahrenheitTemp = celsiusToFahrenheit(0)
    expect(fahrenheitTemp).toBe(32);
});

// test('Test async demo', (done) => {
//     setTimeout(() => {
//         expect(1).toBe(2);
//         done();
//     }, 2000);
// });

// test('Should add two numbers', (done) => {
//     add(2, 3).then((sum) => {
//         expect(sum).toBe(5);
//         done();
//     });
// });

// test('Should add two numbers async', async () => {
//     const sum = await add(2, 3);
//     expect(sum).toBe(6);
// });