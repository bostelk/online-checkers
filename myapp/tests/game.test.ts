import { Game } from '../src/game'


describe('test checker valid moves', () => {

    test('test red checker move forward', () => {
        let g = new Game('','','',false,'','','',8,8)

        /**
         * Test the following scenario: red (r) moves forward (m).
         * . r .
         * m . m
         */
        expect(g.validMove([4,2, 3,3])).toBeTruthy()
        expect(g.validMove([4,2, 5,3])).toBeTruthy()
    })

    test('test red checker move backward', () => {
        let g = new Game('','','',false,'','','',8,8)

        // Empty space to move to.
        g.checkers[1] = ['', '', '', '', '', '', '', '', ''],

        /**
         * Test the following scenario: red (r) moves backward (m).
         * m . m
         * . r .
         */
        expect(g.validMove([4,2, 3,1])).toBeFalsy()
        expect(g.validMove([4,2, 5,1])).toBeFalsy()
    })

    test('test black checker move forward', () => {
        let g = new Game('','','',false,'','','',8,8)

        /**
         * Test the following scenario: black (m) moves forward (m).
         * m . m
         * . b .
         */
        expect(g.validMove([3,5, 2,4])).toBeTruthy()
        expect(g.validMove([3,5, 4,4])).toBeTruthy()
    });

    test('test black checker move backward', () => {
        let g = new Game('','','',false,'','','',8,8)

        // Empty space to move to.
        g.checkers[6] = ['', '', '', '', '', '', '', '', ''],

        /**
         * Test the following scenario: red (r) moves backward (m).
         * m . m
         * . r .
         */
        expect(g.validMove([3,5, 2,6])).toBeFalsy()
        expect(g.validMove([3,5, 4,6])).toBeFalsy()
    })

});

describe('test king valid moves', () => {

    test('test red king move forward', () => {
        let g = new Game('','','',false,'','','',8,8)

        g.checkers[2][4] = 's' // Red king

        /**
         * Test the following scenario: red (r) moves forward (m).
         * . r .
         * m . m
         */
        expect(g.validMove([4,2, 3,3])).toBeTruthy()
        expect(g.validMove([4,2, 5,3])).toBeTruthy()
    })

    test('test red king move backward', () => {
        let g = new Game('','','',false,'','','',8,8)

        g.checkers[2][4] = 's' // Red king

        // Empty space to move to.
        g.checkers[1] = ['', '', '', '', '', '', '', '', ''],

        /**
         * Test the following scenario: red (r) moves backward (m).
         * m . m
         * . r .
         */
        expect(g.validMove([4,2, 3,1])).toBeTruthy()
        expect(g.validMove([4,2, 5,1])).toBeTruthy()
    })

    test('test black king move forward', () => {
        let g = new Game('','','',false,'','','',8,8)

        g.checkers[5][3] = 'c' // Black king

        /**
         * Test the following scenario: black (m) moves forward (m).
         * m . m
         * . b .
         */
        expect(g.validMove([3,5, 2,4])).toBeTruthy()
        expect(g.validMove([3,5, 4,4])).toBeTruthy()
    });

    test('test black king move backward', () => {
        let g = new Game('','','',false,'','','',8,8)

        g.checkers[5][3] = 'c' // Black king

        // Empty space to move to.
        g.checkers[6] = ['', '', '', '', '', '', '', '', ''],

        /**
         * Test the following scenario: red (r) moves backward (m).
         * m . m
         * . r .
         */
        expect(g.validMove([3,5, 2,6])).toBeTruthy()
        expect(g.validMove([3,5, 4,6])).toBeTruthy()
    })

});

describe('test checker must jump opponent', () => {

    test('test red checker must jump black', () => {
        let g = new Game('','','',false,'','','',8,8)

        g.checkers[3][3] = 'b'

        /**
         * Test the following scenario: red (r) must jump black (1).
         * . . r .
         * . b . m
         * 1 . . .
         */
        expect(g.validMove([4,2, 2,4])).toBeTruthy()
        expect(g.validMove([4,2, 5,3])).toBeFalsy()
    })

    test('test black checker must jump red', () => {
        let g = new Game('','','',false,'','','',8,8)

        g.checkers[4][4] = 'r'

        /**
         * Test the following scenario: black (b) must jump red (1).
         * . . . 1
         * m . r .
         * . b . .
         */
        expect(g.validMove([3,5, 5,3])).toBeTruthy()
        expect(g.validMove([3,5, 2,4])).toBeFalsy()
    })

})

describe('test checker cannot jump themselves', () => {

    test('test red checker cannot jump red', () => {
        let g = new Game('','','',false,'','','',8,8)

        g.checkers[3][3] = 'r'

        /**
         * Test the following scenario: red (r) cannot jump red (1).
         * . . r .
         * . r . .
         * 1 . . .
         */
        expect(g.validMove([4,2, 2,4])).toBeFalsy()
    })

    test('test black checker cannot jump black', () => {
        let g = new Game('','','',false,'','','',8,8)

        g.checkers[4][4] = 'b'

        /**
         * Test the following scenario: black (b) cannot jump black (1).
         * . . . 1
         * . . b .
         * . b . .
         */
        expect(g.validMove([3,5, 5,3])).toBeFalsy()
    })

})

describe('test checker can jump multiple times', () => {

    test('test red checker can jump black twice', () => {
        let g = new Game('','','',false,'','','',8,8)

        g.checkers[1][3] = '' // Empty space
        g.checkers[1][7] = '' // Empty space

        g.checkers[4][4] = 'r'
        g.checkers[2][4] = 'r'
        g.checkers[2][6] = 'r'

        /**
         * Test the following scenario: black (b) can jump red (1) twice (2).
         * . 2 . . . 2
         * . . r . r .
         * . . . 1 . .
         * . . r . . .
         * . b . . . .
         */
        expect(g.validMove([3,5, 3,1])).toBeTruthy()
        expect(g.validMove([3,5, 7,1])).toBeTruthy()
    })

    test('test black checker can jump red twice', () => {
        let g = new Game('','','',false,'','','',8,8)

        g.checkers[1][3] = '' // Empty space
        g.checkers[1][7] = '' // Empty space

        g.checkers[3][3] = 'r'
        g.checkers[5][1] = 'r'
        g.checkers[5][3] = 'r'

        /**
         * Test the following scenario: red (r) cannot jump red (1).
         * . . . . r .
         * . . . b . .
         * . . 1 . . .
         * . b . b . .
         * 2 . . . 2 .
         */
        expect(g.validMove([4,2, 0,6])).toBeTruthy()
        expect(g.validMove([4,2, 4,6])).toBeTruthy()
    })
})
