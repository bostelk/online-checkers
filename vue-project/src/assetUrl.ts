// Bake imports otherwise image will not load because dynamic dependicies is not supported in Vite.

import aqua_16 from '@/assets/meeple/meeple-aqua-16.png'
import aqua_32 from '@/assets/meeple/meeple-aqua-32.png'
import black_16 from '@/assets/meeple/meeple-black-16.png'
import black_32 from '@/assets/meeple/meeple-black-32.png'
import blue_16 from '@/assets/meeple/meeple-blue-16.png'
import blue_32 from '@/assets/meeple/meeple-blue-32.png'
import fuschia_16 from '@/assets/meeple/meeple-fuschia-16.png'
import fuschia_32 from '@/assets/meeple/meeple-fuschia-32.png'
import gold_16 from '@/assets/meeple/meeple-gold-16.png'
import gold_32 from '@/assets/meeple/meeple-gold-32.png'
import lime_16 from '@/assets/meeple/meeple-lime-16.png'
import lime_32 from '@/assets/meeple/meeple-lime-32.png'
import red_16 from '@/assets/meeple/meeple-red-16.png'
import red_32 from '@/assets/meeple/meeple-red-32.png'
import white_16 from '@/assets/meeple/meeple-white-16.png'
import white_32 from '@/assets/meeple/meeple-white-32.png'
import unknown_16 from '@/assets/meeple/meeple-transparent-16.png'
import unknown_32 from '@/assets/meeple/meeple-transparent-32.png'


export function meepleUrl(color: string, size: number): string {
  const table = {
    aqua: {
      16: aqua_16,
      32: aqua_32,
    },
    black: {
      16: black_16,
      32: black_32,
    },
    blue: {
      16: blue_16,
      32: blue_32,
    },
    fuschia: {
      16: fuschia_16,
      32: fuschia_32,
    },
    gold: {
      16: gold_16,
      32: gold_32,
    },
    lime: {
      16: lime_16,
      32: lime_32,
    },
    red: {
      16: red_16,
      32: red_32,
    },
    white: {
      16: white_16,
      32: white_32,
    },
    unknown: {
      16: unknown_16,
      32: unknown_32
    }
  }
  return table[color][size]
}

import checker_red_16 from '@/assets/checker-red-16.png'
import checker_black_16 from '@/assets/checker-black-16.png'

export function checkerUrl(color: string, size: number): string {
  const table = {
    black: {
      16: checker_black_16,
    },
    red: {
      16: checker_red_16,
    },
  }
  return table[color][size]
}
