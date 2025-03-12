class CheckersAPI {
  readonly baseUrl: URL

  constructor(url: string) {
    this.baseUrl = new URL(url)
  }

  games(): URL {
    return new URL('games/', this.baseUrl)
  }
  newGame(): URL {
    return new URL('new', this.games())
  }
  game(id: string): URL {
    return new URL(id, this.games())
  }
}

export const checkersAPI = new CheckersAPI(import.meta.env.VITE_CHECKERS_IO_BASE_URL)
