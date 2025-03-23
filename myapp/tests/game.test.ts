import { Game } from '../src/game'


describe('test valid moves', () => {

    test('test empty move', () => {
        let g = new Game('','','',false,'','','',8,8)

        /**
         * Test the following scenario: empty (.) moves forward (.).
         * . . .
         * . . .
         */
        expect(g.validMove([1, 3, 0, 4])).toBeFalsy()
    })

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
         *   2 3 4 5
         * 3 . . . 1
         * 4 m . r .
         * 5 . b . .
         */
        expect(g.validMove([3,5, 5,3])).toBeTruthy()
        expect(g.validMove([3,5, 2,4])).toBeFalsy()
    })

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

     test('test red checker can jump black once or twice', () => {
        let g = new Game('','','',false,'','','',8,8)

        g.checkers[6][0] = '' // Empty space

        g.checkers[3][3] = 'b'
        g.checkers[3][5] = 'b'
        g.checkers[5][1] = 'b'

        /**
         * Test the following scenario: red (r) can jump black (b) once (z) or twice (y).
         *   0 1 2 3 4 5
         * 2 . . . . r .
         * 3 . . . b . .
         * 4 . . z . . .
         * 5 . b . b . .
         * 6 y . . . y .
         */
        expect(g.validMove([4,2, 2,4])).toBeTruthy()
        expect(g.validMove([4,2, 0,6])).toBeTruthy()
        expect(g.validMove([4,2, 6,4])).toBeTruthy()
    })

    test('test black checker can jump red once or twice', () => {
        let g = new Game('','','',false,'','','',8,8)

        g.checkers[1][7] = '' // Empty space

        g.checkers[4][4] = 'r'
        g.checkers[4][2] = 'r'
        g.checkers[2][6] = 'r'

        /**
         * Test the following scenario: black (b) can jump red (r) once (z) or twice (y).
         *   2 3 4 5 6 7
         * 1 . y . . . y
         * 2 . . r . r .
         * 3 . . . z . .
         * 4 . . r . . .
         * 5 . b . . . .
         */
        expect(g.validMove([3,5, 5,3])).toBeTruthy()
        expect(g.validMove([3,5, 1,3])).toBeTruthy()
        expect(g.validMove([3,5, 7,1])).toBeTruthy()
    })

    test('test red king checker can jump black many times', () => {
        let g = new Game('','','',false,'','','',8,8)
        g.checkers = [
            ['', '', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', '', ''],
            ['', '', 'r', '', 'r', '', 'r', '', ''],
            ['', '', '', '', '', '', '', '', ''],
            ['', '', 'r', '', 'r', '', 'r', '', ''],
            ['', '', '', '', '', '', '', '', ''],
            ['', '', 'r', '', 'r', '', 'r', '', ''],
            ['', '', '', '', '', '', '', 'c', ''],
        ]

        let paths = g.findPaths(7, 7)
        expect(paths.length).toBe(8)
    })

})


describe('test apply moves', () => {

    test('test red eats black', () => {
        let g = new Game('','','',false,'','','',8,8)

        g.checkers[3][3] = 'b'

        /**
         * Test the following scenario: red (r) eats black when jumped (1).
         * . . r .
         * . b . m
         * 1 . . .
         */
        g.applyMove([4,2, 2,4])

        expect(g.checkers[2][4]).toBe('')
        expect(g.checkers[4][4]).toBe('')
        expect(g.checkers[4][2]).toBe('r')
    })

    test('test black eats red', () => {
        let g = new Game('','','',false,'','','',8,8)

        g.checkers[4][4] = 'r'

        /**
         * Test the following scenario: black (b) eats red when jumped (1).
         * . . . 1
         * m . r .
         * . b . .
         */
        g.applyMove([3,5, 5,3])

        expect(g.checkers[5][3]).toBe('')
        expect(g.checkers[4][4]).toBe('')
        expect(g.checkers[3][5]).toBe('b')
    })

})