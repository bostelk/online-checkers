import { Game } from "./game"

// In-memory persistence.
const games: Record<string, Game> = {}

export function all() : Record<string, Game> {
    return games
}

export function broadcasted() : Record<string, Game> {
    let filteredGames = {}
    // filter
    for (const [key, game] of Object.entries(games)) {
        if (game.broadcast) {
            delete game.password // side effect.
            filteredGames[key] = game
        }
    }
    return filteredGames;
}

export function findOne(id: string): Game | null {
    if (id in games) {
        return games[id]
    }
    return null
}

export function relate(id: string, game: Game): void {
    if (!(id in games)) {
        games[id] = game
    }
}