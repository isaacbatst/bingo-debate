"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, RotateCcw, Sparkles } from "lucide-react"

// Array com 50 frases placeholder - você pode editar depois
const FRASES_DEBATE = [
  "Frase placeholder 1",
  "Frase placeholder 2",
  "Frase placeholder 3",
  "Frase placeholder 4",
  "Frase placeholder 5",
  "Frase placeholder 6",
  "Frase placeholder 7",
  "Frase placeholder 8",
  "Frase placeholder 9",
  "Frase placeholder 10",
  "Frase placeholder 11",
  "Frase placeholder 12",
  "Frase placeholder 13",
  "Frase placeholder 14",
  "Frase placeholder 15",
  "Frase placeholder 16",
  "Frase placeholder 17",
  "Frase placeholder 18",
  "Frase placeholder 19",
  "Frase placeholder 20",
  "Frase placeholder 21",
  "Frase placeholder 22",
  "Frase placeholder 23",
  "Frase placeholder 24",
  "Frase placeholder 25",
  "Frase placeholder 26",
  "Frase placeholder 27",
  "Frase placeholder 28",
  "Frase placeholder 29",
  "Frase placeholder 30",
  "Frase placeholder 31",
  "Frase placeholder 32",
  "Frase placeholder 33",
  "Frase placeholder 34",
  "Frase placeholder 35",
  "Frase placeholder 36",
  "Frase placeholder 37",
  "Frase placeholder 38",
  "Frase placeholder 39",
  "Frase placeholder 40",
  "Frase placeholder 41",
  "Frase placeholder 42",
  "Frase placeholder 43",
  "Frase placeholder 44",
  "Frase placeholder 45",
  "Frase placeholder 46",
  "Frase placeholder 47",
  "Frase placeholder 48",
  "Frase placeholder 49",
  "Frase placeholder 50",
]

export default function DebateBingo() {
  const [cartela, setCartela] = useState<string[]>([])
  const [marcadas, setMarcadas] = useState<boolean[]>(Array(25).fill(false))
  const [venceu, setVenceu] = useState(false)
  const [pontuacao, setPontuacao] = useState(0)

  // Gerar cartela aleatória
  const gerarCartela = () => {
    const frasesEmbaralhadas = [...FRASES_DEBATE].sort(() => Math.random() - 0.5)
    const novaCartela = frasesEmbaralhadas.slice(0, 25)
    setCartela(novaCartela)
    setMarcadas(Array(25).fill(false))
    setVenceu(false)
    setPontuacao(0)
  }

  // Verificar vitória
  const verificarVitoria = (novasMarcadas: boolean[]) => {
    // Verificar linhas
    for (let i = 0; i < 5; i++) {
      if (novasMarcadas.slice(i * 5, i * 5 + 5).every(Boolean)) return true
    }

    // Verificar colunas
    for (let i = 0; i < 5; i++) {
      if ([0, 1, 2, 3, 4].every((row) => novasMarcadas[row * 5 + i])) return true
    }

    // Verificar diagonais
    if ([0, 6, 12, 18, 24].every((i) => novasMarcadas[i])) return true
    if ([4, 8, 12, 16, 20].every((i) => novasMarcadas[i])) return true

    // Verificar cartela cheia
    if (novasMarcadas.every(Boolean)) return true

    return false
  }

  // Marcar/desmarcar célula
  const toggleCelula = (index: number) => {
    if (venceu) return

    const novasMarcadas = [...marcadas]
    novasMarcadas[index] = !novasMarcadas[index]
    setMarcadas(novasMarcadas)

    const novaPontuacao = novasMarcadas.filter(Boolean).length
    setPontuacao(novaPontuacao)

    if (verificarVitoria(novasMarcadas)) {
      setVenceu(true)
    }
  }

  // Gerar cartela inicial
  useEffect(() => {
    gerarCartela()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="text-yellow-400" />
            BINGO DO DEBATE
            <Sparkles className="text-yellow-400" />
          </h1>
          <p className="text-gray-300">Marque as frases conforme aparecem no debate!</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-4 mb-6">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Marcadas: {pontuacao}/25
          </Badge>
          <Button onClick={gerarCartela} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Nova Cartela
          </Button>
        </div>

        {/* Bingo Grid */}
        <Card className="mb-6 bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-6">
            <div className="grid grid-cols-5 gap-2">
              {cartela.map((frase, index) => (
                <button
                  key={index}
                  onClick={() => toggleCelula(index)}
                  className={`
                    aspect-square p-2 rounded-lg border-2 transition-all duration-300 text-xs font-medium
                    flex items-center justify-center text-center leading-tight
                    ${
                      marcadas[index]
                        ? "bg-green-500 border-green-400 text-white shadow-lg transform scale-105"
                        : "bg-white/90 border-gray-300 text-gray-800 hover:bg-white hover:border-blue-400 hover:shadow-md"
                    }
                    ${venceu ? "cursor-not-allowed" : "cursor-pointer"}
                  `}
                  disabled={venceu}
                >
                  {frase}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vitória */}
        {venceu && (
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300 animate-pulse">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                <Trophy className="w-8 h-8" />
                BINGO!
                <Trophy className="w-8 h-8" />
              </CardTitle>
              <div className="text-white text-lg">🎉 Parabéns! Você completou o bingo! 🎉</div>
              <div className="text-white/90">Pontuação final: {pontuacao}/25 células marcadas</div>
            </CardHeader>
          </Card>
        )}

        {/* Instruções */}
        <Card className="mt-6 bg-white/5 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-center">Como Jogar</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 text-center space-y-2">
            <p>• Clique nas células quando ouvir as frases durante o debate</p>
            <p>• Vença completando uma linha, coluna, diagonal ou cartela inteira</p>
            <p>• Use o botão "Nova Cartela" para embaralhar as frases</p>
            <p>• Edite o array FRASES_DEBATE no código para personalizar</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
