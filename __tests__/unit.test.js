const functions = require('../code-to-unit-test/unit-test-me.js');

//isPhoneNumber tests
test('valid phone number 1', () => {
    expect(functions.isPhoneNumber('123-456-7890')).toBe(true);
});

test('valid phone number 2', () => {
    expect(functions.isPhoneNumber('123-456-7891')).toBe(true);
});

test('invalid phone number 1', () => {
    expect(functions.isPhoneNumber('1234afdlks-5678')).toBe(false);
});

test('invalid phone number 2', () => {
    expect(functions.isPhoneNumber('1wqfqwwef')).toBe(false);
});

//isEmail tests
test('valid email 1', () => {
    expect(functions.isEmail('test@example.com')).toBe(true);
});

test('valid email 2', () => {
    expect(functions.isEmail('test@hi.com')).toBe(true);
});

test('invalid email 1', () => {
    expect(functions.isEmail('testexample.com')).toBe(false);
});

test('invalid email 2', () => {
    expect(functions.isEmail('blahblahblahsmh')).toBe(false);
});


//isStrongPassword tests
test('strong password 1', () => {
    expect(functions.isStrongPassword('Abcd1234')).toBe(true);
});

test('strong password 2', () => {
    expect(functions.isStrongPassword('Bruh6921')).toBe(true);
});

test('weak password 1', () => {
    expect(functions.isStrongPassword('a')).toBe(false);
});

test('weak password 2', () => {
    expect(functions.isStrongPassword('b')).toBe(false);
});

//isDate tests
test('valid date 1', () => {
    expect(functions.isDate('12/31/2022')).toBe(true);
});

test('valid date 2', () => {
    expect(functions.isDate('6/9/2022')).toBe(true);
});

test('invalid date 1', () => {
    expect(functions.isDate('smh')).toBe(false);
});

test('invalid date 2', () => {
    expect(functions.isDate('busywork')).toBe(false);
});

//isHexColor tests
test('valid hex color 1', () => {
    expect(functions.isHexColor('#F0F')).toBe(true);
});

test('valid hex color 2', () => {
    expect(functions.isHexColor('#F00')).toBe(true);
});

test('invalid hex color 1', () => {
    expect(functions.isHexColor('aaaaaaa')).toBe(false);
});

test('invalid hex color 2', () => {
    expect(functions.isHexColor('useless')).toBe(false);
});